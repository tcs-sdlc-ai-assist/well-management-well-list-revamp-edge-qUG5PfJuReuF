import { useState, useEffect, useMemo, useCallback } from 'react';
import { initialWells } from '../data/initialWells.js';
import { filterWells } from '../utils/filterWells.js';
import { sortWells } from '../utils/sortWells.js';
import { pinActive } from '../utils/pinActive.js';

const STORAGE_KEY = 'wellsData';

/**
 * Attempts to load wells from localStorage.
 * Returns parsed array on success, null on failure.
 * @returns {Array<Object>|null}
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (err) {
    console.error('[useWells] Failed to load from localStorage:', err);
    return null;
  }
}

/**
 * Attempts to persist wells to localStorage.
 * Alerts the user and logs on failure.
 * @param {Array<Object>} wells
 */
function saveToStorage(wells) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wells));
  } catch (err) {
    console.error('[useWells] Failed to save to localStorage:', err);
    alert('Persistence unavailable; changes may not be saved.');
  }
}

/**
 * Custom hook for well list state management.
 * Handles loading, filtering, sorting, pinning, pagination,
 * activation workflow, and localStorage persistence.
 *
 * @returns {{
 *   wells: Array<Object>,
 *   filters: Object,
 *   sortConfig: Object,
 *   currentPage: number,
 *   pageSize: number,
 *   paginatedWells: Array<Object>,
 *   totalFiltered: number,
 *   activeWell: Object|null,
 *   pendingActivationId: string|null,
 *   setFilters: Function,
 *   setSortConfig: Function,
 *   setCurrentPage: Function,
 *   setPageSize: Function,
 *   openActivationModal: Function,
 *   closeActivationModal: Function,
 *   confirmActivation: Function,
 *   handleAction: Function,
 *   reloadWells: Function,
 * }}
 */
export function useWells() {
  const [wells, setWells] = useState(() => {
    const stored = loadFromStorage();
    return stored !== null ? stored : [...initialWells];
  });

  const [filters, setFiltersState] = useState({
    rig: '',
    wellName: '',
    wellId: '',
    operator: '',
    contractor: '',
  });

  const [sortConfig, setSortConfigState] = useState({
    key: 'spudDate',
    direction: 'asc',
  });

  const [currentPage, setCurrentPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [pendingActivationId, setPendingActivationId] = useState(null);

  // Persist wells to localStorage whenever they change
  useEffect(() => {
    saveToStorage(wells);
  }, [wells]);

  // Derived: active well
  const activeWell = useMemo(
    () => wells.find(w => w.status === 'active') ?? null,
    [wells]
  );

  // Derived: filtered → sorted → pinned wells
  const processedWells = useMemo(() => {
    const filtered = filterWells(wells, filters);
    const sorted = sortWells(filtered, sortConfig);
    return pinActive(sorted);
  }, [wells, filters, sortConfig]);

  const totalFiltered = processedWells.length;

  // Derived: paginated slice
  const paginatedWells = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedWells.slice(start, start + pageSize);
  }, [processedWells, currentPage, pageSize]);

  // --- Handlers ---

  /**
   * Updates filter state and resets to page 1.
   * @param {Object} newFilters
   */
  const setFilters = useCallback((newFilters) => {
    setFiltersState(newFilters);
    setCurrentPageState(1);
  }, []);

  /**
   * Updates sort configuration.
   * @param {Object} config
   */
  const setSortConfig = useCallback((config) => {
    setSortConfigState(config);
  }, []);

  /**
   * Sets the current page number.
   * @param {number} pageNum
   */
  const setCurrentPage = useCallback((pageNum) => {
    setCurrentPageState(pageNum);
  }, []);

  /**
   * Updates page size and resets to page 1.
   * @param {number} size
   */
  const setPageSize = useCallback((size) => {
    setPageSizeState(size);
    setCurrentPageState(1);
  }, []);

  /**
   * Opens the activation modal for the given well.
   * @param {Object} well
   */
  const openActivationModal = useCallback((well) => {
    if (!well || !well.id) return;
    setPendingActivationId(well.id);
  }, []);

  /**
   * Closes the activation modal without making changes.
   */
  const closeActivationModal = useCallback(() => {
    setPendingActivationId(null);
  }, []);

  /**
   * Confirms activation: sets the pending well to 'active',
   * all others to 'inactive'. Enforces single-active invariant.
   * Resets page to 1 and closes modal.
   */
  const confirmActivation = useCallback(() => {
    if (!pendingActivationId) return;

    setWells(prev => {
      const updated = prev.map(w => ({
        ...w,
        status: w.id === pendingActivationId ? 'active' : 'inactive',
      }));
      return updated;
    });

    setCurrentPageState(1);
    setPendingActivationId(null);
  }, [pendingActivationId]);

  /**
   * Activates a well directly by id (bypasses modal).
   * Enforces single-active invariant.
   * @param {string} wellId
   */
  const activateWell = useCallback((wellId) => {
    if (!wellId) return;

    setWells(prev => {
      const updated = prev.map(w => ({
        ...w,
        status: w.id === wellId ? 'active' : 'inactive',
      }));
      return updated;
    });

    setCurrentPageState(1);
  }, []);

  /**
   * Generic action handler for well row actions.
   * Supported actions: 'activate' (opens modal).
   * @param {string} action
   * @param {Object} well
   */
  const handleAction = useCallback((action, well) => {
    if (!action || !well) return;

    if (action === 'activate') {
      openActivationModal(well);
    }
  }, [openActivationModal]);

  /**
   * Rehydrates wells from localStorage or falls back to seed data.
   */
  const reloadWells = useCallback(() => {
    const stored = loadFromStorage();
    setWells(stored !== null ? stored : [...initialWells]);
    setCurrentPageState(1);
  }, []);

  return {
    wells,
    filters,
    sortConfig,
    currentPage,
    pageSize,
    paginatedWells,
    totalFiltered,
    activeWell,
    pendingActivationId,
    setFilters,
    setSortConfig,
    setCurrentPage,
    setPageSize,
    activateWell,
    openActivationModal,
    closeActivationModal,
    confirmActivation,
    handleAction,
    reloadWells,
  };
}
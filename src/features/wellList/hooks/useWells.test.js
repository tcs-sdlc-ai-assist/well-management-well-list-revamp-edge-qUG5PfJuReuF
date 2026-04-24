import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWells } from './useWells.js';
import { initialWells } from '../data/initialWells.js';

describe('useWells', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('initializes from seed data when localStorage is empty', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toHaveLength(initialWells.length);
      expect(result.current.wells).toEqual(initialWells);
    });

    it('initializes from localStorage when data is present', () => {
      const stored = [
        {
          id: '99',
          status: 'active',
          rig: 'Rig Stored',
          wellName: 'Stored-1',
          wellId: 'WL-099',
          spudDate: '2024-06-01',
          operator: 'StoredOp',
          contractor: 'StoredCon',
        },
      ];
      localStorage.setItem('wellsData', JSON.stringify(stored));

      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toHaveLength(1);
      expect(result.current.wells[0].id).toBe('99');
    });

    it('falls back to seed data when localStorage contains invalid JSON', () => {
      localStorage.setItem('wellsData', 'not-valid-json');
      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
    });

    it('falls back to seed data when localStorage contains non-array JSON', () => {
      localStorage.setItem('wellsData', JSON.stringify({ id: '1' }));
      const { result } = renderHook(() => useWells());
      expect(result.current.wells).toEqual(initialWells);
    });

    it('initializes currentPage to 1', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.currentPage).toBe(1);
    });

    it('initializes pageSize to 10', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.pageSize).toBe(10);
    });

    it('initializes pendingActivationId to null', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.pendingActivationId).toBeNull();
    });

    it('initializes filters with empty strings', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.filters).toEqual({
        rig: '',
        wellName: '',
        wellId: '',
        operator: '',
        contractor: '',
      });
    });

    it('initializes sortConfig with spudDate ascending', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.sortConfig).toEqual({
        key: 'spudDate',
        direction: 'asc',
      });
    });
  });

  describe('activeWell derived state', () => {
    it('returns the active well from seed data', () => {
      const { result } = renderHook(() => useWells());
      const active = initialWells.find((w) => w.status === 'active');
      expect(result.current.activeWell).not.toBeNull();
      expect(result.current.activeWell.id).toBe(active.id);
    });

    it('returns null when no well is active', () => {
      const allInactive = initialWells.map((w) => ({ ...w, status: 'inactive' }));
      localStorage.setItem('wellsData', JSON.stringify(allInactive));
      const { result } = renderHook(() => useWells());
      expect(result.current.activeWell).toBeNull();
    });
  });

  describe('paginatedWells', () => {
    it('respects pageSize — returns at most pageSize wells', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.paginatedWells.length).toBeLessThanOrEqual(
        result.current.pageSize
      );
    });

    it('returns first pageSize wells on page 1', () => {
      const { result } = renderHook(() => useWells());
      expect(result.current.paginatedWells).toHaveLength(
        Math.min(result.current.pageSize, result.current.totalFiltered)
      );
    });

    it('returns correct slice when pageSize is 10 and there are 11 wells', () => {
      const { result } = renderHook(() => useWells());
      // seed data has 11 wells, pageSize defaults to 10
      expect(result.current.paginatedWells).toHaveLength(10);
      expect(result.current.totalFiltered).toBe(11);
    });

    it('returns remaining wells on last page', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      // 11 wells, pageSize 10 → page 2 has 1 well
      expect(result.current.paginatedWells).toHaveLength(1);
    });

    it('returns correct number of wells when pageSize is changed to 25', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setPageSize(25);
      });

      // 11 wells all fit in one page of 25
      expect(result.current.paginatedWells).toHaveLength(11);
    });
  });

  describe('setFilters', () => {
    it('updates filters state', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setFilters({ ...result.current.filters, rig: 'Alpha' });
      });

      expect(result.current.filters.rig).toBe('Alpha');
    });

    it('resets currentPage to 1 when filters change', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.setFilters({ ...result.current.filters, rig: 'Alpha' });
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('filters paginatedWells based on updated filters', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          wellName: 'Sunrise-1',
        });
      });

      expect(result.current.paginatedWells).toHaveLength(1);
      expect(result.current.paginatedWells[0].wellName).toBe('Sunrise-1');
    });

    it('returns empty paginatedWells when filter matches nothing', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setFilters({
          ...result.current.filters,
          wellName: 'NoSuchWell',
        });
      });

      expect(result.current.paginatedWells).toHaveLength(0);
      expect(result.current.totalFiltered).toBe(0);
    });
  });

  describe('setPageSize', () => {
    it('updates pageSize state', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.pageSize).toBe(25);
    });

    it('resets currentPage to 1 when pageSize changes', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);

      act(() => {
        result.current.setPageSize(25);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('paginatedWells reflects new pageSize', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setPageSize(50);
      });

      expect(result.current.paginatedWells).toHaveLength(
        Math.min(50, result.current.totalFiltered)
      );
    });
  });

  describe('setCurrentPage', () => {
    it('updates currentPage state', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      expect(result.current.currentPage).toBe(2);
    });
  });

  describe('setSortConfig', () => {
    it('updates sortConfig state', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setSortConfig({ key: 'spudDate', direction: 'desc' });
      });

      expect(result.current.sortConfig).toEqual({
        key: 'spudDate',
        direction: 'desc',
      });
    });
  });

  describe('openActivationModal and closeActivationModal', () => {
    it('sets pendingActivationId when openActivationModal is called', () => {
      const { result } = renderHook(() => useWells());
      const well = result.current.wells[1];

      act(() => {
        result.current.openActivationModal(well);
      });

      expect(result.current.pendingActivationId).toBe(well.id);
    });

    it('clears pendingActivationId when closeActivationModal is called', () => {
      const { result } = renderHook(() => useWells());
      const well = result.current.wells[1];

      act(() => {
        result.current.openActivationModal(well);
      });

      act(() => {
        result.current.closeActivationModal();
      });

      expect(result.current.pendingActivationId).toBeNull();
    });

    it('does not set pendingActivationId when well is null', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.openActivationModal(null);
      });

      expect(result.current.pendingActivationId).toBeNull();
    });

    it('does not set pendingActivationId when well has no id', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.openActivationModal({ status: 'inactive' });
      });

      expect(result.current.pendingActivationId).toBeNull();
    });
  });

  describe('confirmActivation', () => {
    it('activates the pending well and deactivates all others', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.openActivationModal(inactiveWell);
      });

      act(() => {
        result.current.confirmActivation();
      });

      const updatedWell = result.current.wells.find((w) => w.id === inactiveWell.id);
      expect(updatedWell.status).toBe('active');

      const otherActive = result.current.wells.filter(
        (w) => w.id !== inactiveWell.id && w.status === 'active'
      );
      expect(otherActive).toHaveLength(0);
    });

    it('enforces single-active-well invariant after confirmActivation', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.openActivationModal(inactiveWell);
      });

      act(() => {
        result.current.confirmActivation();
      });

      const activeWells = result.current.wells.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
    });

    it('clears pendingActivationId after confirmActivation', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.openActivationModal(inactiveWell);
      });

      act(() => {
        result.current.confirmActivation();
      });

      expect(result.current.pendingActivationId).toBeNull();
    });

    it('resets currentPage to 1 after confirmActivation', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.openActivationModal(inactiveWell);
      });

      act(() => {
        result.current.confirmActivation();
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('does nothing when pendingActivationId is null', () => {
      const { result } = renderHook(() => useWells());
      const wellsBefore = result.current.wells;

      act(() => {
        result.current.confirmActivation();
      });

      expect(result.current.wells).toEqual(wellsBefore);
    });
  });

  describe('activateWell', () => {
    it('activates the specified well by id', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.activateWell(inactiveWell.id);
      });

      const updated = result.current.wells.find((w) => w.id === inactiveWell.id);
      expect(updated.status).toBe('active');
    });

    it('enforces single-active-well invariant', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.activateWell(inactiveWell.id);
      });

      const activeWells = result.current.wells.filter((w) => w.status === 'active');
      expect(activeWells).toHaveLength(1);
      expect(activeWells[0].id).toBe(inactiveWell.id);
    });

    it('deactivates the previously active well', () => {
      const { result } = renderHook(() => useWells());
      const previouslyActive = result.current.wells.find((w) => w.status === 'active');
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.activateWell(inactiveWell.id);
      });

      const formerActive = result.current.wells.find((w) => w.id === previouslyActive.id);
      expect(formerActive.status).toBe('inactive');
    });

    it('resets currentPage to 1 after activateWell', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.activateWell(inactiveWell.id);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('does nothing when wellId is falsy', () => {
      const { result } = renderHook(() => useWells());
      const wellsBefore = result.current.wells.map((w) => ({ ...w }));

      act(() => {
        result.current.activateWell(null);
      });

      expect(result.current.wells).toEqual(wellsBefore);
    });
  });

  describe('localStorage persistence', () => {
    it('persists wells to localStorage on mount', () => {
      renderHook(() => useWells());
      const stored = JSON.parse(localStorage.getItem('wellsData'));
      expect(stored).toEqual(initialWells);
    });

    it('persists updated wells to localStorage after activation', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.activateWell(inactiveWell.id);
      });

      const stored = JSON.parse(localStorage.getItem('wellsData'));
      const storedWell = stored.find((w) => w.id === inactiveWell.id);
      expect(storedWell.status).toBe('active');

      const activeCount = stored.filter((w) => w.status === 'active').length;
      expect(activeCount).toBe(1);
    });

    it('persists wells to localStorage after confirmActivation', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.openActivationModal(inactiveWell);
      });

      act(() => {
        result.current.confirmActivation();
      });

      const stored = JSON.parse(localStorage.getItem('wellsData'));
      const storedWell = stored.find((w) => w.id === inactiveWell.id);
      expect(storedWell.status).toBe('active');
    });
  });

  describe('handleAction', () => {
    it('opens activation modal when action is activate', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.handleAction('activate', inactiveWell);
      });

      expect(result.current.pendingActivationId).toBe(inactiveWell.id);
    });

    it('does nothing when action is unknown', () => {
      const { result } = renderHook(() => useWells());
      const inactiveWell = result.current.wells.find((w) => w.status === 'inactive');

      act(() => {
        result.current.handleAction('unknown', inactiveWell);
      });

      expect(result.current.pendingActivationId).toBeNull();
    });

    it('does nothing when action is null', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.handleAction(null, result.current.wells[0]);
      });

      expect(result.current.pendingActivationId).toBeNull();
    });

    it('does nothing when well is null', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.handleAction('activate', null);
      });

      expect(result.current.pendingActivationId).toBeNull();
    });
  });

  describe('reloadWells', () => {
    it('reloads wells from localStorage when data is present', () => {
      const stored = [
        {
          id: '99',
          status: 'active',
          rig: 'Rig Stored',
          wellName: 'Stored-1',
          wellId: 'WL-099',
          spudDate: '2024-06-01',
          operator: 'StoredOp',
          contractor: 'StoredCon',
        },
      ];
      localStorage.setItem('wellsData', JSON.stringify(stored));

      const { result } = renderHook(() => useWells());

      // Manually clear localStorage and set new data to simulate external change
      localStorage.setItem('wellsData', JSON.stringify(initialWells));

      act(() => {
        result.current.reloadWells();
      });

      expect(result.current.wells).toEqual(initialWells);
    });

    it('falls back to seed data when localStorage is empty on reload', () => {
      const { result } = renderHook(() => useWells());

      localStorage.clear();

      act(() => {
        result.current.reloadWells();
      });

      expect(result.current.wells).toEqual(initialWells);
    });

    it('resets currentPage to 1 on reload', () => {
      const { result } = renderHook(() => useWells());

      act(() => {
        result.current.setCurrentPage(2);
      });

      act(() => {
        result.current.reloadWells();
      });

      expect(result.current.currentPage).toBe(1);
    });
  });
});
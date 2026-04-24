/**
 * Pure filtering utility for well list.
 * Applies case-insensitive, partial-match substring filtering on
 * rig, wellName, wellId, operator, and contractor fields.
 * Multiple filters combine with AND logic.
 *
 * @param {Array<Object>} wells - Array of well objects to filter
 * @param {Object} filters - Filter criteria object
 * @param {string} [filters.rig] - Partial match filter for rig field
 * @param {string} [filters.wellName] - Partial match filter for wellName field
 * @param {string} [filters.wellId] - Partial match filter for wellId field
 * @param {string} [filters.operator] - Partial match filter for operator field
 * @param {string} [filters.contractor] - Partial match filter for contractor field
 * @returns {Array<Object>} New filtered array without mutating input
 */
export function filterWells(wells, filters) {
  if (!wells || !Array.isArray(wells)) {
    return [];
  }

  if (!filters || typeof filters !== 'object') {
    return [...wells];
  }

  const { rig, wellName, wellId, operator, contractor } = filters;

  return wells.filter(well => {
    if (rig && !well.rig?.toLowerCase().includes(rig.toLowerCase())) {
      return false;
    }
    if (wellName && !well.wellName?.toLowerCase().includes(wellName.toLowerCase())) {
      return false;
    }
    if (wellId && !well.wellId?.toLowerCase().includes(wellId.toLowerCase())) {
      return false;
    }
    if (operator && !well.operator?.toLowerCase().includes(operator.toLowerCase())) {
      return false;
    }
    if (contractor && !well.contractor?.toLowerCase().includes(contractor.toLowerCase())) {
      return false;
    }
    return true;
  });
}
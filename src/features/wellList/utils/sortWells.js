/**
 * Pure sorting utility for well list by spud date.
 *
 * @param {Array<Object>} wells - Array of well objects to sort
 * @param {Object} sortConfig - Sort configuration object
 * @param {string} sortConfig.key - Field to sort by (e.g., 'spudDate')
 * @param {'asc'|'desc'} sortConfig.direction - Sort direction
 * @returns {Array<Object>} New sorted array without mutating input
 */
export function sortWells(wells, sortConfig) {
  if (!wells || !Array.isArray(wells)) {
    return [];
  }

  if (!sortConfig || typeof sortConfig !== 'object') {
    return [...wells];
  }

  const { key, direction } = sortConfig;

  if (!key || !direction) {
    return [...wells];
  }

  return [...wells].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    let aCompare = aVal;
    let bCompare = bVal;

    if (key === 'spudDate') {
      aCompare = new Date(aVal).getTime();
      bCompare = new Date(bVal).getTime();

      if (isNaN(aCompare) && isNaN(bCompare)) return 0;
      if (isNaN(aCompare)) return 1;
      if (isNaN(bCompare)) return -1;
    }

    if (aCompare < bCompare) return direction === 'asc' ? -1 : 1;
    if (aCompare > bCompare) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
/**
 * Pure utility to pin the active well to the top of the well list.
 *
 * Pinning invariant: At most one well has status === 'active' at any time.
 * If an active well exists in the input array, it is moved to index 0.
 * All other wells retain their relative order.
 * If no active well exists, the array is returned unchanged (new reference).
 * The input array is never mutated.
 *
 * @param {Array<Object>} wells - Array of well objects to pin
 * @returns {Array<Object>} New array with active well at index 0 (if present)
 */
export function pinActive(wells) {
  if (!wells || !Array.isArray(wells)) {
    return [];
  }

  const activeIndex = wells.findIndex(well => well.status === 'active');

  if (activeIndex === -1) {
    return [...wells];
  }

  if (activeIndex === 0) {
    return [...wells];
  }

  const result = [...wells];
  const [activeWell] = result.splice(activeIndex, 1);
  return [activeWell, ...result];
}
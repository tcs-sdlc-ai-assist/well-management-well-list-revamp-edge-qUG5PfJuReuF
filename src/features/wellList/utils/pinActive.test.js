import { describe, it, expect } from 'vitest';
import { pinActive } from './pinActive.js';

const mockWells = [
  {
    id: '1',
    status: 'inactive',
    rig: 'Rig Alpha',
    wellName: 'Sunrise-1',
    wellId: 'WL-001',
    spudDate: '2024-01-15',
    operator: 'PetroCore Inc.',
    contractor: 'DrillTech Solutions',
  },
  {
    id: '2',
    status: 'inactive',
    rig: 'Rig Beta',
    wellName: 'Horizon-2',
    wellId: 'WL-002',
    spudDate: '2024-02-20',
    operator: 'OceanDrill Ltd.',
    contractor: 'GlobalRig Services',
  },
  {
    id: '3',
    status: 'active',
    rig: 'Rig Gamma',
    wellName: 'Deepwater-3',
    wellId: 'WL-003',
    spudDate: '2024-03-10',
    operator: 'BlueWave Energy',
    contractor: 'PrecisionDrill Co.',
  },
  {
    id: '4',
    status: 'inactive',
    rig: 'Rig Delta',
    wellName: 'Apex-4',
    wellId: 'WL-004',
    spudDate: '2024-04-05',
    operator: 'TerraFuel Corp.',
    contractor: 'IronBit Drilling',
  },
];

describe('pinActive', () => {
  describe('edge cases', () => {
    it('returns empty array when wells is null', () => {
      const result = pinActive(null);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = pinActive(undefined);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is not an array', () => {
      const result = pinActive('not-an-array');
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is a number', () => {
      const result = pinActive(42);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is an object', () => {
      const result = pinActive({ id: '1', status: 'active' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells array is empty', () => {
      const result = pinActive([]);
      expect(result).toEqual([]);
    });
  });

  describe('no active well', () => {
    it('returns array unchanged when no well has status active', () => {
      const allInactive = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(allInactive);
      expect(result).toEqual(allInactive);
    });

    it('returns a new array reference when no active well exists', () => {
      const allInactive = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
      ];
      const result = pinActive(allInactive);
      expect(result).not.toBe(allInactive);
    });

    it('preserves original order when no active well exists', () => {
      const allInactive = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(allInactive);
      expect(result.map((w) => w.id)).toEqual(['1', '2', '3']);
    });

    it('returns all wells when no active well exists', () => {
      const allInactive = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(allInactive);
      expect(result).toHaveLength(3);
    });
  });

  describe('active well is moved to index 0', () => {
    it('moves active well from last position to index 0', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'active' },
      ];
      const result = pinActive(wells);
      expect(result[0].id).toBe('3');
    });

    it('moves active well from middle position to index 0', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'active' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result[0].id).toBe('2');
    });

    it('moves active well from index 2 to index 0 using mockWells', () => {
      const result = pinActive(mockWells);
      expect(result[0].id).toBe('3');
    });

    it('returns all wells after pinning active well', () => {
      const result = pinActive(mockWells);
      expect(result).toHaveLength(mockWells.length);
    });

    it('preserves relative order of inactive wells after pinning', () => {
      const result = pinActive(mockWells);
      const inactiveIds = result.slice(1).map((w) => w.id);
      expect(inactiveIds).toEqual(['1', '2', '4']);
    });

    it('places active well at index 0 when it is the last element', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
        { id: '4', status: 'active' },
      ];
      const result = pinActive(wells);
      expect(result[0].id).toBe('4');
      expect(result[0].status).toBe('active');
    });

    it('places active well at index 0 when it is in the middle of a larger list', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'active' },
        { id: '4', status: 'inactive' },
        { id: '5', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result[0].id).toBe('3');
      expect(result[0].status).toBe('active');
    });

    it('preserves relative order of all other wells after pinning from middle', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'active' },
        { id: '4', status: 'inactive' },
        { id: '5', status: 'inactive' },
      ];
      const result = pinActive(wells);
      const remainingIds = result.slice(1).map((w) => w.id);
      expect(remainingIds).toEqual(['1', '2', '4', '5']);
    });

    it('result contains the same well objects as input', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'active' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result).toHaveLength(3);
      const resultIds = result.map((w) => w.id).sort();
      expect(resultIds).toEqual(['1', '2', '3']);
    });
  });

  describe('active well already at index 0', () => {
    it('returns array with active well still at index 0 when already first', () => {
      const wells = [
        { id: '1', status: 'active' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result[0].id).toBe('1');
      expect(result[0].status).toBe('active');
    });

    it('returns a new array reference when active well is already at index 0', () => {
      const wells = [
        { id: '1', status: 'active' },
        { id: '2', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result).not.toBe(wells);
    });

    it('preserves all wells when active well is already at index 0', () => {
      const wells = [
        { id: '1', status: 'active' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const result = pinActive(wells);
      expect(result).toHaveLength(3);
      expect(result.map((w) => w.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('single-well array', () => {
    it('returns single active well at index 0', () => {
      const wells = [{ id: '1', status: 'active' }];
      const result = pinActive(wells);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].status).toBe('active');
    });

    it('returns single inactive well unchanged', () => {
      const wells = [{ id: '1', status: 'inactive' }];
      const result = pinActive(wells);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns a new array reference for single-element array', () => {
      const wells = [{ id: '1', status: 'active' }];
      const result = pinActive(wells);
      expect(result).not.toBe(wells);
    });
  });

  describe('does not mutate input array', () => {
    it('does not mutate the original array when active well is moved', () => {
      const original = [...mockWells];
      const originalIds = original.map((w) => w.id);
      pinActive(mockWells);
      expect(mockWells.map((w) => w.id)).toEqual(originalIds);
    });

    it('does not mutate the original array when no active well exists', () => {
      const allInactive = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const originalIds = allInactive.map((w) => w.id);
      pinActive(allInactive);
      expect(allInactive.map((w) => w.id)).toEqual(originalIds);
    });

    it('does not mutate the original array when active well is already at index 0', () => {
      const wells = [
        { id: '1', status: 'active' },
        { id: '2', status: 'inactive' },
        { id: '3', status: 'inactive' },
      ];
      const originalIds = wells.map((w) => w.id);
      pinActive(wells);
      expect(wells.map((w) => w.id)).toEqual(originalIds);
    });

    it('returns a new array reference in all cases', () => {
      const wells = [
        { id: '1', status: 'inactive' },
        { id: '2', status: 'active' },
      ];
      const result = pinActive(wells);
      expect(result).not.toBe(wells);
    });
  });
});
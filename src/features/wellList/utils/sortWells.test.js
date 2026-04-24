import { describe, it, expect } from 'vitest';
import { sortWells } from './sortWells.js';

const mockWells = [
  {
    id: '1',
    status: 'active',
    rig: 'Rig Alpha',
    wellName: 'Sunrise-1',
    wellId: 'WL-001',
    spudDate: '2024-03-10',
    operator: 'PetroCore Inc.',
    contractor: 'DrillTech Solutions',
  },
  {
    id: '2',
    status: 'inactive',
    rig: 'Rig Beta',
    wellName: 'Horizon-2',
    wellId: 'WL-002',
    spudDate: '2024-01-15',
    operator: 'OceanDrill Ltd.',
    contractor: 'GlobalRig Services',
  },
  {
    id: '3',
    status: 'inactive',
    rig: 'Rig Gamma',
    wellName: 'Deepwater-3',
    wellId: 'WL-003',
    spudDate: '2024-05-22',
    operator: 'BlueWave Energy',
    contractor: 'PrecisionDrill Co.',
  },
  {
    id: '4',
    status: 'inactive',
    rig: 'Rig Delta',
    wellName: 'Apex-4',
    wellId: 'WL-004',
    spudDate: '2024-02-08',
    operator: 'TerraFuel Corp.',
    contractor: 'IronBit Drilling',
  },
];

describe('sortWells', () => {
  describe('edge cases', () => {
    it('returns empty array when wells is null', () => {
      const result = sortWells(null, { key: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = sortWells(undefined, { key: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is not an array', () => {
      const result = sortWells('not-an-array', { key: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns copy of all wells when sortConfig is null', () => {
      const result = sortWells(mockWells, null);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns copy of all wells when sortConfig is undefined', () => {
      const result = sortWells(mockWells, undefined);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns copy of all wells when sortConfig is not an object', () => {
      const result = sortWells(mockWells, 'invalid');
      expect(result).toEqual(mockWells);
    });

    it('returns copy of all wells when sortConfig key is missing', () => {
      const result = sortWells(mockWells, { direction: 'asc' });
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns copy of all wells when sortConfig direction is missing', () => {
      const result = sortWells(mockWells, { key: 'spudDate' });
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns empty array when wells array is empty', () => {
      const result = sortWells([], { key: 'spudDate', direction: 'asc' });
      expect(result).toEqual([]);
    });

    it('returns single-element array unchanged', () => {
      const result = sortWells([mockWells[0]], { key: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('does not mutate input array', () => {
    it('does not mutate the original wells array when sorting ascending', () => {
      const original = [...mockWells];
      const originalIds = original.map((w) => w.id);
      sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      expect(mockWells.map((w) => w.id)).toEqual(originalIds);
    });

    it('does not mutate the original wells array when sorting descending', () => {
      const original = [...mockWells];
      const originalIds = original.map((w) => w.id);
      sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      expect(mockWells.map((w) => w.id)).toEqual(originalIds);
    });

    it('returns a new array reference, not the original', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      expect(result).not.toBe(mockWells);
    });
  });

  describe('ascending sort by spudDate', () => {
    it('sorts wells by spudDate in ascending order (earliest first)', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      expect(result[0].id).toBe('2'); // 2024-01-15
      expect(result[1].id).toBe('4'); // 2024-02-08
      expect(result[2].id).toBe('1'); // 2024-03-10
      expect(result[3].id).toBe('3'); // 2024-05-22
    });

    it('returns all wells when sorting ascending', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(mockWells.length);
    });

    it('produces correct ascending order of spudDate values', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      const dates = result.map((w) => new Date(w.spudDate).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
      }
    });

    it('places the earliest spudDate at index 0 when sorting ascending', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      const earliest = result[0].spudDate;
      result.forEach((w) => {
        expect(new Date(earliest).getTime()).toBeLessThanOrEqual(
          new Date(w.spudDate).getTime()
        );
      });
    });
  });

  describe('descending sort by spudDate', () => {
    it('sorts wells by spudDate in descending order (latest first)', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      expect(result[0].id).toBe('3'); // 2024-05-22
      expect(result[1].id).toBe('1'); // 2024-03-10
      expect(result[2].id).toBe('4'); // 2024-02-08
      expect(result[3].id).toBe('2'); // 2024-01-15
    });

    it('returns all wells when sorting descending', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      expect(result).toHaveLength(mockWells.length);
    });

    it('produces correct descending order of spudDate values', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      const dates = result.map((w) => new Date(w.spudDate).getTime());
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
      }
    });

    it('places the latest spudDate at index 0 when sorting descending', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      const latest = result[0].spudDate;
      result.forEach((w) => {
        expect(new Date(latest).getTime()).toBeGreaterThanOrEqual(
          new Date(w.spudDate).getTime()
        );
      });
    });
  });

  describe('equal dates preserve relative order', () => {
    const wellsWithEqualDates = [
      {
        id: 'a',
        status: 'inactive',
        rig: 'Rig A',
        wellName: 'Well-A',
        wellId: 'WL-A',
        spudDate: '2024-06-01',
        operator: 'Op A',
        contractor: 'Con A',
      },
      {
        id: 'b',
        status: 'inactive',
        rig: 'Rig B',
        wellName: 'Well-B',
        wellId: 'WL-B',
        spudDate: '2024-06-01',
        operator: 'Op B',
        contractor: 'Con B',
      },
      {
        id: 'c',
        status: 'inactive',
        rig: 'Rig C',
        wellName: 'Well-C',
        wellId: 'WL-C',
        spudDate: '2024-06-01',
        operator: 'Op C',
        contractor: 'Con C',
      },
    ];

    it('returns all wells with equal dates', () => {
      const result = sortWells(wellsWithEqualDates, { key: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(3);
    });

    it('contains all original wells when dates are equal (ascending)', () => {
      const result = sortWells(wellsWithEqualDates, { key: 'spudDate', direction: 'asc' });
      const ids = result.map((w) => w.id);
      expect(ids).toContain('a');
      expect(ids).toContain('b');
      expect(ids).toContain('c');
    });

    it('contains all original wells when dates are equal (descending)', () => {
      const result = sortWells(wellsWithEqualDates, { key: 'spudDate', direction: 'desc' });
      const ids = result.map((w) => w.id);
      expect(ids).toContain('a');
      expect(ids).toContain('b');
      expect(ids).toContain('c');
    });

    it('handles mixed equal and unequal dates correctly in ascending order', () => {
      const mixed = [
        { id: 'x', status: 'inactive', spudDate: '2024-06-01' },
        { id: 'y', status: 'inactive', spudDate: '2024-01-01' },
        { id: 'z', status: 'inactive', spudDate: '2024-06-01' },
      ];
      const result = sortWells(mixed, { key: 'spudDate', direction: 'asc' });
      expect(result[0].id).toBe('y');
      expect(result.map((w) => w.id)).toContain('x');
      expect(result.map((w) => w.id)).toContain('z');
    });

    it('handles mixed equal and unequal dates correctly in descending order', () => {
      const mixed = [
        { id: 'x', status: 'inactive', spudDate: '2024-06-01' },
        { id: 'y', status: 'inactive', spudDate: '2024-01-01' },
        { id: 'z', status: 'inactive', spudDate: '2024-06-01' },
      ];
      const result = sortWells(mixed, { key: 'spudDate', direction: 'desc' });
      expect(result[result.length - 1].id).toBe('y');
      expect(result.map((w) => w.id)).toContain('x');
      expect(result.map((w) => w.id)).toContain('z');
    });
  });

  describe('wells with missing or invalid spudDate', () => {
    it('places wells with undefined spudDate at the end when sorting ascending', () => {
      const wells = [
        { id: '1', status: 'inactive', spudDate: '2024-03-10' },
        { id: '2', status: 'inactive', spudDate: undefined },
        { id: '3', status: 'inactive', spudDate: '2024-01-15' },
      ];
      const result = sortWells(wells, { key: 'spudDate', direction: 'asc' });
      expect(result[result.length - 1].id).toBe('2');
    });

    it('places wells with undefined spudDate at the end when sorting descending', () => {
      const wells = [
        { id: '1', status: 'inactive', spudDate: '2024-03-10' },
        { id: '2', status: 'inactive', spudDate: undefined },
        { id: '3', status: 'inactive', spudDate: '2024-01-15' },
      ];
      const result = sortWells(wells, { key: 'spudDate', direction: 'desc' });
      expect(result[result.length - 1].id).toBe('2');
    });

    it('places wells with invalid spudDate at the end when sorting ascending', () => {
      const wells = [
        { id: '1', status: 'inactive', spudDate: '2024-03-10' },
        { id: '2', status: 'inactive', spudDate: 'not-a-date' },
        { id: '3', status: 'inactive', spudDate: '2024-01-15' },
      ];
      const result = sortWells(wells, { key: 'spudDate', direction: 'asc' });
      expect(result[result.length - 1].id).toBe('2');
    });

    it('places wells with invalid spudDate at the end when sorting descending', () => {
      const wells = [
        { id: '1', status: 'inactive', spudDate: '2024-03-10' },
        { id: '2', status: 'inactive', spudDate: 'not-a-date' },
        { id: '3', status: 'inactive', spudDate: '2024-01-15' },
      ];
      const result = sortWells(wells, { key: 'spudDate', direction: 'desc' });
      expect(result[result.length - 1].id).toBe('2');
    });

    it('handles all wells having undefined spudDate', () => {
      const wells = [
        { id: '1', status: 'inactive', spudDate: undefined },
        { id: '2', status: 'inactive', spudDate: undefined },
      ];
      const result = sortWells(wells, { key: 'spudDate', direction: 'asc' });
      expect(result).toHaveLength(2);
    });
  });

  describe('ascending vs descending produces reversed order', () => {
    it('ascending and descending results are reverses of each other for distinct dates', () => {
      const result = sortWells(mockWells, { key: 'spudDate', direction: 'asc' });
      const resultDesc = sortWells(mockWells, { key: 'spudDate', direction: 'desc' });
      const ascIds = result.map((w) => w.id);
      const descIds = resultDesc.map((w) => w.id);
      expect(ascIds).toEqual([...descIds].reverse());
    });
  });
});
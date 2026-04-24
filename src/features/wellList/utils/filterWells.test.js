import { describe, it, expect } from 'vitest';
import { filterWells } from './filterWells.js';

const mockWells = [
  {
    id: '1',
    status: 'active',
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
    status: 'inactive',
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
    contractor: 'DrillTech Solutions',
  },
];

describe('filterWells', () => {
  describe('edge cases', () => {
    it('returns empty array when wells is null', () => {
      const result = filterWells(null, {});
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is undefined', () => {
      const result = filterWells(undefined, {});
      expect(result).toEqual([]);
    });

    it('returns empty array when wells is not an array', () => {
      const result = filterWells('not-an-array', {});
      expect(result).toEqual([]);
    });

    it('returns copy of all wells when filters is null', () => {
      const result = filterWells(mockWells, null);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns copy of all wells when filters is undefined', () => {
      const result = filterWells(mockWells, undefined);
      expect(result).toEqual(mockWells);
      expect(result).not.toBe(mockWells);
    });

    it('returns copy of all wells when filters is not an object', () => {
      const result = filterWells(mockWells, 'invalid');
      expect(result).toEqual(mockWells);
    });

    it('does not mutate the original wells array', () => {
      const original = [...mockWells];
      filterWells(mockWells, { rig: 'Alpha' });
      expect(mockWells).toEqual(original);
    });
  });

  describe('empty filters returns all wells', () => {
    it('returns all wells when all filter fields are empty strings', () => {
      const filters = { rig: '', wellName: '', wellId: '', operator: '', contractor: '' };
      const result = filterWells(mockWells, filters);
      expect(result).toHaveLength(mockWells.length);
      expect(result).toEqual(mockWells);
    });

    it('returns all wells when filters object has no keys', () => {
      const result = filterWells(mockWells, {});
      expect(result).toHaveLength(mockWells.length);
      expect(result).toEqual(mockWells);
    });
  });

  describe('filter by rig', () => {
    it('returns wells matching rig substring (exact case)', () => {
      const result = filterWells(mockWells, { rig: 'Rig Alpha' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns wells matching rig substring (partial match)', () => {
      const result = filterWells(mockWells, { rig: 'Alpha' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('matches rig case-insensitively (lowercase input)', () => {
      const result = filterWells(mockWells, { rig: 'rig alpha' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('matches rig case-insensitively (uppercase input)', () => {
      const result = filterWells(mockWells, { rig: 'RIG BETA' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('matches rig case-insensitively (mixed case input)', () => {
      const result = filterWells(mockWells, { rig: 'rIg GaMmA' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('returns multiple wells when rig filter matches more than one', () => {
      const result = filterWells(mockWells, { rig: 'Rig' });
      expect(result).toHaveLength(4);
    });

    it('returns empty array when rig filter matches nothing', () => {
      const result = filterWells(mockWells, { rig: 'Nonexistent Rig' });
      expect(result).toHaveLength(0);
    });
  });

  describe('filter by wellName', () => {
    it('returns wells matching wellName substring (exact case)', () => {
      const result = filterWells(mockWells, { wellName: 'Sunrise-1' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns wells matching wellName substring (partial match)', () => {
      const result = filterWells(mockWells, { wellName: 'Horizon' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('matches wellName case-insensitively (lowercase input)', () => {
      const result = filterWells(mockWells, { wellName: 'sunrise-1' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('matches wellName case-insensitively (uppercase input)', () => {
      const result = filterWells(mockWells, { wellName: 'DEEPWATER-3' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('returns multiple wells when wellName filter matches more than one', () => {
      const result = filterWells(mockWells, { wellName: '-' });
      expect(result).toHaveLength(4);
    });

    it('returns empty array when wellName filter matches nothing', () => {
      const result = filterWells(mockWells, { wellName: 'NoSuchWell' });
      expect(result).toHaveLength(0);
    });
  });

  describe('filter by wellId', () => {
    it('returns wells matching wellId substring (exact case)', () => {
      const result = filterWells(mockWells, { wellId: 'WL-001' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns wells matching wellId substring (partial match)', () => {
      const result = filterWells(mockWells, { wellId: 'WL-00' });
      expect(result).toHaveLength(4);
    });

    it('matches wellId case-insensitively (lowercase input)', () => {
      const result = filterWells(mockWells, { wellId: 'wl-002' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('matches wellId case-insensitively (uppercase input)', () => {
      const result = filterWells(mockWells, { wellId: 'WL-003' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('returns empty array when wellId filter matches nothing', () => {
      const result = filterWells(mockWells, { wellId: 'WL-999' });
      expect(result).toHaveLength(0);
    });
  });

  describe('filter by operator', () => {
    it('returns wells matching operator substring (exact case)', () => {
      const result = filterWells(mockWells, { operator: 'PetroCore Inc.' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns wells matching operator substring (partial match)', () => {
      const result = filterWells(mockWells, { operator: 'OceanDrill' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('matches operator case-insensitively (lowercase input)', () => {
      const result = filterWells(mockWells, { operator: 'bluewave energy' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('matches operator case-insensitively (uppercase input)', () => {
      const result = filterWells(mockWells, { operator: 'TERRAFUEL CORP.' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('returns empty array when operator filter matches nothing', () => {
      const result = filterWells(mockWells, { operator: 'Unknown Operator' });
      expect(result).toHaveLength(0);
    });
  });

  describe('filter by contractor', () => {
    it('returns wells matching contractor substring (exact case)', () => {
      const result = filterWells(mockWells, { contractor: 'DrillTech Solutions' });
      expect(result).toHaveLength(2);
      expect(result.map((w) => w.id)).toEqual(['1', '4']);
    });

    it('returns wells matching contractor substring (partial match)', () => {
      const result = filterWells(mockWells, { contractor: 'GlobalRig' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('matches contractor case-insensitively (lowercase input)', () => {
      const result = filterWells(mockWells, { contractor: 'precisiondrill co.' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('matches contractor case-insensitively (uppercase input)', () => {
      const result = filterWells(mockWells, { contractor: 'DRILLTECH SOLUTIONS' });
      expect(result).toHaveLength(2);
    });

    it('returns empty array when contractor filter matches nothing', () => {
      const result = filterWells(mockWells, { contractor: 'Unknown Contractor' });
      expect(result).toHaveLength(0);
    });
  });

  describe('multiple filters combine with AND logic', () => {
    it('returns wells matching both rig and wellName filters', () => {
      const result = filterWells(mockWells, { rig: 'Alpha', wellName: 'Sunrise' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns empty array when rig matches but wellName does not', () => {
      const result = filterWells(mockWells, { rig: 'Alpha', wellName: 'Horizon' });
      expect(result).toHaveLength(0);
    });

    it('returns wells matching rig, operator, and contractor simultaneously', () => {
      const result = filterWells(mockWells, {
        rig: 'Alpha',
        operator: 'PetroCore',
        contractor: 'DrillTech',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns empty array when all filters are set but no well matches all', () => {
      const result = filterWells(mockWells, {
        rig: 'Alpha',
        wellName: 'Horizon',
        wellId: 'WL-001',
        operator: 'PetroCore',
        contractor: 'DrillTech',
      });
      expect(result).toHaveLength(0);
    });

    it('returns wells matching wellId and contractor filters', () => {
      const result = filterWells(mockWells, { wellId: 'WL-004', contractor: 'DrillTech' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('returns wells matching operator and contractor filters with multiple results', () => {
      const result = filterWells(mockWells, { contractor: 'DrillTech', rig: 'Rig' });
      expect(result).toHaveLength(2);
      expect(result.map((w) => w.id)).toEqual(['1', '4']);
    });

    it('applies AND logic across all five filter fields', () => {
      const result = filterWells(mockWells, {
        rig: 'Beta',
        wellName: 'Horizon',
        wellId: 'WL-002',
        operator: 'OceanDrill',
        contractor: 'GlobalRig',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('no matches returns empty array', () => {
    it('returns empty array when single filter matches nothing', () => {
      const result = filterWells(mockWells, { rig: 'Rig Omega' });
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('returns empty array when multiple filters together match nothing', () => {
      const result = filterWells(mockWells, { rig: 'Alpha', contractor: 'GlobalRig' });
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells array is empty', () => {
      const result = filterWells([], { rig: 'Alpha' });
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('returns empty array when wells array is empty and filters are empty', () => {
      const result = filterWells([], {});
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
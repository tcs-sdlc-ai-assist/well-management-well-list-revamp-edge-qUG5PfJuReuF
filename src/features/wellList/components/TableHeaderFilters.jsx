import PropTypes from 'prop-types';
import { SearchIcon } from '../../../shared/icons/SearchIcon.jsx';

function FilterInput({ field, value, placeholder, onFilterChange }) {
  const handleChange = (e) => {
    onFilterChange(field, e.target.value);
  };

  return (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-2 w-3.5 h-3.5 text-text-muted pointer-events-none shrink-0" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={`Filter by ${placeholder}`}
        className="w-full pl-7 pr-2 py-1.5 text-xs rounded bg-background-primary text-text-primary placeholder-text-muted border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-colors duration-150"
      />
    </div>
  );
}

FilterInput.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export function TableHeaderFilters({ filters, onFilterChange }) {
  return (
    <tr className="bg-background-secondary border-b border-border-primary">
      {/* Status column — no filter */}
      <td className="px-4 py-2" />

      {/* Rig */}
      <td className="px-4 py-2">
        <FilterInput
          field="rig"
          value={filters.rig ?? ''}
          placeholder="Rig"
          onFilterChange={onFilterChange}
        />
      </td>

      {/* Well Name */}
      <td className="px-4 py-2">
        <FilterInput
          field="wellName"
          value={filters.wellName ?? ''}
          placeholder="Well Name"
          onFilterChange={onFilterChange}
        />
      </td>

      {/* Well ID */}
      <td className="px-4 py-2">
        <FilterInput
          field="wellId"
          value={filters.wellId ?? ''}
          placeholder="Well ID"
          onFilterChange={onFilterChange}
        />
      </td>

      {/* Spud Date column — no filter */}
      <td className="px-4 py-2" />

      {/* Operator */}
      <td className="px-4 py-2">
        <FilterInput
          field="operator"
          value={filters.operator ?? ''}
          placeholder="Operator"
          onFilterChange={onFilterChange}
        />
      </td>

      {/* Contractor */}
      <td className="px-4 py-2">
        <FilterInput
          field="contractor"
          value={filters.contractor ?? ''}
          placeholder="Contractor"
          onFilterChange={onFilterChange}
        />
      </td>

      {/* Actions column — no filter */}
      <td className="px-4 py-2" />
    </tr>
  );
}

TableHeaderFilters.propTypes = {
  filters: PropTypes.shape({
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TableHeaderFilters;
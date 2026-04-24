import PropTypes from 'prop-types';
import { TableHeaderFilters } from './TableHeaderFilters.jsx';
import { WellRow } from './WellRow.jsx';
import { SortIcon } from '../../../shared/icons/SortIcon.jsx';

const COLUMNS = [
  { key: 'status', label: 'STATUS', sortable: false },
  { key: 'rig', label: 'RIG', sortable: false },
  { key: 'wellName', label: 'WELL NAME', sortable: false },
  { key: 'wellId', label: 'WELL ID', sortable: false },
  { key: 'spudDate', label: 'SPUD DATE', sortable: true },
  { key: 'operator', label: 'OPERATOR', sortable: false },
  { key: 'contractor', label: 'CONTRACTOR', sortable: false },
  { key: 'actions', label: 'ACTIONS', sortable: false },
];

export function WellTable({
  paginatedWells,
  filters,
  sortConfig,
  onFilterChange,
  onSortChange,
  onActivate,
}) {
  const handleSpudDateSort = () => {
    if (!onSortChange) return;
    const nextDirection =
      sortConfig.key === 'spudDate' && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    onSortChange({ key: 'spudDate', direction: nextDirection });
  };

  const getSpudDateSortDirection = () => {
    if (sortConfig.key === 'spudDate') {
      return sortConfig.direction;
    }
    return null;
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border-primary">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="bg-background-tertiary border-b border-border-primary">
            {COLUMNS.map((col) => {
              if (col.key === 'spudDate') {
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={handleSpudDateSort}
                      aria-label={`Sort by Spud Date ${getSpudDateSortDirection() === 'asc' ? 'descending' : 'ascending'}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-tertiary rounded"
                    >
                      {col.label}
                      <SortIcon
                        direction={getSpudDateSortDirection()}
                        className="w-3.5 h-3.5"
                      />
                    </button>
                  </th>
                );
              }

              return (
                <th
                  key={col.key}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap"
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
          <TableHeaderFilters
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </thead>
        <tbody className="divide-y divide-border-secondary">
          {paginatedWells.length === 0 ? (
            <tr className="bg-background-secondary">
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-10 text-center text-sm text-text-muted"
              >
                No wells match the current filters.
              </td>
            </tr>
          ) : (
            paginatedWells.map((well) => (
              <WellRow key={well.id} well={well} onActivate={onActivate} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

WellTable.propTypes = {
  paginatedWells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      rig: PropTypes.string,
      wellName: PropTypes.string,
      wellId: PropTypes.string,
      spudDate: PropTypes.string,
      operator: PropTypes.string,
      contractor: PropTypes.string,
    })
  ).isRequired,
  filters: PropTypes.shape({
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
  }).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onActivate: PropTypes.func,
};

WellTable.defaultProps = {
  onActivate: undefined,
};

export default WellTable;
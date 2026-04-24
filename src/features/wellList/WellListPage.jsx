
import { useWells } from './hooks/useWells.js';
import { WellTable } from './components/WellTable.jsx';
import { Pagination } from './components/Pagination.jsx';
import { ActivationModal } from './components/ActivationModal.jsx';

function PlusIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </svg>
  );
}

export function WellListPage() {
  const {
    filters,
    sortConfig,
    currentPage,
    pageSize,
    paginatedWells,
    totalFiltered,
    activeWell,
    pendingActivationId,
    wells,
    setFilters,
    setSortConfig,
    setCurrentPage,
    setPageSize,
    openActivationModal,
    closeActivationModal,
    confirmActivation,
  } = useWells();

  const pendingWell = pendingActivationId
    ? wells.find((w) => w.id === pendingActivationId) ?? null
    : null;

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleActivate = (wellId) => {
    const well = wells.find((w) => w.id === wellId);
    if (well) {
      openActivationModal(well);
    }
  };

  const handleCreateSidetrack = () => {
    alert('Navigating to new page: Create Sidetrack Well');
  };

  const handleCreateNew = () => {
    alert('Navigating to new page: Create New Well');
  };

  return (
    <div className="min-h-screen bg-background-primary px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-heading tracking-tight">
            Well List
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage All Rig Wells
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCreateSidetrack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-colors duration-150 bg-background-secondary text-text-secondary border border-border-primary hover:bg-background-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary"
          >
            <PlusIcon className="w-4 h-4" />
            Create Sidetrack Well
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-colors duration-150 bg-accent-blue text-white border border-accent-blue hover:bg-accent-blue-dark focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary"
          >
            <PlusIcon className="w-4 h-4" />
            Create New Well
          </button>
        </div>
      </div>

      {/* Table */}
      <WellTable
        paginatedWells={paginatedWells}
        filters={filters}
        sortConfig={sortConfig}
        onFilterChange={handleFilterChange}
        onSortChange={setSortConfig}
        onActivate={handleActivate}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalFiltered}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Activation Modal */}
      <ActivationModal
        isOpen={pendingActivationId !== null}
        targetWell={pendingWell}
        currentActiveWell={
          activeWell && pendingWell && activeWell.id !== pendingWell.id
            ? activeWell
            : null
        }
        onConfirm={confirmActivation}
        onClose={closeActivationModal}
      />
    </div>
  );
}

export default WellListPage;

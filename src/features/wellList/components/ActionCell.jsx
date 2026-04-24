import PropTypes from 'prop-types';

function DetailsIcon({ className }) {
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
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={8} x2={12} y2={12} />
      <line x1={12} y1={16} x2={12.01} y2={16} />
    </svg>
  );
}

DetailsIcon.propTypes = { className: PropTypes.string };
DetailsIcon.defaultProps = { className: undefined };

function EditIcon({ className }) {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

EditIcon.propTypes = { className: PropTypes.string };
EditIcon.defaultProps = { className: undefined };

function ActivateIcon({ className }) {
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
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

ActivateIcon.propTypes = { className: PropTypes.string };
ActivateIcon.defaultProps = { className: undefined };

export function ActionCell({ well, onActivate }) {
  const isActive = well?.status === 'active';

  const handleDetails = () => {
    alert(`Navigating to new page: Details for ${well?.wellName ?? well?.id}`);
  };

  const handleEdit = () => {
    alert(`Navigating to new page: Edit for ${well?.wellName ?? well?.id}`);
  };

  const handleActivate = () => {
    if (!isActive && onActivate && well?.id) {
      onActivate(well.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDetails}
        aria-label={`View details for ${well?.wellName ?? well?.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 bg-background-secondary text-text-secondary border border-border-primary hover:bg-background-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary"
      >
        <DetailsIcon className="w-3.5 h-3.5" />
        Details
      </button>

      <button
        type="button"
        onClick={handleEdit}
        aria-label={`Edit ${well?.wellName ?? well?.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 bg-background-secondary text-text-secondary border border-border-primary hover:bg-background-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary"
      >
        <EditIcon className="w-3.5 h-3.5" />
        Edit
      </button>

      {!isActive && (
        <button
          type="button"
          onClick={handleActivate}
          aria-label={`Activate ${well?.wellName ?? well?.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 bg-button-success text-status-active border border-status-active hover:bg-button-success-hover focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-1 focus:ring-offset-background-primary"
        >
          <ActivateIcon className="w-3.5 h-3.5" />
          Activate
        </button>
      )}
    </div>
  );
}

ActionCell.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    wellName: PropTypes.string,
  }).isRequired,
  onActivate: PropTypes.func,
};

ActionCell.defaultProps = {
  onActivate: undefined,
};

export default ActionCell;

import PropTypes from 'prop-types';
import { CloseIcon } from '../../../shared/icons/CloseIcon.jsx';

function WarningIcon({ className }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1={12} y1={9} x2={12} y2={13} />
      <line x1={12} y1={17} x2={12.01} y2={17} />
    </svg>
  );
}

WarningIcon.propTypes = { className: PropTypes.string };
WarningIcon.defaultProps = { className: undefined };

function CheckCircleIcon({ className }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

CheckCircleIcon.propTypes = { className: PropTypes.string };
CheckCircleIcon.defaultProps = { className: undefined };

export function ActivationModal({
  isOpen,
  targetWell,
  currentActiveWell,
  onConfirm,
  onClose,
}) {
  if (!isOpen || !targetWell) {
    return null;
  }

  const hasCurrentActive =
    currentActiveWell !== null &&
    currentActiveWell !== undefined &&
    currentActiveWell.id !== targetWell.id;

  const targetName = targetWell.wellName ?? targetWell.id;
  const currentName = hasCurrentActive
    ? (currentActiveWell.wellName ?? currentActiveWell.id)
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activation-modal-title"
      aria-describedby="activation-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay — pointer-events blocking, no dismiss on click */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-lg border border-border-primary bg-background-secondary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <div className="flex items-center gap-2.5">
            {hasCurrentActive ? (
              <WarningIcon className="w-5 h-5 text-accent-yellow shrink-0" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-accent-green shrink-0" />
            )}
            <h2
              id="activation-modal-title"
              className="text-base font-semibold text-text-heading"
            >
              Activate Well
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close activation modal"
            className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-text-primary hover:bg-background-hover transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-secondary"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Target well info */}
          <p
            id="activation-modal-description"
            className="text-sm text-text-secondary"
          >
            You are about to activate the following well:
          </p>

          <div className="rounded-md border border-border-primary bg-background-card px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              Well to Activate
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {targetName}
            </p>
            {targetWell.wellId && (
              <p className="text-xs text-text-secondary font-mono mt-0.5">
                {targetWell.wellId}
              </p>
            )}
          </div>

          {/* Warning block — only shown when another well is currently active */}
          {hasCurrentActive && (
            <div className="rounded-md border border-accent-red bg-button-danger px-4 py-3">
              <div className="flex items-start gap-2.5">
                <WarningIcon className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-red mb-1">
                    Currently Active Well
                  </p>
                  <p className="text-sm font-semibold text-text-primary">
                    {currentName}
                  </p>
                  {currentActiveWell.wellId && (
                    <p className="text-xs text-text-secondary font-mono mt-0.5">
                      {currentActiveWell.wellId}
                    </p>
                  )}
                  <p className="text-xs text-status-inactive mt-2 leading-relaxed">
                    Activating this well will deactivate{' '}
                    <span className="font-semibold">{currentName}</span>. Only
                    one well can be active at a time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Simple confirmation message — no current active well */}
          {!hasCurrentActive && (
            <p className="text-sm text-text-secondary leading-relaxed">
              This will set{' '}
              <span className="font-semibold text-text-primary">
                {targetName}
              </span>{' '}
              as the active well. No other well is currently active.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-primary">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-colors duration-150 bg-background-secondary text-text-secondary border border-border-primary hover:bg-background-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-colors duration-150 bg-button-success text-status-active border border-status-active hover:bg-button-success-hover focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-1 focus:ring-offset-background-secondary"
          >
            Activate Well
          </button>
        </div>
      </div>
    </div>
  );
}

ActivationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  targetWell: PropTypes.shape({
    id: PropTypes.string.isRequired,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
  }),
  currentActiveWell: PropTypes.shape({
    id: PropTypes.string.isRequired,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

ActivationModal.defaultProps = {
  targetWell: null,
  currentActiveWell: null,
};

export default ActivationModal;
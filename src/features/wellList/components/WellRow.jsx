import PropTypes from 'prop-types';
import { ActiveBadge } from './ActiveBadge.jsx';
import { ActionCell } from './ActionCell.jsx';

function formatSpudDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function InactiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-status-inactive-bg text-status-inactive">
      <span
        className="w-2 h-2 rounded-full bg-status-inactive"
        aria-hidden="true"
      />
      Inactive
    </span>
  );
}

export function WellRow({ well, onActivate }) {
  const isActive = well?.status === 'active';

  const rowClassName = isActive
    ? 'border-l-4 border-l-[#22c55e] bg-background-card hover:bg-background-hover transition-colors duration-150'
    : 'border-l-4 border-l-transparent bg-background-secondary hover:bg-background-hover transition-colors duration-150';

  const cellClassName = 'px-4 py-3 text-sm whitespace-nowrap';
  const textPrimary = 'text-text-primary';
  const textSecondary = 'text-text-secondary';

  return (
    <tr className={rowClassName}>
      <td className={`${cellClassName}`}>
        {isActive ? <ActiveBadge /> : <InactiveBadge />}
      </td>
      <td className={`${cellClassName} ${textSecondary}`}>
        {well?.rig ?? '—'}
      </td>
      <td className={`${cellClassName} ${textPrimary} font-medium`}>
        {well?.wellName ?? '—'}
      </td>
      <td className={`${cellClassName} ${textSecondary} font-mono`}>
        {well?.wellId ?? '—'}
      </td>
      <td className={`${cellClassName} ${textSecondary}`}>
        {formatSpudDate(well?.spudDate)}
      </td>
      <td className={`${cellClassName} ${textSecondary}`}>
        {well?.operator ?? '—'}
      </td>
      <td className={`${cellClassName} ${textSecondary}`}>
        {well?.contractor ?? '—'}
      </td>
      <td className={`${cellClassName}`}>
        <ActionCell well={well} onActivate={onActivate} />
      </td>
    </tr>
  );
}

WellRow.propTypes = {
  well: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    rig: PropTypes.string,
    wellName: PropTypes.string,
    wellId: PropTypes.string,
    spudDate: PropTypes.string,
    operator: PropTypes.string,
    contractor: PropTypes.string,
  }).isRequired,
  onActivate: PropTypes.func,
};

WellRow.defaultProps = {
  onActivate: undefined,
};

export default WellRow;
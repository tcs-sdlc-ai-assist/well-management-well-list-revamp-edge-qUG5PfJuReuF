import PropTypes from 'prop-types';

export function ActiveBadge({ className }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-status-active-bg text-status-active${className ? ` ${className}` : ''}`}
    >
      <span
        className="w-2 h-2 rounded-full bg-status-active animate-pulse"
        aria-hidden="true"
      />
      Active
    </span>
  );
}

ActiveBadge.propTypes = {
  className: PropTypes.string,
};

ActiveBadge.defaultProps = {
  className: undefined,
};

export default ActiveBadge;
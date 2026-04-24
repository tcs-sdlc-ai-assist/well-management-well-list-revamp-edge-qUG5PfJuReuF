import PropTypes from 'prop-types';

export function SortIcon({ direction, className }) {
  if (direction === 'asc') {
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
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  }

  if (direction === 'desc') {
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
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  }

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
      <polyline points="18 15 12 9 6 15" opacity="0.4" />
      <polyline points="6 9 12 15 18 9" opacity="0.4" />
    </svg>
  );
}

SortIcon.propTypes = {
  direction: PropTypes.oneOf(['asc', 'desc', null]),
  className: PropTypes.string,
};

SortIcon.defaultProps = {
  direction: null,
  className: undefined,
};

export default SortIcon;
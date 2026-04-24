import PropTypes from 'prop-types';

export function SearchIcon({ className }) {
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
      <circle cx={11} cy={11} r={8} />
      <line x1={21} y1={21} x2={16.65} y2={16.65} />
    </svg>
  );
}

SearchIcon.propTypes = {
  className: PropTypes.string,
};

SearchIcon.defaultProps = {
  className: undefined,
};

export default SearchIcon;
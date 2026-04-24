import PropTypes from 'prop-types';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function ChevronDoubleLeftIcon({ className }) {
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
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

ChevronDoubleLeftIcon.propTypes = { className: PropTypes.string };
ChevronDoubleLeftIcon.defaultProps = { className: undefined };

function ChevronLeftIcon({ className }) {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

ChevronLeftIcon.propTypes = { className: PropTypes.string };
ChevronLeftIcon.defaultProps = { className: undefined };

function ChevronRightIcon({ className }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

ChevronRightIcon.propTypes = { className: PropTypes.string };
ChevronRightIcon.defaultProps = { className: undefined };

function ChevronDoubleRightIcon({ className }) {
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
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}

ChevronDoubleRightIcon.propTypes = { className: PropTypes.string };
ChevronDoubleRightIcon.defaultProps = { className: undefined };

/**
 * Generates an array of page numbers and ellipsis markers for the pagination control.
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {Array<number|string>}
 */
function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];

  if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push('ellipsis-end');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push('ellipsis-start');
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push('ellipsis-start');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('ellipsis-end');
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handleFirst = () => {
    if (!isFirstPage) onPageChange(1);
  };

  const handlePrev = () => {
    if (!isFirstPage) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isLastPage) onPageChange(currentPage + 1);
  };

  const handleLast = () => {
    if (!isLastPage) onPageChange(totalPages);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  const navButtonBase =
    'inline-flex items-center justify-center w-8 h-8 rounded text-xs font-medium transition-colors duration-150 border border-border-primary bg-background-secondary text-text-secondary hover:bg-background-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary';

  const navButtonDisabled = 'opacity-50 pointer-events-none';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-background-secondary border-t border-border-primary rounded-b-lg">
      {/* Entry counter */}
      <p className="text-xs text-text-secondary whitespace-nowrap">
        Showing{' '}
        <span className="font-semibold text-text-primary">{rangeStart}</span>
        {' – '}
        <span className="font-semibold text-text-primary">{rangeEnd}</span>
        {' of '}
        <span className="font-semibold text-text-primary">{totalItems}</span>
        {' entries'}
      </p>

      {/* Navigation */}
      <nav
        aria-label="Pagination navigation"
        className="flex items-center gap-1"
      >
        {/* First */}
        <button
          type="button"
          onClick={handleFirst}
          aria-label="Go to first page"
          aria-disabled={isFirstPage}
          className={`${navButtonBase}${isFirstPage ? ` ${navButtonDisabled}` : ''}`}
        >
          <ChevronDoubleLeftIcon className="w-3.5 h-3.5" />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Go to previous page"
          aria-disabled={isFirstPage}
          className={`${navButtonBase}${isFirstPage ? ` ${navButtonDisabled}` : ''}`}
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span
                key={`${page}-${index}`}
                className="inline-flex items-center justify-center w-8 h-8 text-xs text-text-muted select-none"
                aria-hidden="true"
              >
                &hellip;
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'inline-flex items-center justify-center w-8 h-8 rounded text-xs font-semibold transition-colors duration-150 border border-accent-blue bg-accent-blue text-white focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-1 focus:ring-offset-background-primary'
                  : navButtonBase
              }
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Go to next page"
          aria-disabled={isLastPage}
          className={`${navButtonBase}${isLastPage ? ` ${navButtonDisabled}` : ''}`}
        >
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>

        {/* Last */}
        <button
          type="button"
          onClick={handleLast}
          aria-label="Go to last page"
          aria-disabled={isLastPage}
          className={`${navButtonBase}${isLastPage ? ` ${navButtonDisabled}` : ''}`}
        >
          <ChevronDoubleRightIcon className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="page-size-select"
          className="text-xs text-text-secondary whitespace-nowrap"
        >
          Rows per page:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="px-2 py-1.5 text-xs rounded bg-background-primary text-text-primary border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-colors duration-150 cursor-pointer"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default Pagination;
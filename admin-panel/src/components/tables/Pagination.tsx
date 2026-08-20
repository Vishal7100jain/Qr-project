import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate pages based on screen size
  const getVisiblePages = (maxVisible: number) => {
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Desktop: 5 pages, Tablet: 3 pages, Mobile: 1 page
  const desktopPages = getVisiblePages(5);
  const tabletPages = getVisiblePages(3);
  const mobilePages = getVisiblePages(1);

  const getEllipsisInfo = (visiblePages: number[]) => {
    const showStartEllipsis = visiblePages[0] > 2;
    const showEndEllipsis =
      visiblePages[visiblePages.length - 1] < totalPages - 1;
    return { showStartEllipsis, showEndEllipsis };
  };

  const {
    showStartEllipsis: desktopStartEllipsis,
    showEndEllipsis: desktopEndEllipsis,
  } = getEllipsisInfo(desktopPages);
  const {
    showStartEllipsis: tabletStartEllipsis,
    showEndEllipsis: tabletEndEllipsis,
  } = getEllipsisInfo(tabletPages);

  return (
    <div className="flex items-center">
      {/* Go to Start - Only visible on mobile and tablet */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="mr-1 sm:mr-2.5 flex lg:hidden items-center h-8 sm:h-10 justify-center rounded-lg border border-gray-300 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-xs sm:text-sm"
        title="Go to first page"
      >
        ‹‹
      </button>

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-1 sm:mr-2.5 flex items-center h-8 sm:h-10 justify-center rounded-lg border border-gray-300 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Desktop View (lg and up) - 5 pages */}
      <div className="hidden lg:flex items-center gap-1 sm:gap-2">
        {/* First page (always show if not in visible range) */}
        {!desktopPages.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-gray-700 dark:text-gray-400 flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            >
              1
            </button>
            {desktopStartEllipsis && (
              <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {desktopPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded ${
              currentPage === page
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "text-gray-700 dark:text-gray-400 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            } flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium`}
          >
            {page}
          </button>
        ))}

        {/* Last page (always show if not in visible range) */}
        {!desktopPages.includes(totalPages) && totalPages > 1 && (
          <>
            {desktopEndEllipsis && (
              <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-gray-700 dark:text-gray-400 flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Tablet View (md to lg) - 3 pages */}
      <div className="hidden md:flex lg:hidden items-center gap-1 sm:gap-2">
        {/* First page (always show if not in visible range) */}
        {!tabletPages.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-gray-700 dark:text-gray-400 flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            >
              1
            </button>
            {tabletStartEllipsis && (
              <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                ...
              </span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {tabletPages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded ${
              currentPage === page
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "text-gray-700 dark:text-gray-400 hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            } flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium`}
          >
            {page}
          </button>
        ))}

        {/* Last page (always show if not in visible range) */}
        {!tabletPages.includes(totalPages) && totalPages > 1 && (
          <>
            {tabletEndEllipsis && (
              <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-gray-700 dark:text-gray-400 flex w-8 sm:w-10 items-center justify-center h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Mobile View (sm and below) - Current page only + page info */}
      <div className="flex md:hidden items-center gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage)}
            className="px-3 py-1.5 rounded bg-brand-500 text-white flex w-8 items-center justify-center h-8 rounded-lg text-xs font-medium"
          >
            {currentPage}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
            of {totalPages}
          </span>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-1 sm:ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2.5 text-gray-700 shadow-theme-xs text-xs sm:text-sm hover:bg-gray-50 h-8 sm:h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>

      {/* Go to End - Only visible on mobile and tablet */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="ml-1 sm:ml-2.5 flex lg:hidden items-center h-8 sm:h-10 justify-center rounded-lg border border-gray-300 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-xs sm:text-sm"
        title="Go to last page"
      >
        ››
      </button>
    </div>
  );
};

export default Pagination;

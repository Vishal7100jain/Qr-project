const HistoricalDataLogsPagination = ({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const jumpBack = () => onPageChange(Math.max(1, page - 10));
  const jumpForward = () => onPageChange(Math.min(totalPages, page + 10));

  const getPages = () => {
    const pages: (number | "...")[] = [];

    if (page > 2) pages.push(1);
    if (page > 3) pages.push("...");

    if (page > 1) pages.push(page - 1);
    pages.push(page);
    if (page < totalPages) pages.push(page + 1);

    if (page < totalPages - 2) pages.push("...");
    if (page < totalPages - 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4 select-none flex-wrap">
      {/* -10 */}
      <button
        disabled={page <= 10}
        onClick={jumpBack}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        « −10
      </button>

      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        Previous
      </button>

      {/* Page numbers */}
      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-md text-sm font-medium dark:text-white
              ${
                p === page
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        Next
      </button>

      {/* +10 */}
      <button
        disabled={page + 10 > totalPages}
        onClick={jumpForward}
        className="px-3 py-1 rounded-md border text-sm
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      >
        +10 »
      </button>
    </div>
  );
};

export default HistoricalDataLogsPagination;

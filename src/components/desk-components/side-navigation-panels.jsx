const SidePanel = ({
  children,
  label,
  searchValue = "",
  onSearch,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const handlePrev = () => onPageChange && onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1));

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50/90 p-2 lg:min-w-80 lg:max-w-80">
      <h2 className="mb-2 rounded-sm bg-stone-700/90 px-2 py-1 text-sm font-semibold tracking-wider text-white">
        {label}
      </h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="mb-2 w-full border border-stone-300 bg-white px-2 py-1 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">{children}</div>

      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            onClick={handlePrev}
            className="rounded bg-stone-200 px-2 py-1 text-sm hover:bg-stone-300"
            disabled={currentPage <= 1}
          >
            Prev
          </button>
          <span className="text-sm text-stone-600">{currentPage} / {totalPages}</span>
          <button
            onClick={handleNext}
            className="rounded bg-stone-200 px-2 py-1 text-sm hover:bg-stone-300"
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SidePanel;

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
    <div className="relative min-h-full min-w-80">
      <h2 className="absolute top-0 left-0 z-10 m-2 rounded-sm bg-stone-700/60 px-2 py-0.5 text-sm font-semibold tracking-wider text-white text-shadow-2xs">
        {label}
      </h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="mt-8 w-full bg-stone-700/60 text-white placeholder:text-stone-500 border border-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1"
      />
      <div className="flex h-full flex-col">{children}</div>

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

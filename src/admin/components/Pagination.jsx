function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-30"
      >
        Previous
      </button>

      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-white/10 px-4 py-2 disabled:opacity-30"
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;
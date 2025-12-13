export default function Pagination({ page, pages, setPage }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      {[...Array(pages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 border rounded ${
            page === i + 1 ? "bg-blue-600 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

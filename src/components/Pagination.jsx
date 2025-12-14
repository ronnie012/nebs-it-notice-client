import { FaArrowRight, FaArrowLeft} from "react-icons/fa";

export default function Pagination({ page, pages, setPage }) {
  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="disabled:opacity-50 text-xl"
      >
        <FaArrowLeft />
      </button>
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
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        className="disabled:opacity-50 text-xl"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}

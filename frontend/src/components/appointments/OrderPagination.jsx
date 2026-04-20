import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrderPagination({
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="bg-gray-50 px-6 py-4 border border-gray-200  rounded-xl">
      <div className="flex items-center justify-between flex-wrap gap-3">

        {/* LEFT TEXT */}
        <p className="text-sm text-gray-600">
          Page{" "}
          <span className="font-semibold text-gray-800">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {totalPages}
          </span>
          {totalOrders ? ` (${totalOrders} total)` : ""}
        </p>

        {/* PAGINATION BUTTONS */}
        <div className="flex items-center gap-1.5 flex-wrap">

          {/* PREVIOUS */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition
              ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* PAGE NUMBERS */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={i}
                className="px-2 text-gray-400 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition
                  ${
                    currentPage === p
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition
              ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}
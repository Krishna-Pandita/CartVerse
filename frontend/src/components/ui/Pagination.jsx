import React from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 15,
  onPageChange,
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Products pagination"
      className="mt-8 pt-5 pb-2 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 select-none"
    >
      {/* Informative Results Counter */}
      <div className="text-xs sm:text-sm text-gray-500 font-medium order-2 sm:order-1 text-center sm:text-left">
        Showing{" "}
        <span className="font-semibold text-gray-900">{startItem}–{endItem}</span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
        products
        <span className="hidden md:inline text-gray-400 mx-2">•</span>
        <span className="hidden md:inline text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
        {/* First Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className="h-9 w-9 p-0 border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="h-9 px-2.5 sm:px-3 border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs sm:text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-7 sm:w-8 text-center text-gray-400 font-bold text-xs sm:text-sm select-none"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={`h-9 min-w-9 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-pink-600 text-white shadow-xs ring-1 ring-pink-600"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="h-9 px-2.5 sm:px-3 border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 text-xs sm:text-sm font-medium"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          className="h-9 w-9 p-0 border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "./useTranslation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const { t } = useTranslation("alert");

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 my-5">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`text-gray-600 ${
          currentPage > 1
            ? "hover:text-gray-900"
            : "opacity-50 cursor-not-allowed"
        }`}
        aria-label={t("pagination.previousPage")}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-sm text-gray-700">
        {t("pagination.pageInfo", { current: currentPage, total: totalPages })}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`text-gray-600 ${
          currentPage < totalPages
            ? "hover:text-gray-900"
            : "opacity-50 cursor-not-allowed"
        }`}
        aria-label={t("pagination.nextPage")}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;

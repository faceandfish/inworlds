import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PaginatedData } from "@/app/lib/definitions";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination: React.FC<PaginatedData> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <Link
        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
        className={`text-gray-600 ${
          currentPage > 1
            ? "hover:text-gray-900"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={(e) => currentPage <= 1 && e.preventDefault()}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Link>
      <span className="text-sm text-gray-700">
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <Link
        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
        className={`text-gray-600 ${
          currentPage < totalPages
            ? "hover:text-gray-900"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={(e) => currentPage >= totalPages && e.preventDefault()}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </Link>
    </div>
  );
};

export default Pagination;

import React, { useState, useEffect, useTransition } from "react";
import { BookInfo, AnalyticsData } from "@/app/lib/definitions";
import { fetchBooksList, fetchSingleBookAnalytics } from "@/app/lib/action";
import Pagination from "../Main/Pagination";
import Link from "next/link";
import DataAnalysisSkeleton from "./Skeleton/DataAnalysisSkeleton";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

const ITEMS_PER_PAGE = 5;

const DataAnalysis: React.FC = () => {
  const { t } = useTranslation("studio");
  const { user } = useUser();
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const analyticsItems = [
    { label: t("dataAnalysis.analyticsItems.views"), key: "views" },
    {
      label: t("dataAnalysis.analyticsItems.viewsLast24h"),
      key: "viewsLast24h"
    },
    { label: t("dataAnalysis.analyticsItems.likes"), key: "likes" },
    {
      label: t("dataAnalysis.analyticsItems.totalIncome"),
      key: "totalIncome",
      unit: t("income.currency")
    },
    { label: t("dataAnalysis.analyticsItems.comments"), key: "comments" },
    {
      label: t("dataAnalysis.analyticsItems.incomeLast24h"),
      key: "incomeLast24h",
      unit: t("income.currency")
    }
  ];

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchBooksList(user.id, currentPage, ITEMS_PER_PAGE, "published")
        .then((response) => {
          if (response.code === 200) {
            setBooks(response.data.dataList);
            setTotalPages(response.data.totalPage);
            if (response.data.dataList.length > 0 && !selectedBookId) {
              setSelectedBookId(response.data.dataList[0].id);
            }
          } else {
            throw new Error(response.msg || "获取作品列表失败");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, currentPage]);

  useEffect(() => {
    if (selectedBookId) {
      setIsLoading(true);
      fetchSingleBookAnalytics(selectedBookId)
        .then((response) => {
          if (response.code === 200) {
            setAnalyticsData(response.data);
          } else {
            throw new Error(response.msg || "获取分析数据失败");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedBookId]);

  const handleBookSelect = (bookId: number) => {
    startTransition(() => {
      setSelectedBookId(bookId);
      setTimeout(() => {
        const element = document.getElementById(`details-${bookId}`);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      setCurrentPage(newPage);
    });
  };

  if (isLoading) {
    return <DataAnalysisSkeleton />;
  }

  return (
    <div className="min-h-screen w-full mx-auto px-10">
      <div className="bg-white py-4">
        <h2 className="text-2xl font-semibold text-neutral-600 mb-4">
          {t("dataAnalysis.title")}
        </h2>
        <div className="grid grid-cols-7 text-neutral-600 bg-neutral-100 font-semibold">
          <div className="p-3 col-span-3">
            {t("dataAnalysis.columns.title")}
          </div>
          <div className="p-3 text-center col-span-1">
            {t("dataAnalysis.columns.type")}
          </div>
          <div className="p-3 text-center col-span-1">
            {t("dataAnalysis.columns.wordCount")}
          </div>
          <div className="p-3 text-center col-span-2">
            {t("dataAnalysis.columns.creationTime")}
          </div>
        </div>
        <ul className="h-64">
          {books.map((book) => (
            <li
              key={book.id}
              className={`grid grid-cols-7 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-100 transition-colors duration-150 ${
                selectedBookId === book.id
              }`}
            >
              <Link
                href={`#details-${book.id}`}
                className="col-span-3 cursor-pointer font-medium hover:text-orange-400 text-neutral-600 truncate"
                onClick={(e) => {
                  e.preventDefault();
                  handleBookSelect(book.id);
                }}
              >
                {book.title}
              </Link>
              <span className="text-sm col-span-1 text-center text-neutral-500">
                {book.category}
              </span>
              <span className="text-sm col-span-1 text-center text-neutral-500">
                {book.wordCount}
              </span>
              <span className="text-sm col-span-2 text-center text-neutral-500">
                {book.createdAt}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {analyticsData && (
        <div
          id={`details-${selectedBookId}`}
          className="bg-white py-10 h-screen flex flex-col"
        >
          <h2 className="text-xl p-3 font-semibold bg-neutral-100 text-neutral-600 mb-10">
            {t("dataAnalysis.detailedData")} -
            {books.find((book) => book.id === selectedBookId)?.title}
          </h2>
          <div className="grid grid-cols-2 gap-6 flex-grow overflow-y-auto px-4">
            {analyticsItems.map((item) => (
              <div key={item.key} className="bg-orange-100 rounded-lg p-4">
                <label className="text-sm font-medium text-orange-800 mb-2">
                  {item.label}
                </label>
                <p className="text-3xl flex justify-center items-center font-bold text-orange-600 text-center">
                  {analyticsData[item.key as keyof AnalyticsData] !== null &&
                  analyticsData[item.key as keyof AnalyticsData] !==
                    undefined ? (
                    <>
                      {analyticsData[item.key as keyof AnalyticsData]}
                      {item.unit && (
                        <span className="text-sm ml-1">{item.unit}</span>
                      )}
                    </>
                  ) : (
                    t("dataAnalysis.noData")
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;

import React, { useState, useEffect } from "react";
import { BookInfo, AnalyticsData } from "@/app/lib/definitions";
import { fetchBooksList, fetchSingleBookAnalytics } from "@/app/lib/action";
import DataAnalysisSkeleton from "./Skeleton/DataAnalysisSkeleton";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

const DataAnalysis: React.FC = () => {
  const { t } = useTranslation("studio");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const analyticsItems = [
    { label: t("dataAnalysis.analyticsItems.views"), key: "views" },
    {
      label: t("dataAnalysis.analyticsItems.viewsLast24h"),
      key: "viewsLast24h"
    },
    {
      label: t("dataAnalysis.analyticsItems.favorites"),
      key: "favorites"
    },
    {
      label: t("dataAnalysis.analyticsItems.totalIncome"),
      key: "totalIncome",
      unit: t("income.currency")
    },
    { label: t("dataAnalysis.analyticsItems.comments"), key: "comments" },
    {
      label: t("dataAnalysis.analyticsItems.readingRate"),
      key: "readingRate",
      format: (value: number) => `${(value * 100).toFixed(2)}%`
    }
  ];

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchBooksList(user.id, 1, 999, "published")
        .then((response) => {
          if (response.code === 200) {
            setBooks(response.data.dataList);
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
  }, [user]);

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
    setSelectedBookId(bookId);
    setTimeout(() => {
      const element = document.getElementById(`details-${bookId}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

        <div className=" relative">
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            {t("dataAnalysis.selectBook")}
          </label>
          <div
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg 
               bg-white text-neutral-700 cursor-pointer flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {books.find((book) => book.id === selectedBookId)?.title ||
                t("dataAnalysis.selectBookPlaceholder")}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-sm max-h-60 overflow-auto">
              {books.map((book) => (
                <div
                  key={book.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-neutral-50
            ${selectedBookId === book.id ? "bg-neutral-100" : ""}`}
                  onClick={() => {
                    handleBookSelect(book.id);
                    setIsOpen(false);
                  }}
                >
                  {book.title}
                </div>
              ))}
            </div>
          )}
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
                      {item.format
                        ? item.format(
                            analyticsData[item.key as keyof AnalyticsData]
                          )
                        : analyticsData[item.key as keyof AnalyticsData]}

                      {!item.format && item.unit && (
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

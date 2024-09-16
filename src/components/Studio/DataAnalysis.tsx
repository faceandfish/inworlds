import React, { useState, useEffect, useTransition } from "react";
import { BookInfo, AnalyticsData } from "@/app/lib/definitions";
import { fetchBooksList, fetchSingleBookAnalytics } from "@/app/lib/action";
import Pagination from "../Pagination";
import Link from "next/link";
import DataAnalysisSkeleton from "./Skeleton/DataAnalysisSkeleton";
import { useUser } from "../UserContextProvider";

const ITEMS_PER_PAGE = 5;

const DataAnalysis: React.FC = () => {
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
    { label: "总浏览量", key: "views" },
    { label: "24小时浏览量", key: "viewsLast24h" },
    { label: "总点赞数", key: "likes" },
    { label: "总收入", key: "totalIncome", unit: "元" },
    { label: "总留言数", key: "comments" },
    { label: "24小时收入", key: "incomeLast24h", unit: "元" }
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
          内容详情
        </h2>
        <div className="grid grid-cols-7 text-neutral-600 bg-neutral-100 font-semibold">
          <div className="p-3 col-span-3">标题</div>
          <div className="p-3 text-center col-span-1">类型</div>
          <div className="p-3 text-center col-span-1">字数</div>
          <div className="p-3 text-center col-span-2">创作时间</div>
        </div>
        <ul className="h-64">
          {books.map((book) => (
            <li
              key={book.id}
              className={`grid grid-cols-7 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-100 transition-colors duration-150 ${
                selectedBookId === book.id ? "bg-neutral-100" : ""
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
            详细数据 - {books.find((book) => book.id === selectedBookId)?.title}
          </h2>
          <div className="grid grid-cols-2 gap-6 flex-grow overflow-y-auto px-4">
            {analyticsItems.map((item) => (
              <div key={item.key} className="bg-orange-100 rounded-lg p-4">
                <label className="text-sm font-medium text-orange-800 mb-2">
                  {item.label}
                </label>
                <p className="text-3xl flex justify-center items-center font-bold text-orange-600 text-center">
                  {analyticsData[item.key as keyof AnalyticsData]}
                  {item.unit && (
                    <span className="text-sm ml-1">{item.unit}</span>
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

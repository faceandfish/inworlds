import React, { useState, useEffect } from "react";
import {
  BookInfo,
  AnalyticsData,
  ApiResponse,
  PaginatedData
} from "@/app/lib/definitions";

import { useUserInfo } from "../useUserInfo";
import { fetchBooksList, fetchSingleBookAnalytics } from "@/app/lib/action";

const DataAnalysis: React.FC = () => {
  const { user } = useUserInfo();
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user && user.id) {
      loadBooks();
    }
  }, [user, currentPage]);

  const loadBooks = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooksList(
        user.id,
        currentPage,
        5,
        "published"
      );
      setBooks(response.data.dataList);
      setTotalPages(response.data.totalPage);
      if (response.data.dataList.length > 0 && !selectedBookId) {
        setSelectedBookId(response.data.dataList[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载书籍列表时发生错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBookId) {
      loadAnalytics(selectedBookId);
    }
  }, [selectedBookId]);

  const loadAnalytics = async (bookId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSingleBookAnalytics(bookId);
      setAnalyticsData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载分析数据时发生错误");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (bookId: number) => {
    setSelectedBookId(bookId);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-white px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">内容详情</h2>
        <ul className="divide-y divide-gray-200">
          <li className="grid grid-cols-5 gap-4 py-2 px-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span>标题</span>
            <span>创作时间</span>
            <span>类型</span>
            <span>字数</span>
            <span>状态</span>
          </li>
          {books.map((book) => (
            <li
              key={book.id}
              className={`grid grid-cols-5 gap-4 py-3 px-3 cursor-pointer transition-colors duration-150 ${
                selectedBookId === book.id
                  ? "bg-neutral-50"
                  : "hover:bg-neutral-50"
              }`}
              onClick={() => handleBookSelect(book.id)}
            >
              <span className="truncate">{book.title}</span>
              <span>{book.createdAt}</span>
              <span>{book.category}</span>
              <span>{book.wordCount}</span>
              <span
                className={`text-orange-600 ${
                  selectedBookId === book.id ? "font-semibold" : ""
                }`}
              >
                {selectedBookId === book.id ? "当前选中" : "点击查看"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {analyticsData && (
        <div className="bg-white border-t border-t-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            详细数据 - {books.find((book) => book.id === selectedBookId)?.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                总浏览量
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.views}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                总点赞数
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.likes}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                24小时浏览量
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.viewsLast24h}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                总收入 (元)
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.totalIncome}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                总留言数
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.comments}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4">
              <label className="block text-sm font-medium text-orange-800 mb-1">
                24小时收入 (元)
              </label>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.incomeLast24h}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;

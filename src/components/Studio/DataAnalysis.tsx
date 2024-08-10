import { AnalyticsData, BookInfo } from "@/app/lib/definitions";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader } from "../Card";

// 模拟书籍数据
const booksData: Partial<BookInfo>[] = [
  {
    id: 1,
    title: "书籍1",
    category: "female-story",
    createdAt: "2023-01-15",
    wordCount: 50000
  },
  {
    id: 2,
    title: "书籍2",
    category: "male-story",
    createdAt: "2023-03-22",
    wordCount: 75000
  },
  {
    id: 3,
    title: "书籍3",
    category: "literature-story",
    createdAt: "2023-05-10",
    wordCount: 100000
  }
];

const generateAnalyticsData = (bookId: number): AnalyticsData => ({
  bookId: bookId,
  views: Math.floor(Math.random() * 10000),
  viewsLast24h: Math.floor(Math.random() * 1000),
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 500),
  totalIncome: Math.floor(Math.random() * 50000),
  incomeLast24h: Math.floor(Math.random() * 500)
});

const DataAnalysis: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<number>(
    booksData[0].id!
  );
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    setAnalyticsData(generateAnalyticsData(selectedBookId));
  }, [selectedBookId]);

  const handleBookSelect = (bookId: number) => {
    setSelectedBookId(bookId);
  };

  return (
    <div className="  min-h-screen">
      <div className="bg-white  px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">内容详情</h2>
        <ul className="divide-y divide-gray-200">
          <li className="grid grid-cols-5 gap-4 py-2 px-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
            <span>标题</span>
            <span>创作时间</span>
            <span>类型</span>
            <span>字数</span>
            <span>状态</span>
          </li>
          {booksData.map((book) => (
            <li
              key={book.id}
              className={`grid grid-cols-5 gap-4 py-3 px-3 cursor-pointer transition-colors duration-150 ${
                selectedBookId === book.id
                  ? "bg-neutral-50"
                  : "hover:bg-neutral-50"
              }`}
              onClick={() => book.id && handleBookSelect(book.id)}
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
      </div>

      {analyticsData && (
        <div className="bg-white border-t border-t-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            详细数据 -{" "}
            {booksData.find((book) => book.id === selectedBookId)?.title}
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

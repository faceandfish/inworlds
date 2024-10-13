import React, { useState } from "react";

import Pagination from "../Pagination";
import { useTranslation } from "../useTranslation";

// 模拟数据
const allWorks = [
  {
    id: 1,
    title: "星际迷航",
    income24h: 1200,
    donationIncome: 500,
    totalIncome: 5000,
    category: "科幻",
    wordCount: 50000,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "魔法世界",
    income24h: 800,
    donationIncome: 300,
    totalIncome: 3000,
    category: "奇幻",
    wordCount: 45000,
    createdAt: "2024-02-01"
  },
  {
    id: 3,
    title: "未来之城",
    income24h: 1500,
    donationIncome: 700,
    totalIncome: 6000,
    category: "科幻",
    wordCount: 55000,
    createdAt: "2024-02-15"
  },
  {
    id: 4,
    title: "龙与魔法",
    income24h: 1000,
    donationIncome: 400,
    totalIncome: 4000,
    category: "奇幻",
    wordCount: 48000,
    createdAt: "2024-03-01"
  },
  {
    id: 5,
    title: "科技革命",
    income24h: 2000,
    donationIncome: 800,
    totalIncome: 7000,
    category: "科技",
    wordCount: 60000,
    createdAt: "2024-03-15"
  },
  {
    id: 6,
    title: "古代神话",
    income24h: 1800,
    donationIncome: 600,
    totalIncome: 5500,
    category: "神话",
    wordCount: 52000,
    createdAt: "2024-04-01"
  }
];

const monthlyIncome = 18000;
const ITEMS_PER_PAGE = 5;

const Income: React.FC = () => {
  const { t } = useTranslation("studio");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allWorks.length / ITEMS_PER_PAGE);

  const getCurrentWorks = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allWorks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen w-full mx-auto px-10">
      <div className="bg-white py-4">
        <h2 className="text-2xl font-semibold text-neutral-600 mb-4">
          {t("income.title")}
        </h2>
        {/* 月总收入卡片 */}
        <div className="bg-orange-100 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-2">
            {t("income.monthlyIncome")}
          </h2>
          <p className="text-4xl font-bold text-orange-600">
            {monthlyIncome.toLocaleString()} {t("income.currency")}
          </p>
        </div>

        {/* 作品收入列表 */}
        <div className="grid grid-cols-7 text-neutral-600 bg-neutral-100 font-semibold">
          <div className="p-3 col-span-2">{t("income.columns.title")}</div>
          <div className="p-3 text-center">{t("income.columns.type")}</div>
          <div className="p-3 text-center">{t("income.columns.income24h")}</div>
          <div className="p-3 text-center">
            {t("income.columns.donationIncome")}
          </div>
          <div className="p-3 text-center">
            {t("income.columns.totalIncome")}
          </div>
          <div className="p-3 text-center">
            {t("income.columns.creationTime")}
          </div>
        </div>
        <ul className="h-64">
          {getCurrentWorks().map((work) => (
            <li
              key={work.id}
              className="grid grid-cols-7 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-100 transition-colors duration-150"
            >
              <span className="col-span-2 font-medium text-neutral-600 truncate">
                {work.title}
              </span>
              <span className="text-sm text-center text-neutral-500">
                {work.category}
              </span>
              <span className="text-sm text-center text-orange-400">
                {work.income24h.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-orange-400">
                {work.donationIncome.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-orange-400">
                {work.totalIncome.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-neutral-500">
                {work.createdAt}
              </span>
            </li>
          ))}
        </ul>

        <div className="py-10 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Income;

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "../Main/Pagination";
import { useTranslation } from "../useTranslation";
import { fetchIncomeData } from "@/app/lib/action";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  IncomeBookInfo,
  PaginatedData,
  ApiResponse
} from "@/app/lib/definitions";
import { useUser } from "../UserContextProvider";

const ITEMS_PER_PAGE = 5;

const Income: React.FC = () => {
  const { t, lang } = useTranslation("studio");
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [incomeData, setIncomeData] =
    useState<PaginatedData<IncomeBookInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  useEffect(() => {
    const loadIncomeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: ApiResponse<PaginatedData<IncomeBookInfo>> =
          await fetchIncomeData(currentPage, ITEMS_PER_PAGE);

        console.log("shouru:", response);

        setIncomeData(response.data);

        // Calculate monthly income (this is a simplification, you might want to adjust based on your actual data)
        const totalIncome = response.data.dataList.reduce(
          (sum, book) => sum + book.totalIncome,
          0
        );
        setMonthlyIncome(totalIncome);
      } catch (err) {
        setError(t("income.errors.fetchFailed"));
        console.error("Failed to fetch income data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIncomeData();
  }, [currentPage, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full mx-auto px-10 flex items-center justify-center">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full mx-auto px-10 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-10 w-full mx-auto px-10">
      <div className="bg-white py-4">
        {/* 月总收入卡片 */}
        <div className="bg-orange-100 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-2">
            {t("income.monthlyIncome")}
          </h2>
          <div className="flex gap-10 items-center">
            <p className="text-4xl font-bold text-orange-600">
              {monthlyIncome.toLocaleString()} {t("income.currency")}
            </p>
            {user && (
              <Link href={`/${lang}/user/${user.id}/withdraw`}>
                <span className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                  {t("income.withdraw")}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              {" "}
              <InformationCircleIcon className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                {t("income.revenueExplanation")}
              </p>
            </div>
          </div>
        </div>

        {/* 作品收入列表 */}
        <div className="grid grid-cols-7 text-neutral-600 bg-neutral-100 font-semibold">
          <div className="p-3 col-span-2">{t("income.columns.title")}</div>

          <div className="p-3 text-center">{t("income.columns.income24h")}</div>
          <div className="p-3 text-center">
            {t("income.columns.chapterIncome")}
          </div>
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
          {incomeData?.dataList.map((book) => (
            <li
              key={book.id}
              className="grid grid-cols-7 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-100 transition-colors duration-150"
            >
              <span className="col-span-2 font-medium text-neutral-600 truncate">
                {book.title}
              </span>
              <span className="text-sm text-orange-400 text-center ">
                {book.income24h.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-neutral-500 ">
                {book.chapterIncome} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-neutral-500">
                {book.donationIncome.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-orange-400">
                {book.totalIncome.toLocaleString()} {t("income.currency")}
              </span>
              <span className="text-sm text-center text-neutral-500">
                {formatDate(book.createdAt)}
              </span>
            </li>
          ))}
        </ul>

        <div className="py-10">
          {(incomeData?.totalPage || 1) > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={incomeData?.totalPage || 1}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;

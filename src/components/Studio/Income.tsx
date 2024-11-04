// Income.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "../Main/Pagination";
import { useTranslation } from "../useTranslation";
import { fetchIncomeData, getSponsorList } from "@/app/lib/action";
import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import {
  IncomeBookInfo,
  PaginatedData,
  ApiResponse,
  SponsorInfo
} from "@/app/lib/definitions";
import { useUser } from "../UserContextProvider";

const ITEMS_PER_PAGE = 5;

const Income: React.FC = () => {
  const { t, lang } = useTranslation("studio");
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSponsorPage, setCurrentSponsorPage] = useState(1);
  const [incomeData, setIncomeData] =
    useState<PaginatedData<IncomeBookInfo> | null>(null);
  const [sponsorData, setSponsorData] =
    useState<PaginatedData<SponsorInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBooksIncome, setShowBooksIncome] = useState(true);
  const [showDonations, setShowDonations] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 并行加载两种数据
        const [incomeResponse, sponsorResponse] = await Promise.all([
          fetchIncomeData(currentPage, ITEMS_PER_PAGE),
          getSponsorList(
            user?.id.toString() || "",
            currentSponsorPage,
            ITEMS_PER_PAGE
          )
        ]);

        setIncomeData(incomeResponse.data);
        setSponsorData(sponsorResponse.data);
      } catch (err) {
        setError(t("income.errors.fetchFailed"));
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [currentPage, currentSponsorPage, user?.id, t]);

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
    <div className="min-h-screen mb-10 w-full mx-auto px-4 md:px-10">
      <div className="bg-white py-4">
        {/* 总收入卡片 */}
        <div className="bg-orange-100 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-2">
            {t("income.totalIncome")}
          </h2>
          <div className="flex gap-10 items-center">
            <p className="text-4xl font-bold text-orange-600">
              {user?.totalIncome} {t("income.currency")}
            </p>
            {user && (
              <Link href={`/${lang}/user/${user.id}/withdraw`}>
                <span className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 cursor-pointer">
                  {t("income.withdraw")}
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-orange-50 mb-6 border-l-4 border-orange-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                {t("income.revenueExplanation")}
              </p>
            </div>
          </div>
        </div>

        {/* 打赏收入部分 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-neutral-50"
            onClick={() => setShowDonations(!showDonations)}
          >
            <h3 className="text-lg font-semibold text-neutral-700">
              {t("income.donations")}
            </h3>
            {showDonations ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>

          {showDonations && (
            <div className="p-4">
              {!sponsorData?.dataList.length ? (
                // 空状态显示
                <div className="flex justify-center items-center py-8 text-neutral-500">
                  {t("income.noDonations")}
                </div>
              ) : (
                <ul className="max-h-96 overflow-y-auto">
                  {sponsorData?.dataList.map((sponsor) => (
                    <li
                      key={`${sponsor.userId}-${sponsor.createAt}`}
                      className="flex items-center justify-between py-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={sponsor.avatarUrl || "/default-avatar.png"}
                            alt={sponsor.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">
                            {sponsor.displayName}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {formatDate(sponsor.createAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-orange-500 md:mr-48 font-medium">
                        {sponsor.offCoins} {t("income.currency")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="py-4">
                {(sponsorData?.totalPage || 1) > 1 && (
                  <Pagination
                    currentPage={currentSponsorPage}
                    totalPages={sponsorData?.totalPage || 1}
                    onPageChange={setCurrentSponsorPage}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 作品收入部分 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-neutral-50"
            onClick={() => setShowBooksIncome(!showBooksIncome)}
          >
            <h3 className="text-lg font-semibold text-neutral-700">
              {t("income.booksIncome")}
            </h3>
            {showBooksIncome ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>

          {showBooksIncome && (
            <div className="p-4">
              <div className="grid grid-cols-7 text-neutral-600 bg-neutral-100 font-semibold">
                <div className="p-3 col-span-2">
                  {t("income.columns.title")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.income24h")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.chapterIncome")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.donationIncome")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.bookTotalIncome")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.creationTime")}
                </div>
              </div>
              <ul className="max-h-96 overflow-y-auto">
                {incomeData?.dataList.map((book) => (
                  <li
                    key={book.id}
                    className="grid grid-cols-7 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <span className="col-span-2 font-medium text-neutral-600 truncate">
                      {book.title}
                    </span>
                    <span className="text-sm text-orange-400 text-center">
                      {book.income24h.toLocaleString()} {t("income.currency")}
                    </span>
                    <span className="text-sm text-center text-neutral-500">
                      {book.chapterIncome} {t("income.currency")}
                    </span>
                    <span className="text-sm text-center text-neutral-500">
                      {book.donationIncome.toLocaleString()}{" "}
                      {t("income.currency")}
                    </span>
                    <span className="text-sm text-center text-orange-400">
                      {book.bookTotalIncome.toLocaleString()}{" "}
                      {t("income.currency")}
                    </span>
                    <span className="text-sm text-center text-neutral-500">
                      {formatDate(book.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="py-4">
                {(incomeData?.totalPage || 1) > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={incomeData?.totalPage || 1}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Income;

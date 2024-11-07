// Income.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "../Main/Pagination";
import { useTranslation } from "../useTranslation";
import {
  fetchIncomeData,
  getSponsorList,
  transferToWallet,
  getTransferRecords
} from "@/app/lib/action";
import {
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import {
  IncomeBookInfo,
  PaginatedData,
  ApiResponse,
  SponsorInfo,
  TransferRecord,
  PaginatedTransferRecords
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
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferRecords, setTransferRecords] =
    useState<PaginatedTransferRecords | null>(null);
  const [currentTransferPage, setCurrentTransferPage] = useState(1);
  const [showTransferRecords, setShowTransferRecords] = useState(true);

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
        const [incomeResponse, sponsorResponse, transferResponse] =
          await Promise.all([
            fetchIncomeData(currentPage, ITEMS_PER_PAGE),
            getSponsorList(
              user?.id.toString() || "",
              currentSponsorPage,
              ITEMS_PER_PAGE
            ),
            getTransferRecords(currentTransferPage, ITEMS_PER_PAGE)
          ]);

        setIncomeData(incomeResponse.data);
        setSponsorData(sponsorResponse.data);
        setTransferRecords(transferResponse.data);
      } catch (err) {
        setError(t("income.fetchFailed"));
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [currentPage, currentSponsorPage, currentTransferPage, user?.id, t]);

  const handleTransfer = async () => {
    if (!transferAmount || isNaN(Number(transferAmount))) {
      setTransferError(t("income.invalidAmount"));
      return;
    }

    setIsTransferring(true);
    setTransferError(null);

    try {
      const response = await transferToWallet(Number(transferAmount));
      if (response.code === 200) {
        setTransferSuccess(true);
        // 2秒后关闭对话框
        setTimeout(() => {
          setShowTransferModal(false);
          setTransferAmount("");
          setTransferSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setTransferError(t("income.transferFailed"));
    } finally {
      setIsTransferring(false);
    }
  };

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

            <div>
              <span
                onClick={() => setShowTransferModal(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 cursor-pointer"
              >
                {t("income.wallet")}
              </span>

              {/* 添加转账模态框 */}
              {showTransferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {t("income.transferTitle")}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-orange-400" />
                        <p>{t("income.transferNotice")}</p>
                      </div>
                    </div>
                    {transferSuccess ? (
                      // 成功状态显示
                      <div className="text-center">
                        <div className="text-green-500 text-lg mb-2">
                          {t("income.transferSuccess")}
                        </div>
                        <div className="text-gray-500">
                          {t("income.autoClose")}
                        </div>
                      </div>
                    ) : (
                      // 转账表单
                      <div className="space-y-4">
                        <input
                          type="number"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder={t("income.amountPlaceholder")}
                        />

                        {transferError && (
                          <p className="text-red-500 text-sm">
                            {transferError}
                          </p>
                        )}

                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setShowTransferModal(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            {t("income.cancel")}
                          </button>
                          <button
                            onClick={handleTransfer}
                            disabled={isTransferring}
                            className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg disabled:opacity-50"
                          >
                            {isTransferring
                              ? t("income.processing")
                              : t("income.confirm")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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

        {/* 转账记录部分 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-neutral-50"
            onClick={() => setShowTransferRecords(!showTransferRecords)}
          >
            <h3 className="text-lg font-semibold text-neutral-700">
              {t("income.transferRecords")}
            </h3>
            {showTransferRecords ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>

          {showTransferRecords && (
            <div className="p-4">
              <div className="grid grid-cols-4 text-neutral-600 bg-neutral-100 font-semibold">
                <div className="p-3">{t("income.columns.transferType")}</div>
                <div className="p-3 text-center">
                  {t("income.columns.amount")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.status")}
                </div>
                <div className="p-3 text-center">
                  {t("income.columns.time")}
                </div>
              </div>

              {!transferRecords?.dataList.length ? (
                <div className="flex justify-center items-center py-8 text-neutral-500">
                  {t("income.noTransferRecords")}
                </div>
              ) : (
                <ul className="max-h-96 overflow-y-auto">
                  {transferRecords.dataList.map((record) => (
                    <li
                      key={record.id}
                      className="grid grid-cols-4 py-3 px-3 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <span className="font-medium text-neutral-600">
                        {t(`income.transferType.${record.type}`)}
                      </span>
                      <span className="text-sm text-orange-400 text-center">
                        {record.amount} {t("income.currency")}
                      </span>
                      <span
                        className={`text-sm text-center ${
                          record.status === "success"
                            ? "text-green-500"
                            : record.status === "failed"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {t(`income.transferStatus.${record.status}`)}
                      </span>
                      <span className="text-sm text-center text-neutral-500">
                        {formatDate(record.createAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="py-4">
                {(transferRecords?.totalPage || 1) > 1 && (
                  <Pagination
                    currentPage={currentTransferPage}
                    totalPages={transferRecords?.totalPage || 1}
                    onPageChange={setCurrentTransferPage}
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

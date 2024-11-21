import React, { useState, useEffect } from "react";
import { useTranslation } from "../useTranslation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Pagination from "../Main/Pagination";
import { getWithdrawHistory } from "@/app/lib/action";
import {
  PaginatedWithdrawRecords,
  WithdrawRecord
} from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 10;

export const WithdrawHistory: React.FC = () => {
  const { t } = useTranslation("wallet");
  const [withdrawRecords, setWithdrawRecords] =
    useState<PaginatedWithdrawRecords | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchWithdrawRecords = async () => {
      setIsLoading(true);
      try {
        const response = await getWithdrawHistory(currentPage, ITEMS_PER_PAGE);
        console.log("withdraw", response);
        if (response.code === 200) {
          setWithdrawRecords(response.data);
        }
      } catch (err) {
        console.error("Error fetching withdraw records:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawRecords();
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <ArrowPathIcon className="animate-spin h-5 w-5 mx-auto text-gray-400" />
      </div>
    );
  }

  if (!withdrawRecords?.dataList.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t("wallet.withdraw.noRecords")}
      </div>
    );
  }

  return (
    <div className="bg-white  shadow-sm border-b border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t("wallet.withdraw.history")}
        </h2>

        <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
          <div className="col-span-2">
            {t("wallet.withdraw.columns.amount")}
          </div>
          <div className="col-span-6 grid grid-cols-12">
            <div className="col-span-4">
              {t("wallet.withdraw.columns.bankName")}
            </div>
            <div className="col-span-8">
              {t("wallet.withdraw.columns.cardNumber")}
            </div>
          </div>
          <div className="col-span-2 text-center">
            {t("wallet.withdraw.columns.status")}
          </div>
          <div className="col-span-2 text-right">
            {t("wallet.withdraw.columns.time")}
          </div>
        </div>
        <div className="divide-y">
          {withdrawRecords.dataList.map((record: WithdrawRecord) => (
            <div key={record.id} className="grid grid-cols-12 py-3 text-sm">
              <div className="col-span-2 text-orange-500">
                ${record.amount.toLocaleString()}
              </div>
              <div className="col-span-6 grid grid-cols-12">
                <div className="col-span-4 font-medium text-gray-700">
                  {record.bankName}
                </div>
                <div className="col-span-8 text-gray-500">
                  {record.cardNumber}
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs
                    ${
                      record.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : record.status === "pending" ||
                          record.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {t(`wallet.withdraw.status.${record.status}`)}
                  {record.failReason && (
                    <span
                      className="ml-1 text-xs text-red-600"
                      title={record.failReason}
                    >
                      (!)
                    </span>
                  )}
                </span>
              </div>
              <div className="col-span-2 text-right text-gray-500">
                {formatDate(record.createAt)}
              </div>
            </div>
          ))}
        </div>
        {withdrawRecords.totalPage > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={withdrawRecords.totalPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

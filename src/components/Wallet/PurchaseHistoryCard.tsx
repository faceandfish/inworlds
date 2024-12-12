import React from "react";
import { PurchaseHistory, PaginatedData } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { HiShoppingCart } from "react-icons/hi2";
import Pagination from "../Main/Pagination";

interface PurchaseHistoryCardProps {
  purchaseHistory: PaginatedData<PurchaseHistory>;
  onPageChange: (page: number) => void;
}

export const PurchaseHistoryCard: React.FC<PurchaseHistoryCardProps> = ({
  purchaseHistory,
  onPageChange
}) => {
  const { t } = useTranslation("wallet");

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
        <HiShoppingCart className="mr-2 text-orange-400 text-2xl" />
        {t("wallet.historyTable.purchaseTitle")}
      </h2>
      {!purchaseHistory?.dataList || purchaseHistory.dataList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-neutral-500">{t("wallet.noRecords")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.historyTable.columns.date")}
                  </th>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.historyTable.columns.purchaseCoins")}
                  </th>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.historyTable.columns.amountPaid")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.dataList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t  text-sm text-neutral-400 border-orange-100"
                  >
                    <td className="p-2">
                      {new Date(item.createAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{item.coins}</td>
                    <td className="p-2">${item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {purchaseHistory.totalPage > 1 && (
            <div className="p-4 border-t border-orange-100">
              <Pagination
                currentPage={purchaseHistory.currentPage}
                totalPages={purchaseHistory.totalPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

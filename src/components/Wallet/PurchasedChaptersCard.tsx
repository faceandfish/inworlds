import React from "react";
import { PurchasedChapterInfo, PaginatedData } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { HiBookOpen } from "react-icons/hi2";
import Pagination from "../Main/Pagination";

interface PurchasedChaptersCardProps {
  purchasedChapters: PaginatedData<PurchasedChapterInfo>;
  onPageChange: (page: number) => void;
}

export const PurchasedChaptersCard: React.FC<PurchasedChaptersCardProps> = ({
  purchasedChapters,
  onPageChange
}) => {
  const { t } = useTranslation("wallet");

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
        <HiBookOpen className="mr-2 text-orange-400 text-2xl" />
        {t("wallet.purchasedChapters.title")}
      </h2>
      {purchasedChapters.dataList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-neutral-500">{t("wallet.noRecords")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="p-2 text-left  text-orange-800">
                    {t("wallet.purchasedChapters.bookTitle")}
                  </th>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.purchasedChapters.chapterTitle")}
                  </th>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.purchasedChapters.purchaseDate")}
                  </th>
                  <th className="p-2 text-left text-orange-800">
                    {t("wallet.purchasedChapters.cost")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchasedChapters.dataList.map((chapter) => (
                  <tr
                    key={`${chapter.bookId}-${chapter.chapterId}`}
                    className="border-t text-sm text-neutral-400 border-orange-100"
                  >
                    <td className="p-2 truncate max-w-[100px] md:max-w-[150px]">
                      {chapter.bookTitle}
                    </td>
                    <td className="p-2 truncate max-w-[100px] md:max-w-[150px]">
                      {chapter.chapterTitle}
                    </td>
                    <td className="p-2">
                      {new Date(chapter.createAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">{chapter.coins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {purchasedChapters.totalPage > 1 && (
            <div className="p-4 border-t border-orange-100">
              <Pagination
                currentPage={purchasedChapters.currentPage}
                totalPages={purchasedChapters.totalPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

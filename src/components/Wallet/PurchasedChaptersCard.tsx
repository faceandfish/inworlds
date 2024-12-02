// PurchasedChaptersCard.tsx
import React, { useMemo } from "react";
import { PurchasedChapterInfo, PaginatedData } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { HiBookOpen } from "react-icons/hi2";
import Pagination from "../Main/Pagination";

interface PurchasedChaptersCardProps {
  purchasedChapters: PaginatedData<PurchasedChapterInfo>;
  onPageChange: (page: number) => void;
}

const TableHeader: React.FC<{ t: (key: string) => string }> = React.memo(
  ({ t }) => (
    <thead className="bg-orange-100">
      <tr>
        <th className="p-2 text-left text-orange-800">
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
  )
);

const TableRow: React.FC<{ chapter: PurchasedChapterInfo }> = React.memo(
  ({ chapter }) => (
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
      <td className="p-2">{new Date(chapter.createAt).toLocaleDateString()}</td>
      <td className="p-2">{chapter.coinsPaid}</td>
    </tr>
  )
);

export const PurchasedChaptersCard: React.FC<PurchasedChaptersCardProps> =
  React.memo(({ purchasedChapters, onPageChange }) => {
    const { t } = useTranslation("wallet");

    // 使用 useMemo 缓存一些计算结果
    const hasChapters = useMemo(
      () => purchasedChapters.dataList.length > 0,
      [purchasedChapters.dataList.length]
    );

    const showPagination = useMemo(
      () => purchasedChapters.totalPage > 1,
      [purchasedChapters.totalPage]
    );

    // 只在开发环境下记录日志
    if (process.env.NODE_ENV === "development") {
      console.log("PurchasedChaptersCard render with:", {
        chaptersCount: purchasedChapters.dataList.length,
        currentPage: purchasedChapters.currentPage,
        totalPages: purchasedChapters.totalPage
      });
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
          <HiBookOpen className="mr-2 text-orange-400 text-2xl" />
          {t("wallet.purchasedChapters.title")}
        </h2>

        {!hasChapters ? (
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-neutral-500">{t("wallet.noRecords")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <TableHeader t={t} />
                <tbody>
                  {purchasedChapters.dataList.map((chapter) => (
                    <TableRow
                      key={`${chapter.bookId}-${chapter.chapterId}`}
                      chapter={chapter}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {showPagination && (
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
  });

export default PurchasedChaptersCard;

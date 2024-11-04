"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  PurchasedChapterInfo,
  ApiResponse,
  PaginatedData
} from "@/app/lib/definitions";
import { getBookPurchasedChapters } from "@/app/lib/action";

interface PurchasedChaptersContextType {
  purchasedChapters: { [bookId: number]: number[] };
  fetchPurchasedChapters: (bookId: number) => Promise<void>;
  isChapterPurchased: (bookId: number, chapterId: number) => boolean;
  addPurchasedChapter: (bookId: number, chapterId: number) => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const PurchasedChaptersContext = createContext<
  PurchasedChaptersContextType | undefined
>(undefined);

export const PurchasedChaptersProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  // 状态管理
  const [purchasedChapters, setPurchasedChapters] = useState<{
    [bookId: number]: number[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 获取已购买章节列表
  const fetchPurchasedChapters = useCallback(
    async (bookId: number) => {
      // 如果已经有数据，就不重复请求
      if (purchasedChapters[bookId]) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<PaginatedData<PurchasedChapterInfo>> =
          await getBookPurchasedChapters(1, 1000, bookId);

        if (response.code === 200) {
          const chapterIds = response.data.dataList.map(
            (chapter) => chapter.chapterId
          );
          setPurchasedChapters((prev) => ({ ...prev, [bookId]: chapterIds }));
        } else {
          throw new Error(response.msg || "获取已购买章节失败");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "获取已购买章节失败";
        setError(errorMessage);
        console.error("Error fetching purchased chapters:", error);
      } finally {
        setLoading(false);
      }
    },
    [purchasedChapters]
  );

  // 检查章节是否已购买
  const isChapterPurchased = useCallback(
    (bookId: number, chapterId: number) => {
      return purchasedChapters[bookId]?.includes(chapterId) || false;
    },
    [purchasedChapters]
  );

  // 添加新购买的章节
  const addPurchasedChapter = useCallback(
    (bookId: number, chapterId: number) => {
      setPurchasedChapters((prev) => {
        // 如果这本书已经有购买记录
        if (prev[bookId]) {
          // 检查是否已存在
          if (prev[bookId].includes(chapterId)) {
            return prev;
          }
          // 添加新章节ID
          return {
            ...prev,
            [bookId]: [...prev[bookId], chapterId].sort((a, b) => a - b) // 保持有序
          };
        }
        // 如果是这本书的第一个购买记录
        return {
          ...prev,
          [bookId]: [chapterId]
        };
      });
    },
    []
  );

  const value = {
    purchasedChapters,
    fetchPurchasedChapters,
    isChapterPurchased,
    addPurchasedChapter,
    loading,
    error,
    clearError
  };

  return (
    <PurchasedChaptersContext.Provider value={value}>
      {children}
    </PurchasedChaptersContext.Provider>
  );
};

export const usePurchasedChapters = () => {
  const context = useContext(PurchasedChaptersContext);
  if (context === undefined) {
    throw new Error(
      "usePurchasedChapters must be used within a PurchasedChaptersProvider"
    );
  }
  return context;
};

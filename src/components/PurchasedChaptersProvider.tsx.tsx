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
}

const PurchasedChaptersContext = createContext<
  PurchasedChaptersContextType | undefined
>(undefined);

export const PurchasedChaptersProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [purchasedChapters, setPurchasedChapters] = useState<{
    [bookId: number]: number[];
  }>({});

  const fetchPurchasedChapters = useCallback(async (bookId: number) => {
    try {
      const response: ApiResponse<PaginatedData<PurchasedChapterInfo>> =
        await getBookPurchasedChapters(1, 1000, bookId);
      if (response.code === 200) {
        const chapterIds = response.data.dataList.map(
          (chapter) => chapter.chapterId
        );
        setPurchasedChapters((prev) => ({ ...prev, [bookId]: chapterIds }));
      }
    } catch (error) {
      console.error("Error fetching purchased chapters:", error);
    }
  }, []);

  const isChapterPurchased = useCallback(
    (bookId: number, chapterId: number) => {
      return purchasedChapters[bookId]?.includes(chapterId) || false;
    },
    [purchasedChapters]
  );

  const addPurchasedChapter = useCallback(
    (bookId: number, chapterId: number) => {
      setPurchasedChapters((prev) => ({
        ...prev,
        [bookId]: [...(prev[bookId] || []), chapterId]
      }));
    },
    []
  );

  return (
    <PurchasedChaptersContext.Provider
      value={{
        purchasedChapters,
        fetchPurchasedChapters,
        isChapterPurchased,
        addPurchasedChapter
      }}
    >
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

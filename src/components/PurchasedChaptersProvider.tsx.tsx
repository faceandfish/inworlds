"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  PurchasedChapterInfo,
  ApiResult,
  PaginatedData
} from "@/app/lib/definitions";
import { getBookPurchasedChapters } from "@/app/lib/action";
import { logger } from "./Main/logger";

// 定义 Context 类型
interface PurchasedChaptersContextType {
  purchasedChapters: { [bookId: number]: number[] };
  fetchPurchasedChapters: (bookId: number) => Promise<void>;
  isChapterPurchased: (bookId: number, chapterId: number) => boolean;
  addPurchasedChapter: (bookId: number, chapterId: number) => void;
  syncPurchasedChapters: (bookIds: number[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// 创建 Context
const PurchasedChaptersContext = createContext<
  PurchasedChaptersContextType | undefined
>(undefined);

// 缓存键常量
const STORAGE_KEY = "purchasedChapters";
const CACHE_EXPIRY_TIME = 1000 * 60 * 60; // 1小时缓存过期

interface CacheData {
  data: { [bookId: number]: number[] };
  timestamp: number;
}

export const PurchasedChaptersProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [purchasedChapters, setPurchasedChapters] = useState<{
    [bookId: number]: number[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedBooksRef = useRef<Set<number>>(new Set());
  const lastFetchTimeRef = useRef<{ [bookId: number]: number }>({});

  // 初始化时从 localStorage 加载数据
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData: CacheData = JSON.parse(savedData);
        const now = Date.now();

        // 检查缓存是否过期
        if (now - parsedData.timestamp < CACHE_EXPIRY_TIME) {
          setPurchasedChapters(parsedData.data);
          // 将已缓存的书籍ID添加到已获取集合中
          Object.keys(parsedData.data).forEach((bookId) => {
            fetchedBooksRef.current.add(Number(bookId));
            lastFetchTimeRef.current[Number(bookId)] = parsedData.timestamp;
          });
        } else {
          // 缓存过期，清除本地存储
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      logger.error("Error loading cached purchased chapters", error, {
        context: "PurchasedChaptersProvider"
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 获取已购买章节
  const fetchPurchasedChapters = useCallback(async (bookId: number) => {
    const now = Date.now();

    // 检查是否需要重新获取数据
    if (
      fetchedBooksRef.current.has(bookId) &&
      lastFetchTimeRef.current[bookId] &&
      now - lastFetchTimeRef.current[bookId] < CACHE_EXPIRY_TIME
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getBookPurchasedChapters(1, 1000, bookId);

      if (response.code === 200 && "data" in response && response.data) {
        const chapterIds = response.data.dataList.map(
          (chapter) => chapter.chapterId
        );

        setPurchasedChapters((prev) => {
          const updated = { ...prev, [bookId]: chapterIds };
          // 更新缓存
          const cacheData: CacheData = {
            data: updated,
            timestamp: now
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
          return updated;
        });

        // 更新获取状态
        fetchedBooksRef.current.add(bookId);
        lastFetchTimeRef.current[bookId] = now;
      } else {
        // 处理 data 为 null 的情况
        setPurchasedChapters((prev) => {
          const updated = { ...prev, [bookId]: [] };
          return updated;
        });
        throw new Error(response.msg || "Failed to fetch purchased chapters");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error fetching purchased chapters";
      setError(errorMessage);
      logger.error("Error fetching purchased chapters", error, {
        context: "PurchasedChaptersProvider"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 同步多本书的购买状态
  const syncPurchasedChapters = useCallback(
    async (bookIds: number[]) => {
      const now = Date.now();
      for (const bookId of bookIds) {
        // 检查缓存是否有效
        if (
          !fetchedBooksRef.current.has(bookId) ||
          !lastFetchTimeRef.current[bookId] ||
          now - lastFetchTimeRef.current[bookId] >= CACHE_EXPIRY_TIME
        ) {
          await fetchPurchasedChapters(bookId);
        }
      }
    },
    [fetchPurchasedChapters]
  );

  // 检查章节是否已购买
  const isChapterPurchased = useCallback(
    (bookId: number, chapterId: number): boolean => {
      return purchasedChapters[bookId]?.includes(chapterId) || false;
    },
    [purchasedChapters]
  );

  // 添加新购买的章节
  const addPurchasedChapter = useCallback(
    (bookId: number, chapterId: number) => {
      setPurchasedChapters((prev) => {
        // 如果章节已存在，直接返回当前状态
        if (prev[bookId]?.includes(chapterId)) {
          return prev;
        }

        const updated = {
          ...prev,
          [bookId]: [...(prev[bookId] || []), chapterId].sort((a, b) => a - b)
        };

        // 更新缓存
        const cacheData: CacheData = {
          data: updated,
          timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));

        return updated;
      });
    },
    []
  );

  const value = {
    purchasedChapters,
    fetchPurchasedChapters,
    isChapterPurchased,
    addPurchasedChapter,
    syncPurchasedChapters,
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

// Hook for using the purchased chapters context
export const usePurchasedChapters = () => {
  const context = useContext(PurchasedChaptersContext);
  if (context === undefined) {
    throw new Error(
      "usePurchasedChapters must be used within a PurchasedChaptersProvider"
    );
  }
  return context;
};

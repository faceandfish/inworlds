"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import Category from "@/components/Navbar/Category";
import { BookInfo } from "@/app/lib/definitions";
import { fetchHomepageBooks } from "@/app/lib/action";
import BookPreviewCardSkeleton from "@/components/Book/skeleton/BookPreviewCardSkeleton";
import { useTranslation } from "../useTranslation";

interface HomePageProps {
  initialBooks: BookInfo[];
}

export default function HomePage({ initialBooks }: HomePageProps) {
  const { t, lang, browserLanguage } = useTranslation("navbar");
  const [books, setBooks] = useState<BookInfo[]>(initialBooks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const memoizedBooks = useMemo(() => books, [books]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const response = await fetchHomepageBooks(page, 20, {
          preferredLanguage: lang,
          browserLanguage
        });

        if (response.code === 200 && "data" in response) {
          setBooks((prevBooks) => {
            if (page === 1) {
              return response.data.dataList || [];
            }
            const newDataList = response.data.dataList || [];
            const uniqueIds = new Set(prevBooks.map((book) => book.id));
            const newBooks = newDataList.filter(
              (book) => !uniqueIds.has(book.id)
            );
            return [...prevBooks, ...newBooks];
          });

          setHasMore((response.data.dataList?.length || 0) >= 20);
        }
      } catch (err) {
        setError("err");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [page, lang, browserLanguage]);

  // 语言改变时重置所有状态
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [lang]);

  if (!memoizedBooks) {
    return <BookPreviewCardSkeleton />;
  }

  return (
    <div className="w-10/12 mx-auto">
      <Category />
      {loading && books.length === 0 ? (
        <BookPreviewCardSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {memoizedBooks.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              ref={index === books.length - 1 ? lastBookElementRef : null}
            >
              <BookPreviewCard book={book} />
            </div>
          ))}
          {loading && <BookPreviewCardSkeleton />}
        </div>
      )}

      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!hasMore && <div className="text-center py-4">{t("noMoreContent")}</div>}
    </div>
  );
}

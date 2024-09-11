"use client";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import Category from "@/components/Category";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from "react";
import { BookInfo } from "@/app/lib/definitions";
import { fetchHomepageBooks } from "@/app/lib/action";
import BookPreviewCardSkeleton from "@/components/Skeleton/BookPreviewCardSkeleton";

export default function Home() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchBooks = async () => {
      if (page === 1) setLoading(true);
      try {
        setLoading(true);
        const response = await fetchHomepageBooks(page);
        setBooks((prevBooks) => {
          // 创建一个新的Set来存储唯一的书籍ID
          const uniqueIds = new Set(prevBooks.map((book) => book.id));
          // 过滤掉已经存在的书籍
          const newBooks = response.data.dataList.filter(
            (book) => !uniqueIds.has(book.id)
          );
          return [...prevBooks, ...newBooks];
        });
        setHasMore(response.data.dataList.length > 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  return (
    <>
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
        {!hasMore && <div className="text-center py-4">没有更多书籍了</div>}
      </div>
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { BookInfo, PaginatedData, SponsorInfo } from "@/app/lib/definitions";

import { useUserInfo } from "../useUserInfo";
import { BookPreviewCard } from "../Book/BookPreviewCard";
import { SponsorList } from "./SponsorList";
import { useParams } from "next/navigation";
import { fetchPublicBooksList } from "@/app/lib/action";

export default function WorksSection() {
  const [books, setBooks] = useState<BookInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetchPublicBooksList(userId);
        console.log(response);

        if (response.code === 200) {
          setBooks(response.data);
        } else {
          setError(response.msg || "获取书籍列表失败");
        }
      } catch (err) {
        setError("获取书籍列表时发生错误");
        if (err instanceof Error) {
          console.error("Error details:", err.message);
        } else {
          console.error("Unknown error:", err);
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, [userId]);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误：{error}</div>;
  if (!books) return <div>没有找到书籍</div>;

  const ongoingBooks = books.filter((book) => book.status === "ongoing");
  const completedBooks = books.filter((book) => book.status === "completed");

  return (
    <div className="pt-10 px-20 flex bg-neutral-50  gap-10">
      <div className="w-2/3 ">
        {ongoingBooks.length > 0 && (
          <div className="mb-10 p-5 bg-white shadow rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">火热连载中</h2>
            <div className="flex flex-col gap-8">
              {ongoingBooks.map((book) => (
                <BookPreviewCard
                  key={book.id}
                  book={book}
                  width="w-full"
                  height="h-48"
                />
              ))}
            </div>
          </div>
        )}
        {completedBooks.length > 0 && (
          <div className="bg-white shadow p-5 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">完结作品</h2>
            <div className="flex flex-col gap-8">
              {completedBooks.map((book) => (
                <BookPreviewCard
                  key={book.id}
                  book={book}
                  width="w-full"
                  height="h-48"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <SponsorList />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

import CommentSection from "@/components/Book/CommentSection";
import { BookInfo, ChapterInfo, PaginatedData } from "@/app/lib/definitions";
import Pagination from "../Pagination";
import { getChapterList } from "@/app/lib/action";
import { useUser } from "../UserContextProvider";
import { useRouter } from "next/navigation";
import { useTranslation } from "../useTranslation";
import { ContentTabs } from "./ContentTabs";
import { ChapterList } from "./ChapterList";

interface BookContentProps {
  book: BookInfo;
}

export function BookContent({ book }: BookContentProps) {
  const [activeTab, setActiveTab] = useState<"comments" | "chapters">(
    "comments"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser(); // 使用 useUser 钩子获取用户信息
  const router = useRouter(); // 使用 useRouter 钩子
  const { t } = useTranslation("book");

  const isLoggedIn = !!user; // 根据 user 是否存在来判断登录状态

  const handleLogin = () => {
    // 跳转到登录页面
    router.push("/login"); // 假设登录页面的路由是 '/login'
  };

  const fetchChapters = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getChapterList(book.id, page, 21);
      setChapters(response.data.dataList);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters(currentPage);
  }, [currentPage, book.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-6 md:mt-10 min-h-screen">
      <ContentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        book={book}
      />

      {activeTab === "comments" && (
        <CommentSection
          bookId={book.id}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
        />
      )}
      {activeTab === "chapters" && (
        <>
          <ChapterList
            chapters={chapters}
            book={book}
            className="mt-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

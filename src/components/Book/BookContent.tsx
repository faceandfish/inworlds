"use client";

import React, { useEffect, useState } from "react";
import CommentSection from "@/components/Book/CommentSection";
import { BookInfo, ChapterInfo, PaginatedData } from "@/app/lib/definitions";
import Pagination from "../Main/Pagination";
import { getPublicChapterList } from "@/app/lib/action";
import { useUser } from "../UserContextProvider";
import { useRouter } from "next/navigation";
import { useTranslation } from "../useTranslation";
import { ContentTabs } from "./ContentTabs";
import { ChapterList } from "./ChapterList";
import { logger } from "../Main/logger";

interface BookContentProps {
  book: BookInfo;
}

export function BookContent({ book: initialBook }: BookContentProps) {
  const [book, setBook] = useState(initialBook);
  const [activeTab, setActiveTab] = useState<"comments" | "chapters">(
    "comments"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation("book");
  const [totalRecord, setTotalRecord] = useState(0);
  const isLoggedIn = !!user;

  const handleLogin = () => {
    router.push("/login");
  };

  const fetchChapters = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getPublicChapterList(book.id, page, 21);

      if (response.code === 200 && "data" in response) {
        setChapters(response.data.dataList);
        setTotalPages(response.data.totalPage);
        setTotalRecord(response.data.totalRecord);
      } else {
        // Handle error case
        throw new Error(response.msg || "Failed to fetch chapters");
      }
    } catch (error) {
      logger.error("Error fetching chapters", error, {
        context: "BookContent"
      });
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

  const handleCommentCountChange = (newCount: number) => {
    setBook((prev) => ({
      ...prev,
      commentsCount: newCount
    }));
  };

  return (
    <div className="mt-6 md:mt-10 min-h-screen">
      <ContentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        book={book}
        totalRecord={totalRecord}
      />

      {activeTab === "comments" && (
        <CommentSection
          bookId={book.id}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          currentUserId={user?.id || null}
          onCommentCountChange={handleCommentCountChange}
        />
      )}
      {activeTab === "chapters" && (
        <>
          <ChapterList
            chapters={chapters}
            book={book}
            className="mt-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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

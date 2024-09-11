"use client";

import React, { useEffect, useState } from "react";
import { ChapterList, ContentTabs } from "@/components/Book";
import CommentSection from "@/components/Book/CommentSection";
import { BookInfo, ChapterInfo, PaginatedData } from "@/app/lib/definitions";
import Pagination from "../Pagination";
import { getChapterList } from "@/app/lib/action";

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
    <div className="mt-10 min-h-screen">
      <ContentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        book={book}
      />

      {activeTab === "comments" && <CommentSection bookId={book.id} />}
      {activeTab === "chapters" && (
        <>
          <ChapterList
            chapters={chapters}
            book={book}
            className="mt-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

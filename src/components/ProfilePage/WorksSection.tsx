"use client";
import React, { useState, useEffect } from "react";
import { BookInfo, PaginatedData, SponsorInfo } from "@/app/lib/definitions";
import { BookPreviewCard } from "../Book/BookPreviewCard";
import { SponsorList } from "./SponsorList";
import { useParams } from "next/navigation";
import { fetchPublicBooksList } from "@/app/lib/action";
import WorksSectionSkeleton from "./skeleton/WorksSectionSkeleton";
import { useTranslation } from "../useTranslation";
import { logger } from "../Main/logger";

export default function WorksSection() {
  const [books, setBooks] = useState<BookInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const userId = params.id as string;
  const { t } = useTranslation("profile");

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPublicBooksList(userId);

        if (response.code === 200 && "data" in response && response.data) {
          setBooks(response.data);
        } else {
          logger.warn("Failed to fetch books list:", response, {
            context: "WorksSection"
          });
          setError(response.msg || t("worksSection.noBooksFound"));
        }
      } catch (err) {
        logger.error("Error loading books:", err, { context: "WorksSection" });
        setError(t("worksSection.error"));
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, [userId, t]);

  if (isLoading) {
    return <WorksSectionSkeleton />;
  }
  if (error)
    return (
      <div>
        {t("worksSection.error")} {error}
      </div>
    );
  if (!books) return <div>{t("worksSection.noBooksFound")}</div>;

  const ongoingBooks = books.filter((book) => book.status === "ongoing");
  const completedBooks = books.filter((book) => book.status === "completed");

  return (
    <div className="pt-6 sm:pt-10 px-4 sm:px-20 flex flex-col sm:flex-row bg-neutral-50 gap-6 sm:gap-10">
      <div className="w-full sm:w-2/3">
        {ongoingBooks.length > 0 && (
          <div className="mb-6 sm:mb-10 p-4 sm:p-5 bg-white shadow rounded-xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {t("worksSection.ongoingSeries")}
            </h2>
            <div className="flex flex-col gap-6 sm:gap-8">
              {ongoingBooks.map((book) => (
                <BookPreviewCard
                  key={book.id}
                  book={book}
                  width="w-full"
                  height="h-40 sm:h-48"
                />
              ))}
            </div>
          </div>
        )}
        {completedBooks.length > 0 && (
          <div className="bg-white shadow p-4 sm:p-5 rounded-xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {t("worksSection.completedWorks")}
            </h2>
            <div className="flex flex-col gap-6 sm:gap-8">
              {completedBooks.map((book) => (
                <BookPreviewCard
                  key={book.id}
                  book={book}
                  width="w-full"
                  height="h-40 sm:h-48"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <SponsorList userId={userId} />
    </div>
  );
}

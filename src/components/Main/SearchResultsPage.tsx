"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { publicSearchBooks, searchBooks } from "@/app/lib/action";
import { SearchResult } from "@/app/lib/definitions";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/Messages/UserPreviewCard";
import { useTranslation } from "@/components/useTranslation";
import { useUser } from "../UserContextProvider";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { t } = useTranslation("navbar");
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      // 如果和上一次的查询相同，不重复请求
      if (query === lastQueryRef.current) return;

      setIsLoading(true);
      lastQueryRef.current = query;

      try {
        // 根据用户登录状态选择不同的搜索函数
        const results = user
          ? await searchBooks(query)
          : await publicSearchBooks(query);
        setSearchResults(results.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center text-neutral-500">
        {t("noResults")}
      </div>
    );
  }

  return (
    <div className="py-5 px-4 sm:px-6 md:px-8 lg:px-20">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        {t("searchResultsFor")} "{query}"
      </h1>

      {searchResults.users.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{t("users")}</h2>
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.users.map((user) => (
              <UserPreviewCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {searchResults.books.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("books")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.books.map((book) => (
              <BookPreviewCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

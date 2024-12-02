"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { publicSearchBooks, searchBooks } from "@/app/lib/action";
import { SearchResult } from "@/app/lib/definitions";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/Messages/UserPreviewCard";
import { useTranslation } from "@/components/useTranslation";
import { useUser } from "../UserContextProvider";
import { logger } from "../Main/logger";

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
      if (query === lastQueryRef.current) return;

      setIsLoading(true);
      lastQueryRef.current = query;

      try {
        const results = user
          ? await searchBooks(query)
          : await publicSearchBooks(query);

        if (results.code === 200 && "data" in results) {
          setSearchResults(results.data);
        } else {
          logger.error("Search API error", {
            response: results,
            isLoggedIn: !!user,
            context: "SearchResultsPage.fetchResults"
          });
        }
      } catch (error) {
        logger.error("Search error", {
          error,
          isLoggedIn: !!user,
          context: "SearchResultsPage.fetchResults"
        });
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
      {searchResults.users.length > 0 && (
        <div className="mb-8">
          <div className=" w-full ">
            {searchResults.users.map((user) => (
              <UserPreviewCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {searchResults.books.length > 0 && (
        <div>
          {searchResults.books.map((book) => (
            <div key={book.id} className="mb-4">
              <BookPreviewCard book={book} width="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

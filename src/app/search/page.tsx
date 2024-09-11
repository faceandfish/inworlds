"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchBooks } from "@/app/lib/action";
import { BookInfo, UserInfo, SearchResult } from "@/app/lib/definitions";
import BookPreviewCardSkeleton from "@/components/Skeleton/BookPreviewCardSkeleton";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/ProfilePage/UserPreviewCard";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (q) {
      const fetchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await searchBooks(q);
          if (response.code !== 200) {
            throw new Error(response.msg || "搜索失败");
          }
          setResults(response.data);
          console.log(response.data);
          console.log(response.data.books);
          console.log(response.data.users);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "搜索时出错，请稍后再试"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    }
  }, [q]);

  if (!q) {
    return <div>No search query provided</div>;
  }

  return (
    <div className="min-h-screen py-8 px-20">
      {isLoading && <BookPreviewCardSkeleton />}
      {error && <p className="text-red-500">{error}</p>}
      {results && (
        <div className="space-y-4">
          <div className="flex flex-col gap-8">
            {results.users.map((user) => (
              <UserPreviewCard key={user.id} user={user} />
            ))}
            {results.books.map((book) => (
              <BookPreviewCard key={book.id} book={book} width="w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

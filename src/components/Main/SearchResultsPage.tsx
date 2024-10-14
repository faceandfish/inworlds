"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchBooks } from "@/app/lib/action";
import { SearchResult } from "@/app/lib/definitions";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/Messages/UserPreviewCard";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const results = await searchBooks(query);
        console.log("Search results:", results);
        setSearchResults(results.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!searchResults) {
    return <div className="p-4">No results found.</div>;
  }

  return (
    <div className="py-5 px-4 sm:px-6 md:px-8 lg:px-20">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      {searchResults.users.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.users.map((user) => (
              <UserPreviewCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
      {searchResults.books.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Books</h2>
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

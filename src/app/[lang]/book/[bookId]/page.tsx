import React from "react";
import { notFound } from "next/navigation";
import { getBookDetails } from "@/app/lib/action";
import { BookHeader } from "@/components/Book/BookHeader";
import { BookDescription } from "@/components/Book/BookDescription";
import { BookContent } from "@/components/Book/BookContent";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { ApiResponse, BookInfo } from "@/app/lib/definitions";
import { logger } from "@/components/Main/logger";

interface BookPageProps {
  params: {
    bookId: string;
  };
}

// Cache data fetching function
const getCachedBookData = unstable_cache(
  async (bookId: number) => {
    const bookResponse = await getBookDetails(bookId);
    if (bookResponse.code === 200 && "data" in bookResponse) {
      return bookResponse.data;
    }
    return null;
  },
  ["book-data"],
  { revalidate: 600 } // 1 minute cache
);

export async function generateMetadata({
  params
}: BookPageProps): Promise<Metadata> {
  try {
    const bookId = parseInt(params.bookId, 10);
    if (isNaN(bookId)) {
      return { title: "Invalid Book ID" };
    }

    const book = await getCachedBookData(bookId);
    if (!book) {
      return { title: "Book Not Found" };
    }
    return {
      title: book.title,
      description: book.description || `Read ${book.title} on InWorlds.`,
      openGraph: {
        title: book.title,
        description: book.description,
        images: book.coverImageUrl
          ? [
              {
                url: book.coverImageUrl,
                width: 800,
                height: 600,
                alt: book.title
              }
            ]
          : undefined
      }
    };
  } catch (error) {
    logger.error("Error generating metadata", error, { context: "BookPage" });
    return { title: "Error Loading Book" };
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const bookId = parseInt(params.bookId, 10);
  if (isNaN(bookId)) {
    notFound();
  }

  try {
    const book = await getCachedBookData(bookId);
    if (!book) {
      notFound();
    }

    return (
      <div className="w-full md:w-5/6 mx-auto px-4 md:px-0">
        <BookHeader book={book} />
        <BookDescription book={book} />
        <BookContent book={book} />
      </div>
    );
  } catch (error) {
    logger.error("Error fetching book data", error, { context: "BookPage" });
    throw error;
  }
}

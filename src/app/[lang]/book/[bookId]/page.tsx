import React from "react";
import { notFound } from "next/navigation";
import { getBookDetails } from "@/app/lib/action";
import { BookHeader } from "@/components/Book/BookHeader";
import { BookDescription } from "@/components/Book/BookDescription";
import { BookContent } from "@/components/Book/BookContent";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

interface BookPageProps {
  params: {
    bookId: string;
  };
}

// 缓存数据获取函数
const getCachedBookData = unstable_cache(
  async (bookId: number) => {
    const bookResponse = await getBookDetails(bookId);

    return bookResponse.data;
  },
  ["book-data"],
  { revalidate: 60 } // 1分钟缓存
);

// 添加generateMetadata函数
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
    console.error("获取书籍数据时出错:", error);
    throw error;
  }
}

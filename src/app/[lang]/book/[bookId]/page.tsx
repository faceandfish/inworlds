import React from "react";
import { notFound } from "next/navigation";
import { getBookDetails } from "@/app/lib/action";
import { BookHeader } from "@/components/Book/BookHeader";
import { BookDescription } from "@/components/Book/BookDescription";
import { BookContent } from "@/components/Book/BookContent";

interface BookPageProps {
  params: {
    bookId: string;
  };
}

async function getBookData(bookId: number) {
  try {
    const bookResponse = await getBookDetails(bookId);

    return {
      book: bookResponse.data
    };
  } catch (error) {
    console.error("Error fetching book data:", error);
    throw error;
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const bookId = parseInt(params.bookId, 10);
  if (isNaN(bookId)) {
    notFound();
  }

  try {
    const { book } = await getBookData(bookId);
    if (!book) {
      notFound();
    }

    return (
      <>
        <div className="w-full md:w-5/6 mx-auto px-4 md:px-0">
          <BookHeader book={book} />
          <BookDescription book={book} />
          <BookContent book={book} />
        </div>
      </>
    );
  } catch (error) {
    console.error("获取书籍数据时出错:", error);
    throw error;
  }
}

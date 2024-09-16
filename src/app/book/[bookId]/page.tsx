import React from "react";
import { notFound } from "next/navigation";
import { BookHeader, BookDescription, BookContent } from "@/components/Book";
import {
  getBookDetails,
  getChapterList,
  getBookComments
} from "@/app/lib/action";
import { UserInfo } from "@/app/lib/definitions";
import CommentSection from "@/components/Book/CommentSection";

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
        <div className="w-5/6 mx-auto">
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

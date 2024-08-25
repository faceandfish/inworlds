import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BookHeader, BookDescription, BookContent } from "@/components/Book";
import {
  getBookDetails,
  getChapterList,
  getBookComments
} from "@/app/lib/action";
import { CreatorUserInfo, UserInfo } from "@/app/lib/definitions";

interface BookPageProps {
  params: {
    bookId: string;
  };
}

async function getBookData(bookId: number) {
  try {
    const [bookResponse, chaptersResponse, commentsResponse] =
      await Promise.all([
        getBookDetails(bookId),
        getChapterList(bookId, 1, 20),
        getBookComments(bookId, 1, 20)
      ]);

    return {
      book: bookResponse.data,
      chapters: chaptersResponse.data,
      comments: commentsResponse.data
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
    const { book, chapters, comments } = await getBookData(bookId);
    if (!book || !chapters || !comments) {
      notFound();
    }

    return (
      <>
        <Navbar />
        <div className="w-5/6 mx-auto">
          <BookHeader book={book} />
          <BookDescription book={book} />
          <BookContent
            book={book}
            chapters={chapters.dataList}
            comments={comments.dataList}
            chaptersPagination={chapters}
            commentsPagination={comments}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("获取书籍数据时出错:", error);
    throw error;
  }
}

// app/[bookId]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BookHeader, BookDescription, BookContent } from "@/components/Book";

import { BookInfo, UserInfo, CreatorUserInfo } from "@/app/lib/definitions";
import {
  getMockBooks,
  getCurrentUser,
  getMockComments,
  getMockChapters,
} from "@/mockData";

async function getBookData(bookId: string) {
  // 在实际应用中，这里应该从数据库或API获取数据
  const books = getMockBooks();
  const book = books.find((b) => b.id.toString() === bookId);
  if (!book) {
    notFound();
  }
  const author = getCurrentUser();
  const comments = getMockComments();
  const chapters = getMockChapters();

  return { book, author, comments, chapters };
}

interface BookPageProps {
  params: {
    bookId: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { book, author, comments, chapters } = await getBookData(params.bookId);

  const isCreatorUser = (user: UserInfo): user is CreatorUserInfo => {
    return user.userType === "creator";
  };

  if (!isCreatorUser(author)) {
    return <div>Error: This book's author is not a creator user.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-5/6 mx-auto">
        <BookHeader book={book} author={author} />
        <BookDescription book={book} />
        <BookContent book={book} comments={comments} chapters={chapters} />
      </div>
    </>
  );
}

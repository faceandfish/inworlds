import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import BookIntro from "../WritingPage/BookIntro";

interface BookDetailsProps {
  book: BookInfo;
  onSave: (
    updatedBook: Partial<Pick<BookInfo, "title" | "description">>
  ) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onSave }) => {
  const [editedBook, setEditedBook] = useState<
    Pick<BookInfo, "title" | "description">
  >({
    title: book.title,
    description: book.description
  });

  const handleBookChange = (
    updates: Partial<Pick<BookInfo, "title" | "description">>
  ) => {
    setEditedBook((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedBook);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-10"
      >
        <BookIntro
          book={editedBook}
          onBookChange={handleBookChange}
          descriptionRows={8}
        />
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          保存修改
        </button>
      </form>
    </>
  );
};

export default BookDetails;

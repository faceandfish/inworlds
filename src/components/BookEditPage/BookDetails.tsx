import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import BookIntro from "../WritingPage/BookIntro";
import Alert from "../Alert";

interface BookDetailsProps {
  book: BookInfo;
  onSave: (
    updatedBook: Partial<Pick<BookInfo, "title" | "description">>
  ) => Promise<boolean>;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onSave }) => {
  const [editedBook, setEditedBook] = useState<
    Pick<BookInfo, "title" | "description">
  >({
    title: book.title,
    description: book.description
  });
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleBookChange = (
    updates: Partial<Pick<BookInfo, "title" | "description">>
  ) => {
    setEditedBook((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await onSave(editedBook);
      if (success) {
        setAlert({ message: "书籍详情更新成功", type: "success" });
      } else {
        setAlert({ message: "更新书籍详情失败", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "更新书籍详情时出错", type: "error" });
    }
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
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default BookDetails;

import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import BookIntro from "../WritingPage/BookIntro";
import Alert from "../Main/Alert";
import { useTranslation } from "../useTranslation";

interface BookDetailsProps {
  book: BookInfo;
  onSave: (
    updatedBook: Partial<Pick<BookInfo, "title" | "description">>
  ) => Promise<boolean>;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onSave }) => {
  const { t } = useTranslation("bookedit");

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
        setAlert({ message: t("bookDetails.updateSuccess"), type: "success" });
      } else {
        setAlert({ message: t("bookDetails.updateFail"), type: "error" });
      }
    } catch (error) {
      setAlert({ message: t("bookDetails.updateError"), type: "error" });
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
          {t("general.save")}
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

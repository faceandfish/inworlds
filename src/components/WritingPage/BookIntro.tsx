import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface BookIntroProps {
  book: Pick<BookInfo, "title" | "description">;
  onBookChange: (
    updates: Partial<Pick<BookInfo, "title" | "description">>
  ) => void;
  error?: string;
  descriptionRows?: number;
  className?: string;
}

const BookIntro: React.FC<BookIntroProps> = ({
  book,
  onBookChange,
  error,
  descriptionRows = 14,
  className = ""
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBookChange({ title: e.target.value });
  };
  const { t } = useTranslation("book");

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onBookChange({ description: e.target.value });
  };

  return (
    <div className={`flex flex-col items-center gap-8 w-full ${className}`}>
      <div className="relative w-full">
        <label
          htmlFor="book-title"
          className="text-gray-400 absolute top-2 left-3 text-sm"
        >
          {t("bookIntro.titleLabel")}
        </label>
        <input
          type="text"
          id="book-title"
          name="title"
          value={book.title}
          onChange={handleTitleChange}
          className="w-full h-20 border rounded border-gray-400 py-6 px-3 pt-8 text-gray-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder={t("bookIntro.titlePlaceholder")}
          required
          maxLength={100}
        />
        <span className="text-sm text-gray-500 absolute right-3 bottom-2">
          {book.title.length}/100
        </span>
      </div>

      <div className="relative w-full">
        <label
          htmlFor="book-brief"
          className="text-gray-400 absolute top-2 left-3 text-sm"
        >
          {t("bookIntro.descriptionLabel")}
        </label>
        <textarea
          id="book-brief"
          name="description"
          value={book.description}
          onChange={handleDescriptionChange}
          rows={descriptionRows}
          className="w-full  border rounded border-neutral-400 py-8 px-3 text-neutral-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder={t("bookIntro.descriptionPlaceholder")}
          required
          maxLength={1000}
        />
        <span className="text-sm text-neutral-500 absolute right-3 bottom-2">
          {book.description.length}/1000
        </span>
      </div>
    </div>
  );
};

export default BookIntro;

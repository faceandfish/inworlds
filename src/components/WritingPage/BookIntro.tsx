import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { useWordCount } from "./useWordCount";

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
  descriptionRows = 14,
  className = ""
}) => {
  const { t } = useTranslation("book");

  // 标题字数限制
  const TITLE_MAX_LENGTH = 100;
  // 描述字数限制
  const DESCRIPTION_MAX_LENGTH = 1000;
  const CHAR_LIMIT_BUFFER = 3000;

  const {
    text: title,
    wordCount: titleCount,
    handleTextChange: handleTitleChange,
    isMaxLength: isTitleMaxLength
  } = useWordCount(book?.title || "", TITLE_MAX_LENGTH);

  const {
    text: description,
    wordCount: descriptionCount,
    handleTextChange: handleDescriptionChange,
    isMaxLength: isDescriptionMaxLength
  } = useWordCount(book?.description || "", DESCRIPTION_MAX_LENGTH);

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleChange(e.target.value);
    onBookChange({ title: e.target.value });
  };

  const handleDescriptionInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleDescriptionChange(e.target.value);
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
          value={title}
          onChange={handleTitleInputChange}
          className={`w-full h-20 border rounded py-6 px-3 pt-8 text-gray-700 leading-tight focus:outline-none ${
            isTitleMaxLength
              ? "border-red-400"
              : "border-gray-400 focus:border-orange-400"
          }`}
          placeholder={t("bookIntro.titlePlaceholder")}
          required
          maxLength={CHAR_LIMIT_BUFFER}
        />
        <span
          className={`text-sm ${
            isTitleMaxLength ? "text-red-500" : "text-gray-500"
          } absolute right-3 bottom-2`}
        >
          {titleCount}/{TITLE_MAX_LENGTH}
        </span>
      </div>

      <div className="relative w-full">
        <label
          htmlFor="book-brief"
          className="text-gray-400 text-sm bg-white absolute -top-2.5 left-0 right-0 px-3 py-1 border-t border-l border-r border-neutral-400 rounded-t flex justify-between items-center"
        >
          <span>{t("bookIntro.descriptionLabel")}</span>
          <span
            className={`text-sm ${
              isDescriptionMaxLength ? "text-red-500" : "text-neutral-500"
            }`}
          >
            {descriptionCount}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </label>
        <textarea
          id="book-brief"
          name="description"
          value={description}
          onChange={handleDescriptionInputChange}
          rows={descriptionRows}
          className={`w-full border rounded-b border-t-0 rounded-r py-3 px-3 mt-4 text-neutral-700 leading-tight focus:outline-none ${
            isDescriptionMaxLength
              ? "border-red-400"
              : "border-neutral-400 focus:border-orange-400"
          }`}
          placeholder={t("bookIntro.descriptionPlaceholder")}
          required
          maxLength={CHAR_LIMIT_BUFFER}
        />
      </div>
    </div>
  );
};

export default BookIntro;

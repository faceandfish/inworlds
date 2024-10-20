import React from "react";
import { useTranslation } from "../useTranslation";
import { useWordCount } from "./useWordCount";

interface AuthorNoteProps {
  authorNote: string;
  onAuthorNoteChange: (note: string) => void;
  error?: string;
}

const AuthorNote: React.FC<AuthorNoteProps> = ({
  authorNote,
  onAuthorNoteChange,
  error
}) => {
  const maxLength = 1000;
  const { t } = useTranslation("book");
  const { text, wordCount, handleTextChange } = useWordCount(
    authorNote,
    maxLength
  );

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextChange(e.target.value);
    onAuthorNoteChange(e.target.value);
  };

  return (
    <div className="w-full ">
      <label
        htmlFor="authorNote"
        className="block text-2xl font-medium text-gray-700 mb-6"
      >
        {t("authorNote.title")}
      </label>
      <div className="relative">
        <textarea
          id="authorNote"
          name="authorNote"
          rows={8}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-500"
          placeholder={t("authorNote.placeholder")}
          value={text}
          onChange={handleNoteChange}
        ></textarea>
        <p className="absolute bottom-2 right-3 text-sm text-gray-500 mt-2">
          {wordCount}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default AuthorNote;

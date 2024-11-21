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
  const MAX_LENGTH = 1000;
  const CHAR_LIMIT_BUFFER = 3000;
  const { t } = useTranslation("book");

  const { text, wordCount, handleTextChange, isMaxLength } = useWordCount(
    authorNote,
    MAX_LENGTH
  );

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextChange(e.target.value);
    onAuthorNoteChange(e.target.value);
  };

  return (
    <div className="w-full">
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
          className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
            isMaxLength
              ? "border-red-400"
              : "border-gray-300 focus:border-orange-500"
          }`}
          placeholder={t("authorNote.placeholder")}
          value={text}
          onChange={handleNoteChange}
          maxLength={CHAR_LIMIT_BUFFER}
        />
        <p
          className={`absolute bottom-2 right-3 text-sm ${
            isMaxLength ? "text-red-500" : "text-gray-500"
          } mt-2`}
        >
          {wordCount}/{MAX_LENGTH}
        </p>
      </div>
    </div>
  );
};

export default AuthorNote;

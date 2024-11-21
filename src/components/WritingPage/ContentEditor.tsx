"use client";
import React from "react";
import { ChapterInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { useWordCount } from "./useWordCount";

interface ContentEditorProps {
  chapter: ChapterInfo;
  onContentChange: (updatedFields: Partial<ChapterInfo>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  chapter,
  onContentChange
}) => {
  const { t } = useTranslation("book");

  // 定义最大长度常量
  const CONTENT_MAX_LENGTH = 20000;
  const TITLE_MAX_LENGTH = 100;
  const CHAR_LIMIT_BUFFER = 30000;

  const {
    text: content,
    wordCount: contentCount,
    handleTextChange: handleContentChange,
    isMaxLength: isContentMaxLength
  } = useWordCount(chapter.content || "", CONTENT_MAX_LENGTH);

  const {
    text: title,
    wordCount: titleCount,
    handleTextChange: handleTitleChange,
    isMaxLength: isTitleMaxLength
  } = useWordCount(chapter.title || "", TITLE_MAX_LENGTH);

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleChange(e.target.value);
    onContentChange({ title: e.target.value });
  };

  const handleContentInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleContentChange(e.target.value);
    onContentChange({
      content: e.target.value,
      wordCount: contentCount
    });
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-medium text-neutral-700 mb-6">
        {chapter.chapterNumber
          ? t("chapterNumber", { number: chapter.chapterNumber })
          : t("contentEditor.firstChapter")}
      </h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="chapter-title"
            className="text-sm font-medium text-neutral-600"
          >
            {t("contentEditor.chapterTitle")}
          </label>
          <span
            className={`text-sm ${
              isTitleMaxLength ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {titleCount}/{TITLE_MAX_LENGTH}
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            id="chapter-title"
            value={title}
            onChange={handleTitleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
              isTitleMaxLength
                ? "border-red-400"
                : "border-gray-300 focus:border-orange-400"
            }`}
            placeholder={t("contentEditor.titlePlaceholder")}
            maxLength={CHAR_LIMIT_BUFFER}
          />
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-600">
            {t("contentEditor.chapterContent")}
          </span>
          <span
            className={`text-sm ${
              isContentMaxLength ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {contentCount}/{CONTENT_MAX_LENGTH}
          </span>
        </div>
        <textarea
          value={content}
          onChange={handleContentInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none h-80 ${
            isContentMaxLength
              ? "border-red-400"
              : "border-gray-300 focus:border-orange-400"
          }`}
          placeholder={t("contentEditor.contentPlaceholder")}
          maxLength={CHAR_LIMIT_BUFFER}
        />
      </div>
    </div>
  );
};

export default ContentEditor;

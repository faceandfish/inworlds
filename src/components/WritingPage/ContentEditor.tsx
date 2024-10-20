"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  const {
    text: content,
    wordCount,
    handleTextChange: handleContentChange,
    language
  } = useWordCount(chapter.content || "", 20000); // 假设最大字数为 10000
  const { text: title, handleTextChange: handleTitleChange } = useWordCount(
    chapter.title || "",
    100
  );

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleChange(e.target.value);
    onContentChange({ title: e.target.value });
  };

  const handleContentInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleContentChange(e.target.value);
    onContentChange({ content: e.target.value, wordCount });
  };

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-medium text-neutral-700 mb-6">
        {chapter.chapterNumber
          ? `${t("contentEditor.chapter")} ${chapter.chapterNumber}`
          : t("contentEditor.firstChapter")}
      </h1>

      <div className="mb-6">
        <label
          htmlFor="chapter-title"
          className="block text-sm font-medium  text-neutral-600 mb-2"
        >
          {t("contentEditor.chapterTitle")}
        </label>
        <input
          type="text"
          id="chapter-title"
          value={title}
          onChange={handleTitleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-400  "
          placeholder={t("contentEditor.titlePlaceholder")}
        />
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-600">
            {t("contentEditor.chapterContent")}
          </span>
          <span className="text-sm text-neutral-400">{wordCount}/20000</span>
        </div>
        <textarea
          value={content}
          onChange={handleContentInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-orange-400 h-80"
          placeholder={t("contentEditor.contentPlaceholder")}
        />
      </div>
    </div>
  );
};

export default ContentEditor;

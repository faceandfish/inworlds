"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChapterInfo } from "@/app/lib/definitions";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useTranslation } from "../useTranslation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ContentEditorProps {
  chapter: ChapterInfo;
  onContentChange: (updatedFields: Partial<ChapterInfo>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  chapter,
  onContentChange
}) => {
  const [content, setContent] = useState(chapter.content || "");
  const [title, setTitle] = useState(chapter.title || "");
  const [wordCount, setWordCount] = useState(0);
  const { t } = useTranslation("book");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        ["link", "image"],
        ["clean"]
      ]
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      onContentChange({ title: newTitle });
    },
    [onContentChange]
  );

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onContentChange({ content: newContent });
    },
    [onContentChange]
  );

  const getWordCount = useCallback((text: string): number => {
    const strippedText = text.replace(/<[^>]*>/g, "").trim();
    return strippedText ? strippedText.split(/\s+/).length : 0;
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setWordCount(getWordCount(content));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [content, getWordCount]);

  useEffect(() => {
    setContent(chapter.content || "");
    setTitle(chapter.title || "");
  }, [chapter]);

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
          className="block text-sm font-medium text-neutral-600 mb-2"
        >
          {t("contentEditor.chapterTitle")}
        </label>
        <input
          type="text"
          id="chapter-title"
          value={title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder={t("contentEditor.titlePlaceholder")}
        />
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-600">
            {t("contentEditor.chapterContent")}
          </span>
          <span className="text-sm text-neutral-400">
            {t("contentEditor.wordCount")} {wordCount}
          </span>
        </div>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="h-80"
        />
      </div>
    </div>
  );
};

export default ContentEditor;

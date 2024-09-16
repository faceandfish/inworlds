"use client";
import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import { ChapterInfo } from "@/app/lib/definitions";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

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
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  const modules = {
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
  };

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onContentChange({ title: newTitle });
  };

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      onContentChange({ content: newContent });
    },
    [onContentChange]
  );

  const getWordCount = useCallback((text: string): number => {
    const strippedText = text.replace(/<[^>]*>/g, "");
    return strippedText.trim().split(/\s+/).length;
  }, []);

  useEffect(() => {
    setWordCount(getWordCount(content));
  }, [content, getWordCount]);

  useEffect(() => {
    setContent(chapter.content || "");
    setTitle(chapter.title || "");
  }, [chapter]);

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-medium text-neutral-700 mb-6">
        {chapter.chapterNumber ? `第 ${chapter.chapterNumber} 章` : "新章节"}
      </h1>

      <div className="mb-6">
        <label
          htmlFor="chapter-title"
          className="block text-sm font-medium text-neutral-600 mb-2"
        >
          章节标题
        </label>
        <input
          type="text"
          id="chapter-title"
          value={title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="输入章节标题"
        />
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-600">章节内容</span>
          <span className="text-sm text-neutral-400">字数：{wordCount}</span>
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

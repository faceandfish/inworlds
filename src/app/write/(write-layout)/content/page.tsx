"use client";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./customQuill.module.css";

const ContentEditor: React.FC = () => {
  const [chapterTitle, setChapterTitle] = useState("");
  const [content, setContent] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
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
    "image",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">小说内容编辑</h1>

      <div className="mb-6">
        <label
          htmlFor="chapter-title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          章节目录
        </label>
        <input
          type="text"
          id="chapter-title"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="输入章节标题"
        />
      </div>

      <div className="mb-10  ">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          详细内容
        </label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className={`${styles["custom-quill-editor"]} h-96 mb-10`}
        />
      </div>
    </div>
  );
};

export default ContentEditor;

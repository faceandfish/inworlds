"use client";

import { BookInfo } from "@/app/lib/definitions";
import React, { useState, ChangeEvent, FormEvent } from "react";

const initialBookInfo: BookInfo = {
  title: "",
  description: "",
  category: "female-story",
  ageRating: "allAges",
  coverImage: null,
};

const BookIntro: React.FC = () => {
  const [bookInfo, setBookInfo] = useState<BookInfo>(initialBookInfo);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted book info:", bookInfo);
    // Here you would typically send the data to your backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto"
    >
      {/* Title input */}
      <div className="relative w-full">
        <label
          htmlFor="book-title"
          className="text-gray-400 absolute top-2 left-3 text-sm"
        >
          標題（必填）
        </label>
        <input
          type="text"
          id="book-title"
          name="title"
          value={bookInfo.title}
          onChange={handleInputChange}
          className="w-full h-20 border rounded border-gray-400 py-6 px-3 pt-8 text-gray-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder="輸入書名"
          required
        />
      </div>

      {/* Description textarea */}
      <div className="relative w-full">
        <label
          htmlFor="book-brief"
          className="text-gray-400 absolute top-2 left-3 text-sm"
        >
          詳情描述（必填）
        </label>
        <textarea
          id="book-brief"
          name="description"
          value={bookInfo.description}
          onChange={handleInputChange}
          className="w-full h-80 border rounded border-gray-400 py-8 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder="輸入詳情內容..."
          required
        />
      </div>
    </form>
  );
};

export default BookIntro;

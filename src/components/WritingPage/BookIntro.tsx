import React from "react";
import { BookInfo } from "@/app/lib/definitions";

interface BookIntroProps {
  book: Pick<BookInfo, "title" | "description">;
  onBookChange: (
    updates: Partial<Pick<BookInfo, "title" | "description">>
  ) => void;
  error?: string;
}

const BookIntro: React.FC<BookIntroProps> = ({ book, onBookChange, error }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBookChange({ title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onBookChange({ description: e.target.value });
  };

  return (
    <div className="flex flex-col h-screen py-10 items-center gap-8 w-full ">
      <div className="relative w-full">
        <label
          htmlFor="book-title"
          className="text-gray-400 absolute top-2 left-3 text-sm"
        >
          标题（必填）
        </label>
        <input
          type="text"
          id="book-title"
          name="title"
          value={book.title}
          onChange={handleTitleChange}
          className="w-full h-20 border rounded border-gray-400 py-6 px-3 pt-8 text-gray-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder="输入书名"
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
          详情描述（必填）
        </label>
        <textarea
          id="book-brief"
          name="description"
          value={book.description}
          onChange={handleDescriptionChange}
          rows={16}
          className="w-full  border rounded border-gray-400 py-8 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-400"
          placeholder="输入详情内容..."
          required
          maxLength={1000}
        />
        <span className="text-sm text-gray-500 absolute right-3 bottom-2">
          {book.description.length}/1000
        </span>
      </div>
    </div>
  );
};

export default BookIntro;

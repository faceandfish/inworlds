import React, { useState } from "react";
import Link from "next/link";
import { BookInfo, ChapterInfo } from "@/app/lib/definitions";

interface ChapterListProps {
  chapters: ChapterInfo[];
  book: BookInfo;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, book }) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedChapters = [...chapters].sort((a, b) => {
    const dateA = a.lastModified
      ? new Date(a.lastModified).getTime()
      : a.createdAt
      ? new Date(a.createdAt).getTime()
      : 0;
    const dateB = b.lastModified
      ? new Date(b.lastModified).getTime()
      : b.createdAt
      ? new Date(b.createdAt).getTime()
      : 0;
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  return (
    <>
      <div className="flex  items-center gap-10">
        <h2 className="text-2xl font-bold text-neutral-600">章节列表</h2>
        <span
          className={`px-2 py-1 rounded text-sm mr-4 ${
            book.status === "ongoing"
              ? "bg-orange-400 text-white"
              : "bg-green-200 text-green-800"
          }`}
        >
          {book.status === "ongoing" ? "连载中" : "已完结"}
        </span>
        <select
          className="border rounded p-2 outline-none hover:border-orange-400"
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          value={sortOrder}
        >
          <option value="asc">最早时间排序</option>
          <option value="desc">最晚时间排序</option>
        </select>
      </div>
      <ul className=" mt-5  h-[640px]">
        {sortedChapters.map((chapter) => (
          <li key={chapter.id} className="flex items-center border-b  h-16 ">
            <Link
              href={`/writing/${book.id}/chapter/${chapter.id}`}
              className="text-lg text-neutral-600 pl-5 flex-grow font-medium hover:text-orange-500 "
            >
              第{chapter.chapterNumber}章：{chapter.title}
            </Link>
            <p className="text-neutral-500 text-sm pr-20">
              字数：{chapter.wordCount} | 最后修改：
              {new Date(chapter.lastModified!).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ChapterList;

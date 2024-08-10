"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChapterInfo, BookInfo } from "@/app/lib/definitions";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ChapterContentPageProps {
  chapter: ChapterInfo;
  book: BookInfo;
}

const ChapterContent: React.FC<ChapterContentPageProps> = ({
  chapter,
  book
}) => {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-neutral-200 flex flex-col">
        <div className="flex-grow flex flex-col items-center bg-neutral-50 justify-between  mx-auto w-4/5 ">
          <div className="w-full px-20  ">
            <div className="flex gap-2 py-8 border-b text-neutral-500 items-center">
              <Link href="/">
                <p className="cursor-pointer hover:text-orange-400">首页</p>
              </Link>

              <ChevronRightIcon className="w-4 h-4 " />
              <Link href={`/${book.id}`}>
                <p className="cursor-pointer hover:text-orange-400">
                  {book.title}
                </p>
              </Link>
            </div>
            <h2 className="text-2xl text-neutral-800 font-medium pt-8 mb-3 ">
              {chapter.chapterNumber} {chapter.title}
            </h2>
            <div className="flex items-center mb-8 space-x-5 text-sm text-neutral-500 ">
              <div className="flex items-center">
                <BookOpenIcon className="w-4 h-4 mr-1" />
                <span>{book.title}</span>
              </div>
              <div className="flex items-center">
                <UserCircleIcon className="w-4 h-4 mr-1" />
                <span>{book.authorName}</span>
              </div>
              <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-1" />
                <span>{chapter.wordCount} 字</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>{chapter.createdAt}</span>
              </div>
            </div>
            <div className="w-full  text-neutral-800 text-lg leading-10">
              {chapter.content}
            </div>
            {/* 打赏 */}
            <div className="flex justify-center py-24">
              <button className="bg-red-500 hover:bg-red-600 text-white text-xl px-14 py-5 rounded-full  transition duration-300">
                赞赏
              </button>
            </div>
            {/* footer */}
            <div className="space-x-10  pb-28 pt-10 flex justify-center">
              <button className="bg-neutral-200 hover:bg-neutral-300 text-neutral-600 px-20 py-2 rounded-full transition duration-300">
                上一章
              </button>

              <button className="bg-orange-400 hover:bg-orange-500 text-white px-20 py-2 rounded-full transition duration-300">
                下一章
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterContent;

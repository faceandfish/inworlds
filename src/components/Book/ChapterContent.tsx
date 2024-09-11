"use client";
import React, { useEffect, useRef, useState } from "react";

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
import { useRouter } from "next/navigation";
import { ChapterList } from "./ChapterList";
import { getChapterList } from "@/app/lib/action";
import Pagination from "../Pagination";

interface ChapterContentPageProps {
  chapter: ChapterInfo;
  book: BookInfo;
}

const ChapterContent: React.FC<ChapterContentPageProps> = ({
  chapter,
  book
}) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = chapter.content;
    }
  }, [chapter.content]);

  useEffect(() => {
    fetchChapters(currentPage);
  }, [currentPage, book.id]);

  const fetchChapters = async (page: number) => {
    try {
      const response = await getChapterList(book.id, page, itemsPerPage);
      setChapters(response.data.dataList);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLastChapter = chapter.chapterNumber === book.latestChapterNumber;
  const isFirstChapter = chapter.chapterNumber === 1;

  // 处理导航到上一章
  const handlePreviousChapter = () => {
    if (!isFirstChapter) {
      router.push(`/book/${book.id}/chapter/${chapter.chapterNumber! - 1}`);
    }
  };

  // 处理导航到下一章
  const handleNextChapter = () => {
    if (!isLastChapter) {
      router.push(`/book/${book.id}/chapter/${chapter.chapterNumber! + 1}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              <Link href={`/book/${book.id}`}>
                <p className="cursor-pointer hover:text-orange-400">
                  {book.title}
                </p>
              </Link>
              <ChevronRightIcon className="w-4 h-4 " />
              <div className="relative">
                <p
                  className="cursor-pointer hover:text-orange-400"
                  onClick={toggleMenu}
                >
                  目录
                </p>
                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black bg-opacity-30 z-40"
                      onClick={toggleMenu}
                    ></div>
                    <div
                      className="absolute left-0 w-80 rounded-md bg-opacity-100 shadow-lg bg-white
                  z-50"
                    >
                      {/* 这里可以根据实际需求添加目录项 */}
                      <p className="text-xl text-neutral-600 bg-neutral-100 py-3 mx-5 text-center my-5">
                        章节目录
                      </p>
                      <ChapterList
                        chapters={chapters}
                        book={book}
                        className="flex-col mx-5 flex  h-96"
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
              </div>
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
            <div
              ref={contentRef}
              className="w-full  text-neutral-800 text-lg leading-10"
            />
            {/* 作者的话 */}
            <div>{chapter.authorNote}</div>
            {/* 打赏 */}
            <div className="flex justify-center py-24">
              <button className="bg-red-500 hover:bg-red-600 text-white text-xl px-14 py-5 rounded-full  transition duration-300">
                赞赏
              </button>
            </div>
            {/* footer */}
            <div className="space-x-10  pb-28 pt-10 flex justify-center">
              {/* 上一章按钮 */}
              {isFirstChapter ? (
                <button
                  className="bg-neutral-400 text-white px-20 py-2 rounded-full cursor-not-allowed"
                  disabled
                >
                  第一章
                </button>
              ) : (
                <button
                  onClick={handlePreviousChapter}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-600 px-20 py-2 rounded-full transition duration-300"
                >
                  上一章
                </button>
              )}

              {/* 下一章按钮 */}
              {isLastChapter ? (
                <button
                  className="bg-neutral-400 text-white px-20 py-2 rounded-full cursor-not-allowed"
                  disabled
                >
                  最后一章
                </button>
              ) : (
                <button
                  onClick={handleNextChapter}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-20 py-2 rounded-full transition duration-300"
                >
                  下一章
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterContent;

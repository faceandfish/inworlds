"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import { ChapterInfo, BookInfo } from "@/app/lib/definitions";
import {
  ChevronRightIcon,
  BookOpenIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChapterList } from "./ChapterList";
import { getPublicChapterList } from "@/app/lib/action";
import Pagination from "../Main/Pagination";
import { useTranslation } from "../useTranslation";
import TipButton from "../Main/TipButton";
import ChapterNavigation from "./NavigationButton";
import PaidChapterContent from "./PaidChapterContent";
import { useChapterReading } from "./useChapterReading";
import { usePurchasedChapters } from "../PurchasedChaptersProvider.tsx";
import { useUser } from "../UserContextProvider";
import { logger } from "../Main/logger";

interface ChapterContentPageProps {
  chapter: ChapterInfo;
  book: BookInfo;
}

const ChapterContent: React.FC<ChapterContentPageProps> = ({
  chapter,
  book
}) => {
  const router = useRouter();
  const { user } = useUser();
  const {
    isChapterPurchased,
    fetchPurchasedChapters,
    loading: purchaseLoading,
    error: purchaseError
  } = usePurchasedChapters();

  const contentRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const { t } = useTranslation("book");
  const menuRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!purchaseLoading && isInitialMount.current && user) {
        try {
          await fetchPurchasedChapters(book.id);
          setIsPurchased(isChapterPurchased(book.id, chapter.id));
        } catch (error) {
          logger.error("checking purchase status", error, {
            context: "fetchPurchasedChapters"
          });
        } finally {
          isInitialMount.current = false;
        }
      }
    };

    checkPurchaseStatus();
  }, [
    book.id,
    chapter.id,
    fetchPurchasedChapters,
    isChapterPurchased,
    purchaseLoading,
    user
  ]);
  const fetchChapters = useCallback(
    async (page: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await getPublicChapterList(
          book.id,
          page,
          itemsPerPage
        );
        if ("data" in response && response.code === 200) {
          setChapters(response.data.dataList);
          setTotalPages(response.data.totalPage);
        } else {
          throw new Error(response.msg || t("errors.fetchChaptersFailed"));
        }
      } catch (err) {
        setChapters([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [book.id]
  ); // 只依赖必要的参数

  // 只在组件挂载时获取第一页数据
  useEffect(() => {
    fetchChapters(1);
  }, []);

  // 分页变化时再次请求
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchChapters(page);
  };
  // 格式化内容的函数
  const formatContent = useMemo(
    () => (content: string) => {
      if (!content) return null;

      // 将 \\ 替换为 \n 进行标准化处理
      const normalizedContent = content.replace(/\\\s*/g, "\n");

      // 分割文本并渲染
      return normalizedContent.split("\n").map((line, index) => (
        <p key={index} className="mb-1 last:mb-0">
          {line.trim() || <br />}
        </p>
      ));
    },
    []
  );

  const isLastChapter = chapter.chapterNumber === book.latestChapterNumber;
  const isFirstChapter = chapter.chapterNumber === 1;

  const handlePreviousChapter = useCallback(() => {
    if (!isFirstChapter) {
      router.push(`/book/${book.id}/chapter/${chapter.chapterNumber! - 1}`);
    }
  }, [book.id, chapter.chapterNumber, isFirstChapter, router]);

  const handleNextChapter = useCallback(() => {
    if (!isLastChapter) {
      router.push(`/book/${book.id}/chapter/${chapter.chapterNumber! + 1}`);
    }
  }, [book.id, chapter.chapterNumber, isLastChapter, router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useChapterReading({
    chapter,
    book,
    contentRef
  });

  return (
    <div className="min-h-screen bg-neutral-200 flex flex-col relative md:static md:top-auto">
      <div className="flex-grow flex flex-col items-center bg-neutral-50 justify-between mx-auto w-full md:w-4/5">
        <div className="w-full flex-grow px-4 md:px-20">
          {/* 导航面包屑 */}
          <div className="flex w-full flex-wrap gap-2 py-4 md:py-8 border-b text-neutral-500 items-center text-sm md:text-base">
            <Link href="/" className="cursor-pointer hover:text-orange-400">
              {t("home")}
            </Link>
            <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
            <Link
              href={`/book/${book.id}`}
              className="cursor-pointer hover:text-orange-400 truncate max-w-[150px] md:max-w-none"
            >
              {book.title}
            </Link>
            <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
            <div className="relative" ref={menuRef}>
              <p
                className="cursor-pointer hover:text-orange-400"
                onClick={toggleMenu}
              >
                {t("chapters")}
              </p>
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="fixed md:absolute left-0 right-0 md:left-auto md:right-auto top-[60px] md:top-full w-full md:w-80 h-[calc(100vh-60px)] md:h-auto bg-white z-50 overflow-y-auto rounded-t-lg md:rounded-lg shadow-lg">
                    <p className="text-lg md:text-xl text-neutral-600 bg-neutral-100 py-2 md:py-3 mx-3 md:mx-5 text-center my-3 md:my-5">
                      {t("chapters")}
                    </p>
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    ) : (
                      <>
                        <ChapterList
                          chapters={chapters}
                          book={book}
                          className="flex-col px-3 md:px-5 flex h-96"
                        />
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <h2 className="text-xl md:text-2xl h-full text-neutral-800 font-medium pt-4 md:pt-8 mb-2 md:mb-3">
            {chapter.chapterNumber} {chapter.title}
          </h2>
          <div className="hidden md:flex flex-wrap items-center mb-4 md:mb-8 space-x-3 md:space-x-5 text-xs md:text-sm text-neutral-500">
            <div className="flex items-center">
              <BookOpenIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="truncate max-w-[100px] md:max-w-none">
                {book.title}
              </span>
            </div>
            <div className="flex items-center">
              <UserCircleIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="truncate max-w-[100px] md:max-w-none">
                {book.authorName}
              </span>
            </div>
            <div className="flex items-center">
              <DocumentTextIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="truncate max-w-[100px] md:max-w-none">
                {chapter.wordCount}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="truncate max-w-[100px] md:max-w-none">
                {chapter.createdAt}
              </span>
            </div>
          </div>

          {/* 章节内容 */}
          <PaidChapterContent
            chapter={chapter}
            book={book}
            isPurchased={isPurchased}
            onPurchaseSuccess={() => setIsPurchased(true)}
          >
            <div
              ref={contentRef}
              className="w-full h-full text-neutral-800 text-lg leading-8"
            >
              {formatContent(chapter.content)}
            </div>
            {chapter.authorNote && (
              <div className="w-full px-6 md:px-20 text-neutral-500 pt-10 border-t mt-10">
                <p>{t("authorNoteTitle")}</p>
                <div className="bg-orange-50 min-h-32 rounded-md p-5 text-neutral-500 border">
                  {chapter.authorNote}
                </div>
              </div>
            )}
            <div className="flex justify-center py-6 md:py-24">
              <TipButton
                bookId={book.id}
                chapterId={chapter.id}
                className="bg-red-500 hover:bg-red-600 text-white md:text-xl text-md px-14 md:py-5 py-2 rounded-full transition duration-300"
              />
            </div>
          </PaidChapterContent>

          {/* 章节导航 */}
          <ChapterNavigation
            isFirstChapter={isFirstChapter}
            isLastChapter={isLastChapter}
            handlePreviousChapter={handlePreviousChapter}
            handleNextChapter={handleNextChapter}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterContent;

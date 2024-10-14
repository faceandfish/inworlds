"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChapterInfo,
  BookInfo,
  PurchasedChapterInfo
} from "@/app/lib/definitions";
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
import {
  getBookPurchasedChapters,
  getChapterList,
  payForChapter
} from "@/app/lib/action";
import Pagination from "../Main/Pagination";
import Alert from "../Main/Alert";
import { useTranslation } from "../useTranslation";
import TipButton from "../Main/TipButton";
import { useUser } from "../UserContextProvider";
import { usePurchasedChapters } from "../PurchasedChaptersProvider.tsx";

interface ChapterContentPageProps {
  chapter: ChapterInfo;
  book: BookInfo;
}

const ChapterContent: React.FC<ChapterContentPageProps> = ({
  chapter,
  book
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { isChapterPurchased, fetchPurchasedChapters, addPurchasedChapter } =
    usePurchasedChapters();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showInsufficientBalanceAlert, setShowInsufficientBalanceAlert] =
    useState(false);
  const [showBuyCoinsButton, setShowBuyCoinsButton] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasedChapters, setPurchasedChapters] = useState<
    PurchasedChapterInfo[]
  >([]);
  const itemsPerPage = 10;
  const { t } = useTranslation("book");

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      await fetchPurchasedChapters(book.id);
      setIsPurchased(isChapterPurchased(book.id, chapter.id));
    };
    checkPurchaseStatus();
  }, [book.id, chapter.id, fetchPurchasedChapters, isChapterPurchased]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = chapter.content;
    }
  }, [chapter.content, isPurchased]);

  useEffect(() => {
    fetchChapters(currentPage);
  }, [currentPage, book.id]);

  const handleBuyCoins = () => {
    if (user && user.id) {
      router.push(`/user/${user.id}/wallet`);
    } else {
      setShowLoginAlert(true);
      setShowInsufficientBalanceAlert(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
    setShowLoginAlert(false);
  };

  const handleChapterPayment = async () => {
    try {
      const response = await payForChapter(book.id, chapter.id);

      switch (response.code) {
        case 200:
        case 601:
          setAlertMessage(
            response.code === 200 ? t("purchaseSuccess") : t("alreadyPurchased")
          );
          addPurchasedChapter(book.id, chapter.id);
          setIsPurchased(true);
          setShowPaymentAlert(true);
          break;
        case 602:
          setShowInsufficientBalanceAlert(true);
          break;
        default:
          throw new Error(response.msg || "Failed to pay for chapter");
      }
    } catch (error) {
      console.error("Error paying for chapter:", error);
      setAlertMessage(t("purchaseError"));
      setShowPaymentAlert(true);
      setShowBuyCoinsButton(false);
    }
  };

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

  const handlePreviousChapter = () => {
    if (!isFirstChapter) {
      router.push(`/book/${book.id}/chapter/${chapter.chapterNumber! - 1}`);
    }
  };

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
      <div className="min-h-screen bg-neutral-200 flex flex-col relative -top-16 md:static md:top-auto">
        <div className="flex-grow flex flex-col items-center  bg-neutral-50 justify-between mx-auto w-full md:w-4/5">
          <div className="w-full  flex-grow px-4 md:px-20">
            <div className="flex w-full flex-wrap gap-2 py-4 md:py-8 border-b text-neutral-500 items-center text-sm md:text-base">
              <Link href="/">
                <p className="cursor-pointer hover:text-orange-400">
                  {t("home")}
                </p>
              </Link>
              <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
              <Link href={`/book/${book.id}`}>
                <p className="cursor-pointer hover:text-orange-400 truncate max-w-[150px] md:max-w-none">
                  {book.title}
                </p>
              </Link>
              <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
              <div className="relative">
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
                      onClick={toggleMenu}
                    ></div>
                    <div className="fixed md:absolute left-0 right-0 md:left-auto md:right-auto top-[60px] md:top-full w-full md:w-80 h-[calc(100vh-60px)] md:h-auto bg-white z-50 overflow-y-auto rounded-t-lg md:rounded-lg shadow-lg">
                      <p className="text-lg md:text-xl text-neutral-600 bg-neutral-100 py-2 md:py-3 mx-3 md:mx-5 text-center my-3 md:my-5">
                        {t("chapters")}
                      </p>
                      <ChapterList
                        chapters={chapters}
                        book={book}
                        className="flex-col px-3 md:px-5  flex h-96 "
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
            <h2 className="text-xl md:text-2xl h-full text-neutral-800 font-medium pt-4 md:pt-8 mb-2 md:mb-3">
              {chapter.chapterNumber} {chapter.title}
            </h2>
            <div className="hidden md:flex  flex-wrap items-center mb-4 md:mb-8 space-x-3 md:space-x-5 text-xs md:text-sm text-neutral-500">
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
                  {chapter.wordCount} 字
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="truncate max-w-[100px] md:max-w-none">
                  {chapter.createdAt}
                </span>
              </div>
            </div>
            {chapter.isPaid && !isPurchased ? (
              <div className="w-full text-center border bg-orange-100 shadow-md py-10">
                <p className="text-lg text-neutral-600 mb-4">
                  {t("paidChapter", { price: chapter.price })}
                </p>
                <button
                  onClick={handleChapterPayment}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full transition duration-300"
                >
                  {t("payAndRead")}
                </button>
              </div>
            ) : (
              <>
                <div
                  ref={contentRef}
                  className="w-full h-full text-neutral-800 text-lg leading-10"
                />
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
                    authorId={book.authorId}
                    bookId={book.id}
                    chapterId={chapter.id}
                    className="bg-red-500 hover:bg-red-600 text-white md:text-xl text-md px-14 md:py-5 py-2 rounded-full transition duration-300"
                  />
                </div>
              </>
            )}

            <div className="space-x-4 md:space-x-10 pb-16 md:pb-28 pt-6 md:pt-10 flex justify-center">
              {isFirstChapter ? (
                <button
                  className="bg-neutral-400 text-white px-8 md:px-20 py-2 rounded-full cursor-not-allowed text-sm md:text-base"
                  disabled
                >
                  {t("firstChapter")}
                </button>
              ) : (
                <button
                  onClick={handlePreviousChapter}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-600 px-8 md:px-20 py-2 rounded-full transition duration-300 text-sm md:text-base"
                >
                  {t("previousChapter")}
                </button>
              )}
              {isLastChapter ? (
                <button
                  className="bg-neutral-400 text-white px-8 md:px-20 py-2 rounded-full cursor-not-allowed text-sm md:text-base"
                  disabled
                >
                  {t("lastChapter")}
                </button>
              ) : (
                <button
                  onClick={handleNextChapter}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-8 md:px-20 py-2 rounded-full transition duration-300 text-sm md:text-base"
                >
                  {t("nextChapter")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPaymentAlert && (
        <Alert
          message={alertMessage}
          type={
            alertMessage === t("purchaseSuccess") ||
            alertMessage === t("alreadyPurchased")
              ? "success"
              : "error"
          }
          onClose={() => setShowPaymentAlert(false)}
          autoClose={true}
        />
      )}

      {showInsufficientBalanceAlert && (
        <Alert
          message={t("insufficientBalance")}
          type="error"
          onClose={() => setShowInsufficientBalanceAlert(false)}
          customButton={{
            text: t("buyCoins"),
            onClick: handleBuyCoins
          }}
          autoClose={false}
        />
      )}

      {showLoginAlert && (
        <Alert
          message={t("loginRequired")}
          type="error"
          onClose={() => setShowLoginAlert(false)}
          customButton={{
            text: t("goToLogin"),
            onClick: handleLogin
          }}
          autoClose={false}
        />
      )}
    </>
  );
};

export default ChapterContent;

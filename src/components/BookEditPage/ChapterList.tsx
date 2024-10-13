"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import {
  CalendarIcon,
  XMarkIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import Alert from "../Alert";
import AuthorNote from "../WritingPage/AuthorNote";
import { useTranslation } from "../useTranslation";

interface ChapterListProps {
  chapters: ChapterInfo[];
  book: BookInfo;
  onUpdateChapter: (
    chapterId: number,
    updates: Partial<ChapterInfo>
  ) => Promise<boolean>;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters: initialChapters,
  book,
  onUpdateChapter
}) => {
  const { t } = useTranslation("bookedit");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [chapters, setChapters] = useState(initialChapters);
  const [selectedChapter, setSelectedChapter] = useState<ChapterInfo | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<
    "draft" | "published" | "scheduled"
  >("draft");
  const [newDate, setNewDate] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthorNoteDialogOpen, setIsAuthorNoteDialogOpen] = useState(false);
  const [currentAuthorNote, setCurrentAuthorNote] = useState<string>("");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [minDateTime, setMinDateTime] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  // 新增: 收费设置相关的状态
  const [isPricingMenuOpen, setIsPricingMenuOpen] = useState(false);
  const [selectedChapterForPricing, setSelectedChapterForPricing] =
    useState<ChapterInfo | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1, 0, 0);
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChapters((prevChapters) => {
        const updatedChapters = prevChapters.map((chapter) => {
          if (
            chapter.publishStatus === "scheduled" &&
            new Date(chapter.publishDate!) <= new Date()
          ) {
            // 如果预定发布时间已到，更新状态
            onUpdateChapter(chapter.id!, { publishStatus: "published" });
            return { ...chapter, publishStatus: "published" as const };
          }
          return chapter;
        });

        // 新增：检查是否有任何更改
        const hasChanges = updatedChapters.some(
          (chapter, index) =>
            chapter.publishStatus !== prevChapters[index].publishStatus
        );

        // 新增：如果有更改，强制重新渲染
        if (hasChanges) {
          setForceUpdate((prev) => !prev);
        }

        return updatedChapters;
      });
    }, 60000); // 每分钟检查一次
    return () => clearInterval(intervalId);
  }, [onUpdateChapter]);

  const getChapterStatus = useCallback((chapter: ChapterInfo) => {
    if (
      chapter.publishStatus === "scheduled" &&
      new Date(chapter.publishDate!) <= new Date()
    ) {
      return "published";
    }
    return chapter.publishStatus;
  }, []);

  const sortedChapters = [...chapters].sort((a, b) => {
    const aNumber = a.chapterNumber ?? 0;
    const bNumber = b.chapterNumber ?? 0;
    return sortOrder === "asc" ? aNumber - bNumber : bNumber - aNumber;
  });

  const handleStatusChange = (status: "draft" | "published" | "scheduled") => {
    setNewStatus(status);
    if (status !== "scheduled") {
      setNewDate("");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
      .replace(/\//g, "-")
      .replace(/,/g, "");
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString.replace(/-/g, "/"));
    return date
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
      .replace(/\//g, "-");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate > new Date()) {
      // 使用用户本地时间，格式化为 "YYYY-MM-DD HH:mm:ss"
      const formattedDate = selectedDate
        .toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
        .replace(/\//g, "-")
        .replace(",", "");
      setNewDate(formattedDate);
    } else {
      setAlert({ message: t("chapterList.selectFutureTime"), type: "error" });
    }
  };

  const handleConfirmUpdate = async () => {
    if (selectedChapter) {
      const updates: Partial<ChapterInfo> = { publishStatus: newStatus };
      if (newStatus === "scheduled" && newDate) {
        updates.publishDate = newDate; // newDate is already in the correct format with ":00" for seconds
      }
      const success = await onUpdateChapter(selectedChapter.id!, updates);
      if (success) {
        setChapters(
          chapters.map((ch) =>
            ch.id === selectedChapter.id ? { ...ch, ...updates } : ch
          )
        );
        setAlert({ message: "章节状态更新成功", type: "success" });
      } else {
        setAlert({ message: "章节状态更新失败", type: "error" });
      }
      setIsDialogOpen(false);
    }
  };

  const openDialog = (chapter: ChapterInfo) => {
    setSelectedChapter(chapter);
    setNewStatus(chapter.publishStatus as "draft" | "published" | "scheduled");
    setNewDate(chapter.publishDate ? chapter.publishDate : "");
    setIsDialogOpen(true);
  };

  const openAuthorNoteDialog = (chapter: ChapterInfo) => {
    setSelectedChapter(chapter);
    setCurrentAuthorNote(chapter.authorNote || "");
    setIsAuthorNoteDialogOpen(true);
  };

  // 新增: 打开收费设置菜单的函数
  const openPricingMenu = (chapter: ChapterInfo) => {
    setSelectedChapterForPricing(chapter);
    setIsPaid(chapter.isPaid);
    setPrice(chapter.price);
    setIsPricingMenuOpen(true);
  };

  // 新增: 处理收费设置确认的函数
  const handlePricingConfirm = async () => {
    if (selectedChapterForPricing) {
      const updates: Partial<ChapterInfo> = {
        isPaid: isPaid,
        price: isPaid ? price : 0
      };
      const success = await onUpdateChapter(
        selectedChapterForPricing.id,
        updates
      );
      if (success) {
        setChapters(
          chapters.map((ch) =>
            ch.id === selectedChapterForPricing.id ? { ...ch, ...updates } : ch
          )
        );
        setAlert({ message: "章节收费设置更新成功", type: "success" });
      } else {
        setAlert({ message: "章节收费设置更新失败", type: "error" });
      }
      setIsPricingMenuOpen(false);
    }
  };

  const handleAuthorNoteChange = (note: string) => {
    setCurrentAuthorNote(note);
  };

  const handleSaveAuthorNote = async () => {
    if (selectedChapter) {
      const updates: Partial<ChapterInfo> = { authorNote: currentAuthorNote };
      const success = await onUpdateChapter(selectedChapter.id!, updates);
      if (success) {
        setChapters(
          chapters.map((ch) =>
            ch.id === selectedChapter.id ? { ...ch, ...updates } : ch
          )
        );
        setAlert({ message: "作者留言更新成功", type: "success" });
      } else {
        setAlert({ message: "作者留言更新失败", type: "error" });
      }
      setIsAuthorNoteDialogOpen(false);
    }
  };

  const closeAuthorNoteDialog = () => {
    setIsAuthorNoteDialogOpen(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "draft":
        return "草稿箱";
      case "published":
        return "已发布";
      case "scheduled":
        return "定时发布";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="flex items-center gap-10 mb-4">
        <h2 className="text-2xl font-bold text-neutral-600">章节列表</h2>
        <span
          className={`px-2 py-1 rounded text-sm ${
            book.status === "ongoing"
              ? "bg-orange-400 text-white"
              : "bg-green-200 text-green-800"
          }`}
        >
          {book.status === "ongoing"
            ? t("chapterList.ongoing")
            : t("chapterList.completed")}
        </span>
        <select
          className="border rounded p-2 outline-none hover:border-orange-400"
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          value={sortOrder}
        >
          <option value="asc">{t("chapterList.sortEarliest")}</option>
          <option value="desc">{t("chapterList.sortLatest")}</option>
        </select>
      </div>
      <ul className="mt-5 h-[640px] overflow-y-auto">
        {sortedChapters.map((chapter) => (
          <li
            key={chapter.id}
            className="flex  items-center justify-between border-b px-5 py-3 hover:bg-neutral-100"
          >
            <div className="flex-col justify-between ">
              <Link
                href={`/writing/${book.id}/chapter/${chapter.id}`}
                className="w-2/3  text-lg text-neutral-600 font-medium hover:text-orange-500"
              >
                {t("chapterList.chapter")} {chapter.chapterNumber}:
                {chapter.title}
              </Link>
              <div className="space-x-5 text-neutral-400 text-sm">
                <span>
                  {t("chapterList.lastModified")} {chapter.wordCount}
                </span>
                <span>
                  {t("chapterList.lastModified")}
                  {formatDate(chapter.lastModified!)}
                </span>
              </div>
            </div>
            <div className="space-x-10 flex items-center ">
              <button
                className="flex-shrink-0 text-neutral-400  w-20 flex items-center justify-center  p-2 rounded border border-neutral-400 shadow-sm text-sm hover:bg-neutral-400 hover:text-white"
                onClick={() => openPricingMenu(chapter)}
              >
                <CurrencyDollarIcon className="h-5 w-5  mr-1 " />
                {chapter.isPaid ? ` ${chapter.price}` : t("chapterList.free")}
              </button>
              <button
                className="flex-shrink-0  text-neutral-400 p-2 w-20 rounded border border-neutral-400 shadow-sm text-sm hover:bg-neutral-400 hover:text-white"
                onClick={() => openAuthorNoteDialog(chapter)}
              >
                {t("chapterList.authorNote")}
              </button>
              <button
                onClick={() => openDialog(chapter)}
                className={`flex-shrink-0 p-2 w-20 rounded border border-neutral-400 shadow-sm text-sm hover:bg-neutral-400 hover:text-white whitespace-nowrap overflow-hidden ${
                  getChapterStatus(chapter) === "published"
                    ? "text-neutral-400"
                    : getChapterStatus(chapter) === "draft"
                    ? "text-orange-400"
                    : "text-blue-400"
                }`}
              >
                {getChapterStatus(chapter) === "scheduled" ? (
                  <div className="animate-scroll ">
                    {getStatusDisplay(getChapterStatus(chapter))}
                    {chapter.publishDate &&
                      ` (${formatDate(chapter.publishDate)})`}
                  </div>
                ) : (
                  getStatusDisplay(getChapterStatus(chapter))
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-600">
                {t("chapterList.updateStatus")}
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <select
                value={newStatus}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as "draft" | "published" | "scheduled"
                  )
                }
                className="w-full border rounded p-2 text-neutral-600 focus:outline-none"
              >
                <option value="draft">{t("chapterList.saveDraft")}</option>
                <option value="published">
                  {t("chapterList.publishChapter")}
                </option>
                <option value="scheduled">
                  {t("chapterList.schedulePublish")}
                </option>
              </select>
            </div>

            {newStatus === "scheduled" && (
              <div className="mb-4 relative ">
                <input
                  type="datetime-local"
                  value={newDate ? newDate.slice(0, 16).replace(" ", "T") : ""}
                  min={minDateTime}
                  onChange={handleDateChange}
                  className="w-full border rounded p-2 pl-8"
                />
                <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-2 top-2.5" />
              </div>
            )}
            {newStatus === "scheduled" && newDate && (
              <div className="mb-4 bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-600 whitespace-nowrap">
                  发布时间：{formatDateForDisplay(newDate)}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleConfirmUpdate}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                确认更新
              </button>
            </div>
          </div>
        </div>
      )}

      {isAuthorNoteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <div className="mb-4">
              <AuthorNote
                authorNote={currentAuthorNote}
                onAuthorNoteChange={handleAuthorNoteChange}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeAuthorNoteDialog}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                取消
              </button>
              <button
                onClick={handleSaveAuthorNote}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                保存留言
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增: 收费设置菜单 */}
      {isPricingMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-600">
                {t("chapterList.pricingSetup")}
              </h3>
              <button
                onClick={() => setIsPricingMenuOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!isPaid}
                  onChange={() => setIsPaid(false)}
                  className="form-radio"
                />
                <span>{t("pricingFree")}</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  checked={isPaid}
                  onChange={() => setIsPaid(true)}
                  className="form-radio"
                />
                <span>收费</span>
              </label>
            </div>
            {isPaid && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {t("chapterList.priceLabel")}
                  <span className="text-neutral-400">
                    {" "}
                    {t("chapterList.free")}
                  </span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handlePricingConfirm}
                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                {t("chapterList.confirmSetting")}
              </button>
            </div>
          </div>
        </div>
      )}

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          display: inline-block;
          white-space: nowrap;
          animation: scroll 12s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

export default ChapterList;

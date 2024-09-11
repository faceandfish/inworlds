"use client";
import React, { useState, useCallback, useEffect } from "react";
import { BookInfo } from "@/app/lib/definitions";
import AuthorInfo from "./AuthorInfo";
import { getImageUrl } from "@/app/lib/imageUrl";
import { FireIcon } from "@heroicons/react/24/solid";
import {
  favoriteBook,
  unfavoriteBook,
  checkBookFavoriteStatus
} from "@/app/lib/action";
import Link from "next/link";

interface BookHeaderProps {
  book: BookInfo;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // 格式化日期函数
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}月${String(date.getDate()).padStart(2, "0")}日`;
  }, []);

  // 检查收藏状态
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await checkBookFavoriteStatus(book.id);
        setIsFavorited(response.data);
      } catch (error) {
        console.error("检查收藏状态失败:", error);
      }
    };
    checkFavoriteStatus();
  }, [book.id]);

  // 处理收藏
  const handleFavorite = async () => {
    if (isFavorited) return;

    try {
      await favoriteBook(book.id);
      setIsFavorited(true);
    } catch (error) {
      console.error("收藏操作失败:", error);
    }
  };
  return (
    <div className="flex justify-between mt-10 w-full h-56">
      <div className="flex gap-10">
        {/* 书籍封面 */}
        <div className="w-44 h-56 shadow-md rounded-xl overflow-hidden">
          <img
            src={getImageUrl(book.coverImageUrl)}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 书籍信息 */}
        <div className="flex flex-col justify-around">
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-neutral-500 text-sm">
            更新时间: {formatDate(book.lastSaved!)}
          </p>
          <div className="flex gap-5 text-neutral-500">
            <p>
              最新章节: 第{book.latestChapterNumber}章 {book.latestChapterTitle}
            </p>
            <p>{book.status === "ongoing" ? "连载中" : "已完结"}</p>
          </div>
          <div className="flex">
            <Link href={`/book/${book.id}/chapter/1`}>
              <div className="px-5 py-2 border rounded hover:bg-neutral-100 text-orange-400 mr-10">
                立即阅读
              </div>
            </Link>

            <div className="flex items-center ">
              <button
                className={`px-5 py-2 rounded hover:bg-orange-500 bg-orange-400  ${
                  isFavorited ? "text-white" : "text-white"
                }`}
                onClick={handleFavorite}
                disabled={isFavorited}
              >
                {isFavorited ? "已收藏" : "收藏本书"}
              </button>

              <FireIcon className="w-5 text-red-500 ml-5" />
              <p className="text-red-500 ">{book.favoritesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 作者信息组件 */}
      <AuthorInfo book={book} />
    </div>
  );
};

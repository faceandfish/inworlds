"use client";
import React, { useState, useCallback, useEffect } from "react";
import { BookInfo } from "@/app/lib/definitions";
import AuthorInfo from "./AuthorInfo";
import { getAvatarUrl, getImageUrl } from "@/app/lib/imageUrl";
import { FireIcon } from "@heroicons/react/24/solid";
import {
  favoriteBook,
  unfavoriteBook,
  checkBookFavoriteStatus
} from "@/app/lib/action";
import Link from "next/link";
import Alert from "../Main/Alert";
import { useUser } from "../UserContextProvider";
import { useRouter } from "next/navigation";
import { useTranslation } from "../useTranslation";
import BookHeaderSkeleton from "./skeleton/BookHeaderSkeleton";
import Image from "next/image";
import AuthorInfoSkeleton from "./skeleton/AuthorInfoSkeleton";

interface BookHeaderProps {
  book: BookInfo;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const { t, isLoaded } = useTranslation("book");

  const isLoggedIn = !!user;

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
      if (!isLoggedIn) return;
      try {
        const response = await checkBookFavoriteStatus(book.id);
        setIsFavorited(response.data);
      } catch (error) {
        console.error("检查收藏状态失败:", error);
      }
    };
    checkFavoriteStatus();
  }, [book.id, isLoggedIn]);

  // 处理收藏
  const handleFavorite = async () => {
    if (isFavorited) return;

    if (!isLoggedIn) {
      setAlert({
        message: "请登录后再进行收藏",
        type: "error"
      });
      return;
    }

    try {
      await favoriteBook(book.id);
      setIsFavorited(true);
      setAlert({
        message: "收藏成功！",
        type: "success"
      });
    } catch (error) {
      console.error("收藏操作失败:", error);
      setAlert({
        message: "收藏失败，请稍后重试",
        type: "error"
      });
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (!isLoaded) {
    return <BookHeaderSkeleton />; // 显示骨架屏
  }

  return (
    <div className="flex flex-col md:flex-row justify-between mt-5 md:mt-10 w-full md:h-56">
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        {/* 书籍封面 */}
        <div className="w-full md:w-44 h-64 md:h-56 shadow-md rounded-xl overflow-hidden">
          <img
            src={getImageUrl(book.coverImageUrl)}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 书籍信息 */}
        <div className="flex flex-col justify-around mt-4 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold">{book.title}</h2>
          <p className="text-neutral-500 text-sm">
            {t("updatedTime")}: {formatDate(book.lastSaved!)}
          </p>
          <div className="flex gap-5 text-neutral-500">
            <p>
              {t("latestChapter")}:{" "}
              {t("chapterNumber", { number: book.latestChapterNumber })}{" "}
              {book.latestChapterTitle}
            </p>
            <p>{book.status === "ongoing" ? t("ongoing") : t("completed")}</p>
          </div>
          <div className="flex flex-col md:flex-row mt-4 md:mt-0">
            <Link href={`/book/${book.id}/chapter/1`}>
              <div className="px-5 py-2 border rounded hover:bg-neutral-100 text-orange-400 mb-2 md:mb-0 md:mr-10 text-center">
                {t("readNow")}
              </div>
            </Link>

            <div className="flex items-center justify-between">
              <button
                className={`px-5 py-2 rounded hover:bg-orange-500 bg-orange-400 text-white`}
                onClick={handleFavorite}
                disabled={isFavorited}
              >
                {isFavorited ? t("alreadyFavorited") : t("favoriteBook")}
              </button>
              <Link
                href={`/user/${book.authorId}`}
                className="md:hidden text-sm flex gap-2 items-center text-neutral-600 "
              >
                <Image
                  src={getAvatarUrl(book.authorAvatarUrl)}
                  alt={book.authorName}
                  width={200}
                  height={200}
                  className="rounded-full w-8 h-8 cursor-pointer hover:brightness-90 transition-all duration-200"
                />
                <p>{book.authorName}</p>
              </Link>
              <div className="flex ">
                <FireIcon className="w-5 text-red-500 ml-5" />
                <p className="text-red-500 ">{book.favoritesCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 作者信息组件 */}
      <div className="hidden md:block mt-8 md:mt-0">
        {isLoaded ? <AuthorInfo book={book} /> : <AuthorInfoSkeleton />}
      </div>

      {alert && (
        <Alert
          message={t(alert.message)}
          type={alert.type}
          onClose={() => setAlert(null)}
          customButton={
            alert.message === "请登录后再进行收藏"
              ? {
                  text: t("goToLogin"),
                  onClick: handleLogin
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

"use client";
import React, { useState, useEffect } from "react";
import {
  getUserFavorites,
  fetchFollowedAuthors,
  fetchSystemNotifications
} from "@/app/lib/action";
import {
  BookInfo,
  PublicUserInfo,
  SystemNotification
} from "@/app/lib/definitions";
import { getImageUrl, getAvatarUrl } from "@/app/lib/imageUrl";
import Link from "next/link";
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/ProfilePage/UserPreviewCard";

const Page = () => {
  // 收藏书籍状态
  const [favoriteBooks, setFavoriteBooks] = useState<BookInfo[]>([]);
  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [totalBookPages, setTotalBookPages] = useState(1);

  // 关注作者状态
  const [followedAuthors, setFollowedAuthors] = useState<PublicUserInfo[]>([]);
  const [currentAuthorPage, setCurrentAuthorPage] = useState(1);
  const [totalAuthorPages, setTotalAuthorPages] = useState(1);

  const [systemNotifications, setSystemNotifications] = useState<
    SystemNotification[]
  >([]);
  const [currentNotificationPage, setCurrentNotificationPage] = useState(1);
  const [totalNotificationPages, setTotalNotificationPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 获取收藏的书籍
        const booksResponse = await getUserFavorites(currentBookPage, 20);
        if (booksResponse.data && booksResponse.data.dataList) {
          setFavoriteBooks(booksResponse.data.dataList);
          setTotalBookPages(booksResponse.data.totalPage);
        }

        // 获取关注的作者
        const authorsResponse = await fetchFollowedAuthors(
          currentAuthorPage,
          20
        );
        if (authorsResponse.data && authorsResponse.data.dataList) {
          setFollowedAuthors(authorsResponse.data.dataList);
          setTotalAuthorPages(authorsResponse.data.totalPage);
        }

        // 获取系统通知
        const notificationsResponse = await fetchSystemNotifications(
          currentNotificationPage,
          20
        );
        setSystemNotifications(notificationsResponse.dataList);
        setTotalNotificationPages(notificationsResponse.totalPage);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentBookPage, currentAuthorPage]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* 系统通知 */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">系统通知</h1>
        <div className="space-y-4">
          {systemNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg ${
                notification.isRead ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <p
                className={`${
                  notification.isRead ? "text-gray-700" : "text-blue-700"
                }`}
              >
                {notification.content}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {totalNotificationPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                setCurrentNotificationPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentNotificationPage === 1}
              className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              {currentNotificationPage} / {totalNotificationPages}
            </span>
            <button
              onClick={() =>
                setCurrentNotificationPage((prev) =>
                  Math.min(prev + 1, totalNotificationPages)
                )
              }
              disabled={currentNotificationPage === totalNotificationPages}
              className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </section>

      {/* 收藏的书籍 */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">我的收藏</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {favoriteBooks.map((book) => (
            <BookPreviewCard key={book.id} book={book} width="w-full" />
          ))}
        </div>
        {totalBookPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                setCurrentBookPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentBookPage === 1}
              className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              {currentBookPage} / {totalBookPages}
            </span>
            <button
              onClick={() =>
                setCurrentBookPage((prev) => Math.min(prev + 1, totalBookPages))
              }
              disabled={currentBookPage === totalBookPages}
              className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </section>

      {/* 关注的作者 */}
      <section>
        <h1 className="text-2xl font-bold mb-4">关注的用户</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {followedAuthors.map((user) => (
            <UserPreviewCard key={user.id} user={user} />
          ))}
        </div>
        {totalAuthorPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                setCurrentAuthorPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentAuthorPage === 1}
              className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              {currentAuthorPage} / {totalAuthorPages}
            </span>
            <button
              onClick={() =>
                setCurrentAuthorPage((prev) =>
                  Math.min(prev + 1, totalAuthorPages)
                )
              }
              disabled={currentAuthorPage === totalAuthorPages}
              className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;

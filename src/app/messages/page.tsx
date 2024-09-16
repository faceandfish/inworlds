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
import { BookPreviewCard } from "@/components/Book/BookPreviewCard";
import { UserPreviewCard } from "@/components/ProfilePage/UserPreviewCard";
import Pagination from "@/components/Pagination";

const Page: React.FC = () => {
  // State declarations with proper typing
  const [favoriteBooks, setFavoriteBooks] = useState<BookInfo[]>([]);
  const [followedAuthors, setFollowedAuthors] = useState<PublicUserInfo[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<
    SystemNotification[]
  >([]);
  const [pagination, setPagination] = useState({
    books: { currentPage: 1, totalPages: 1 },
    authors: { currentPage: 1, totalPages: 1 },
    notifications: { currentPage: 1, totalPages: 1 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [booksResponse, authorsResponse, notificationsResponse] =
          await Promise.all([
            getUserFavorites(pagination.books.currentPage, 20),
            fetchFollowedAuthors(pagination.authors.currentPage, 20),
            fetchSystemNotifications(pagination.notifications.currentPage, 20)
          ]);

        setFavoriteBooks(booksResponse.data.dataList);
        setFollowedAuthors(authorsResponse.data.dataList);
        setSystemNotifications(notificationsResponse.dataList);

        setPagination({
          books: {
            ...pagination.books,
            totalPages: booksResponse.data.totalPage
          },
          authors: {
            ...pagination.authors,
            totalPages: authorsResponse.data.totalPage
          },
          notifications: {
            ...pagination.notifications,
            totalPages: notificationsResponse.totalPage
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("获取数据时发生错误。请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    pagination.books.currentPage,
    pagination.authors.currentPage,
    pagination.notifications.currentPage
  ]);

  const handlePageChange = (
    section: "books" | "authors" | "notifications",
    newPage: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      [section]: { ...prev[section], currentPage: newPage }
    }));
  };

  if (isLoading) return <div className="text-center p-4">加载中...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">个人中心</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          <Section title="系统通知" className="h-64">
            <div className="space-y-4 overflow-auto h-[calc(100%-4rem)]">
              {systemNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.isRead ? "bg-gray-50" : "bg-blue-50"
                  }`}
                >
                  <p
                    className={
                      notification.isRead ? "text-gray-700" : "text-blue-700"
                    }
                  >
                    {notification.content}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={pagination.notifications.currentPage}
              totalPages={pagination.notifications.totalPages}
              onPageChange={(page) => handlePageChange("notifications", page)}
            />
          </Section>

          <Section title="收藏的书籍" className="h-96">
            <div className="grid grid-cols-2 gap-4 overflow-auto h-[calc(100%-4rem)]">
              {favoriteBooks.map((book) => (
                <BookPreviewCard key={book.id} book={book} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.books.currentPage}
              totalPages={pagination.books.totalPages}
              onPageChange={(page) => handlePageChange("books", page)}
            />
          </Section>
        </div>

        <div className="lg:w-1/3">
          <Section title="关注的用户" className="h-full">
            <div className="space-y-4 overflow-auto h-[calc(100%-4rem)]">
              {followedAuthors.map((user) => (
                <UserPreviewCard key={user.id} user={user} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.authors.currentPage}
              totalPages={pagination.authors.totalPages}
              onPageChange={(page) => handlePageChange("authors", page)}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="bg-gray-800 p-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default Page;

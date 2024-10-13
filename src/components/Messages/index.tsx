"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import NotificationCard from "./NotificationCard";
import {
  getUserFavorites,
  fetchFollowedAuthors,
  fetchSystemNotifications
} from "@/app/lib/action";
import {
  ApiResponse,
  BookInfo,
  PaginatedData,
  PublicUserInfo,
  SystemNotification
} from "@/app/lib/definitions";
import { UserPreviewCard } from "./UserPreviewCard";
import Sidebar, { SectionType } from "./Sidebar";
import { FavoriteBookPreviewCard } from "./FavoriteBookPreviewCard";
import { useTranslation } from "../useTranslation";

const Messages: React.FC = () => {
  const { t } = useTranslation("message");

  const [activeSection, setActiveSection] = useState<SectionType>("books");
  const [data, setData] = useState({
    books: [] as BookInfo[],
    authors: [] as PublicUserInfo[],
    notifications: [] as SystemNotification[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isLoading && data[activeSection].length > 0) {
      return; // 如果当前部分已有数据，不再重新获取
    }

    setIsLoading(true);
    setError(null);
    try {
      switch (activeSection) {
        case "books": {
          const response: ApiResponse<PaginatedData<BookInfo>> =
            await getUserFavorites(1, 10);
          setData((prev) => ({
            ...prev,
            books: response.data.dataList
          }));
          console.log(`API Response for books:`, response);
          break;
        }
        case "authors": {
          const response: ApiResponse<PaginatedData<PublicUserInfo>> =
            await fetchFollowedAuthors(1, 10);
          setData((prev) => ({
            ...prev,
            authors: response.data.dataList
          }));
          console.log(`API Response for authors:`, response);
          break;
        }
        case "notifications": {
          const response: PaginatedData<SystemNotification> =
            await fetchSystemNotifications(1, 10);
          setData((prev) => ({
            ...prev,
            notifications: response.dataList
          }));
          console.log(`API Response for notifications:`, response);
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("获取数据时发生错误。请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }, [activeSection, isLoading, data]);

  useEffect(() => {
    fetchData();
  }, [fetchData, activeSection]);

  const handleSectionChange = useCallback((newSection: SectionType) => {
    setActiveSection(newSection);
  }, []);

  const renderContent = useMemo(() => {
    if (isLoading)
      return <div className="text-center">{t("messages.loading")}</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    console.log(`Rendering ${activeSection}:`, data[activeSection]);

    switch (activeSection) {
      case "books":
        return (
          <div className="space-y-4">
            {data.books.map((book) => (
              <FavoriteBookPreviewCard key={book.id} book={book} />
            ))}
          </div>
        );
      case "authors":
        return (
          <div className="space-y-4">
            {data.authors.map((author) => (
              <UserPreviewCard key={author.id} user={author} />
            ))}
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-4">
            {data.notifications.map((notification) => (
              <NotificationCard key={notification.id} {...notification} />
            ))}
          </div>
        );
      default:
        return null;
    }
  }, [activeSection, data, isLoading, error]);

  const title = useMemo(() => {
    switch (activeSection) {
      case "books":
        return t("messages.favoriteBooks");
      case "authors":
        return t("messages.followedUsers");
      case "notifications":
        return t("messages.systemNotifications");
      default:
        return "";
    }
  }, [activeSection, t]);

  return (
    <div className="flex flex-col md:flex-row md:px-20 h-screen">
      {/* 移动端顶部导航 */}
      <div className="md:hidden border-b">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* PC端侧边栏 */}
      <div className="hidden md:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* 固定的标题部分 */}
        <header className="bg-white p-4 md:p-8 md:border-b">
          <h2 className="hidden md:block text-xl md:text-2xl font-semibold text-neutral-600">
            {title}
          </h2>
        </header>

        {/* 可滚动的内容部分 */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-white">
          {renderContent}
        </main>
      </div>
    </div>
  );
};

export default Messages;

"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BookOpenIcon,
  UserGroupIcon,
  BellIcon
} from "@heroicons/react/24/outline";

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
import Link from "next/link";
import {
  MessagesSkeleton,
  SidebarSkeleton,
  TitleSkeleton
} from "./MessagesSkeleton";

const Messages: React.FC = () => {
  const { t, isLoaded, lang } = useTranslation("message");

  const [activeSection, setActiveSection] = useState<SectionType>("books");
  const [data, setData] = useState({
    books: [] as BookInfo[],
    authors: [] as PublicUserInfo[],
    notifications: [] as SystemNotification[]
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (data[activeSection].length > 0) {
      return; // If current section has data, don't fetch again
    }
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
          break;
        }
        case "authors": {
          const response: ApiResponse<PaginatedData<PublicUserInfo>> =
            await fetchFollowedAuthors(1, 10);
          setData((prev) => ({
            ...prev,
            authors: response.data.dataList
          }));
          break;
        }
        case "notifications": {
          const response: PaginatedData<SystemNotification> =
            await fetchSystemNotifications(1, 10);
          setData((prev) => ({
            ...prev,
            notifications: response.dataList
          }));
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("获取数据时发生错误。请稍后再试。");
    }
  }, [activeSection]);

  useEffect(() => {
    fetchData();
  }, [fetchData, activeSection]);

  const handleSectionChange = useCallback((newSection: SectionType) => {
    setActiveSection(newSection);
  }, []);

  const ContentComponent = () => {
    if (!isLoaded) return <MessagesSkeleton />;

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4">
            <BookOpenIcon
              className="w-16 h-16 text-gray-400"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-neutral-600 text-lg text-center mb-4">
            {t("pleaseLoginFirst")}
          </p>
          <div className="flex space-x-4">
            <Link
              href={`/${lang}/login`}
              className="px-6 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
            >
              {t("login")}
            </Link>
            <Link
              href={`/${lang}/register`}
              className="px-6 py-2 border border-orange-400 text-orange-400 rounded-md hover:bg-orange-50"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "books":
        return data.books.length > 0 ? (
          <div className="space-y-4">
            {data.books.map((book) => (
              <FavoriteBookPreviewCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4">
              <BookOpenIcon
                className="w-16 h-16 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-gray-500 text-lg">
              {t("messages.noFavoriteBooks")}
            </p>
            <Link
              href="/"
              className="mt-4 text-orange-400 hover:text-orange-500"
            >
              {t("messages.exploreBooks")}
            </Link>
          </div>
        );
      case "authors":
        return data.authors.length > 0 ? (
          <div className="space-y-4">
            {data.authors.map((author) => (
              <UserPreviewCard key={author.id} user={author} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4">
              <UserGroupIcon
                className="w-16 h-16 text-gray-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-gray-500 text-lg">
              {t("messages.noFollowedAuthors")}
            </p>
            <Link
              href="/"
              className="mt-4 text-orange-400 hover:text-orange-500"
            >
              {t("messages.exploreAuthors")}
            </Link>
          </div>
        );
      case "notifications":
        return data.notifications.length > 0 ? (
          <div className="space-y-4">
            {data.notifications.map((notification) => (
              <NotificationCard key={notification.id} {...notification} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4">
              <BellIcon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-gray-500 text-lg">
              {t("messages.noNotifications")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

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
      {/* Mobile top navigation */}
      <div className="md:hidden border-b">
        {!isLoaded ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        {!isLoaded ? (
          <SidebarSkeleton />
        ) : (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Fixed title section */}
        <header className="bg-white p-4 md:p-8 md:border-b">
          {!isLoaded ? (
            <TitleSkeleton />
          ) : (
            <h2 className="hidden md:block text-xl md:text-2xl font-semibold text-neutral-600">
              {title}
            </h2>
          )}
        </header>

        {/* Scrollable content section */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-white">
          <ContentComponent />
        </main>
      </div>
    </div>
  );
};

export default Messages;

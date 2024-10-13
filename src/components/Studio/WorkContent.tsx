"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition
} from "react";
import { useRouter } from "next/navigation";
import { BookInfo } from "@/app/lib/definitions";

import {
  deleteBook,
  fetchBooksList,
  updateBookDetails
} from "@/app/lib/action";
import Pagination from "../Pagination";
import Link from "next/link";
import Alert from "../Alert";
import WorkContentSkeleton from "./Skeleton/WorkContentSkeleton";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

const ITEMS_PER_PAGE = 5;

// OPTIMIZATION: 将这些常量移到组件外部，避免在每次渲染时重新创建
const tabs = ["published", "ongoing", "completed", "draft"] as const;

const WorkContent: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const [allBooks, setAllBooks] = useState<BookInfo[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation("studio");

  const tabNames = [
    t("studio.workContent.tabs.published"),
    t("studio.workContent.tabs.ongoing"),
    t("studio.workContent.tabs.completed"),
    t("studio.workContent.tabs.draft")
  ];

  useEffect(() => {
    if (user && user.id) {
      let ignore = false;
      fetchBooksList(user.id, 1, 1000, "all")
        .then((response) => {
          if (!ignore) {
            if (response.code === 200) {
              setAllBooks(response.data.dataList);
            } else {
              throw new Error(response.msg || "获取作品列表失败");
            }
          }
        })
        .catch((error) => {
          if (!ignore) {
            throw error; // 这将被 Error Boundary 捕获
          }
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
          }
        });

      return () => {
        ignore = true;
      };
    }
  }, [user]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      switch (activeTab) {
        case "published":
          return book.publishStatus === "published";
        case "ongoing":
          return (
            book.status === "ongoing" && book.publishStatus === "published"
          );
        case "completed":
          return (
            book.status === "completed" && book.publishStatus === "published"
          );
        case "draft":
          return book.publishStatus === "draft";
        default:
          return false;
      }
    });
  }, [allBooks, activeTab]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    return filteredBooks.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredBooks, currentPage]); // OPTIMIZATION: 使用 useMemo 来记忆分页结果

  // OPTIMIZATION: 使用 useCallback 来记忆这些处理函数
  const handleTabChange = useCallback((newTab: (typeof tabs)[number]) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleNewWork = useCallback(() => {
    router.push("/writing");
  }, [router]);

  const handleEdit = useCallback(
    (bookId: number) => {
      router.push(`/writing/${bookId}`);
    },
    [router]
  );

  const handleUnpublish = useCallback(async (bookId: number) => {
    if (window.confirm(t("studio.workContent.confirmations.unpublish"))) {
      const response = await updateBookDetails(bookId, {
        publishStatus: "draft"
      });
      if (response.code === 200) {
        setAllBooks((prev) =>
          prev.map((book) =>
            book.id === bookId ? { ...book, publishStatus: "draft" } : book
          )
        );
      } else {
        throw new Error(response.msg || "下架作品失败");
      }
    }
  }, []);

  const handlePublish = useCallback(async (bookId: number) => {
    if (window.confirm(t("studio.workContent.confirmations.publish"))) {
      const response = await updateBookDetails(bookId, {
        publishStatus: "published"
      });
      if (response.code === 200) {
        setAllBooks((prev) =>
          prev.map((book) =>
            book.id === bookId ? { ...book, publishStatus: "published" } : book
          )
        );
      } else {
        throw new Error(response.msg || "发布作品失败");
      }
    }
  }, []);

  const handleDelete = useCallback(async (bookId: number) => {
    if (window.confirm(t("studio.workContent.confirmations.delete"))) {
      const response = await deleteBook(bookId);
      if (response.code === 200) {
        setAllBooks((prev) => prev.filter((book) => book.id !== bookId));
      } else {
        throw new Error(response.msg || "Failed to delete work");
      }
    }
  }, []);

  // OPTIMIZATION: 考虑将列表项提取为单独的组件，以优化渲染性能
  const BookListItem = React.memo(({ book }: { book: BookInfo }) => (
    <li className="grid grid-cols-8 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150">
      <Link
        href={`/book/${book.id}`}
        className="col-span-6 grid grid-cols-6  items-center py-3 px-3"
      >
        <span className="col-span-3 font-medium hover:text-orange-400 text-neutral-600">
          {book.title}
        </span>
        <span className="col-span-1 text-sm text-center mx-5 text-neutral-500">
          {book.publishStatus === "published"
            ? book.status === "ongoing"
              ? t("studio.workContent.status.ongoing")
              : t("studio.workContent.status.completed")
            : t("studio.workContent.status.draft")}
        </span>
        <span className="text-sm col-span-2 text-center text-neutral-500">
          {book.lastSaved || book.createdAt ? (
            <>{book.lastSaved || book.createdAt}</>
          ) : null}
        </span>
      </Link>
      <div className="col-span-2  text-center space-x-10 ">
        <button
          className="text-orange-400 hover:text-orange-500 transition-colors duration-150"
          onClick={(e) => {
            e.preventDefault();
            handleEdit(book.id);
          }}
        >
          {t("studio.workContent.actions.edit")}
        </button>

        {book.publishStatus === "published" ? (
          <button
            className="text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
            onClick={(e) => {
              e.preventDefault();
              handleUnpublish(book.id);
            }}
          >
            {t("studio.workContent.actions.unpublish")}
          </button>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-600 transition-colors duration-150"
            onClick={(e) => {
              e.preventDefault();
              handlePublish(book.id);
            }}
          >
            {t("studio.workContent.actions.publish")}
          </button>
        )}

        <button
          className="text-red-500 hover:text-red-600 transition-colors duration-150"
          onClick={(e) => {
            e.preventDefault();
            handleDelete(book.id);
          }}
        >
          {t("studio.workContent.actions.delete")}
        </button>
      </div>
    </li>
  ));

  if (isLoading) {
    return <WorkContentSkeleton />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-10">
      <ul className="flex text-lg border-b">
        {tabs.map((tab, index) => (
          <li
            key={tab}
            className={`px-6 py-3 cursor-pointer transition-colors duration-200 
              ${
                activeTab === tab
                  ? "border-b-2 border-orange-400 text-orange-600"
                  : "text-neutral-500 hover:text-orange-400"
              }`}
            onClick={() => handleTabChange(tab)}
          >
            {tabNames[index]}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <div className="grid grid-cols-8  text-neutral-600 bg-neutral-50 font-semibold">
          <div className="p-3 col-span-3">
            {t("studio.workContent.columns.title")}
          </div>
          <div className="p-3 text-center col-span-1">
            {t("studio.workContent.columns.status")}
          </div>
          <div className="p-3 text-center col-span-2">
            {t("studio.workContent.columns.lastUpdated")}
          </div>
          <div className="p-3 text-center col-span-2">
            {t("studio.workContent.columns.actions")}
          </div>
        </div>

        <ul className="h-64 ">
          {paginatedBooks.map((book: BookInfo) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </ul>

        <div className="flex justify-between items-center ">
          <Link href="/writing">
            <button
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={handleNewWork}
            >
              {t("studio.workContent.newWork")}
            </button>
          </Link>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default React.memo(WorkContent); // OPTIMIZATION: 使用 React.memo 来优化整个组件的渲染

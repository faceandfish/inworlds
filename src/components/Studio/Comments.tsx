"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CommentInfo, BookInfo } from "@/app/lib/definitions";
import {
  blockUserInBook,
  deleteComment,
  fetchBooksList,
  getBookComments,
  likeComment,
  addCommentOrReply
} from "@/app/lib/action";
import CommentItem from "../Main/CommentItem";
import Alert from "../Main/Alert";
import Pagination from "../Main/Pagination";
import Image from "next/image";
import CommentsSkeleton from "./Skeleton/CommentsSkeleton";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import { BiCommentDetail } from "react-icons/bi";
import { logger } from "../Main/logger";

const ITEMS_PER_PAGE = 10;

interface CommentsData {
  comments: CommentInfo[];
  books: BookInfo[];
}

const Comments: React.FC = () => {
  const { t } = useTranslation("studio");
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsData, setCommentsData] = useState<CommentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchComments = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const booksResponse = await fetchBooksList(1, 1000, "published");
      if (
        booksResponse.code === 200 &&
        "data" in booksResponse &&
        booksResponse.data?.dataList
      ) {
        const allBooks = booksResponse.data.dataList;
        const allComments: CommentInfo[] = [];

        for (const book of allBooks) {
          const commentsResponse = await getBookComments(book.id, 1, 1000);
          if (
            commentsResponse.code === 200 &&
            "data" in commentsResponse &&
            commentsResponse.data?.dataList
          ) {
            allComments.push(...commentsResponse.data.dataList);
          } else {
            logger.warn(
              `Failed to fetch comments for book ${book.id}:`,
              commentsResponse,
              { context: "Comments" }
            );
          }
        }

        setCommentsData({
          comments: allComments,
          books: allBooks
        });
      } else {
        logger.warn("Failed to fetch books list:", booksResponse, {
          context: "Comments"
        });
      }
    } catch (err) {
      logger.error("Error fetching comments:", err, { context: "Comments" });
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchComments(user.id);
    }
  }, [user]);

  const paginatedComments = useMemo(() => {
    if (!commentsData) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return commentsData.comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [commentsData, currentPage]);

  const totalPages = useMemo(() => {
    if (!commentsData) return 0;
    return Math.ceil(commentsData.comments.length / ITEMS_PER_PAGE);
  }, [commentsData]);

  const handleLike = async (commentId: number, isLiked: boolean) => {
    if (!user?.id) return;
    try {
      const response = await likeComment(commentId, isLiked);
      if (response.code === 200) {
        setAlertInfo({ message: t("comments.likeSuccess"), type: "success" });
        fetchComments(user.id);
      } else {
        logger.warn("Failed to like comment:", response, {
          context: "Comments"
        });
        setAlertInfo({ message: t("comments.likeFail"), type: "error" });
      }
    } catch (error) {
      logger.error("Error liking comment:", error, { context: "Comments" });
      setAlertInfo({ message: t("comments.likeFail"), type: "error" });
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    if (!user?.id || !commentsData) return;
    try {
      const bookId = commentsData.comments.find(
        (c) => c.id === commentId
      )?.bookId;
      if (!bookId) throw new Error("Book ID not found");

      const response = await addCommentOrReply(bookId, content, commentId);
      if (response.code === 200) {
        setAlertInfo({ message: t("comments.replySuccess"), type: "success" });
        fetchComments(user.id);
      } else {
        logger.warn("Failed to reply to comment:", response, {
          context: "Comments"
        });
        setAlertInfo({ message: t("comments.replyFail"), type: "error" });
      }
    } catch (error) {
      logger.error("Error replying to comment:", error, {
        context: "Comments"
      });
      setAlertInfo({ message: t("comments.replyFail"), type: "error" });
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!user?.id) return;
    try {
      const response = await deleteComment(commentId);
      if (response.code === 200) {
        setAlertInfo({ message: t("comments.deleteSuccess"), type: "success" });
        fetchComments(user.id);
      } else {
        logger.warn("Failed to delete comment:", response, {
          context: "Comments"
        });
        setAlertInfo({ message: t("comments.deleteFail"), type: "error" });
      }
    } catch (error) {
      logger.error("Error deleting comment:", error, { context: "Comments" });
      setAlertInfo({ message: t("comments.deleteFail"), type: "error" });
    }
  };

  const handleBlock = async (userId: number) => {
    if (!user?.id || !commentsData) return;
    try {
      const bookId = commentsData.books[0]?.id;
      if (!bookId) throw new Error("No books available");

      const response = await blockUserInBook(userId, bookId);
      if (response.code === 200) {
        setAlertInfo({ message: t("comments.blockSuccess"), type: "success" });
        fetchComments(user.id);
      } else {
        logger.warn("Failed to block user:", response, { context: "Comments" });
        setAlertInfo({ message: t("comments.blockFail"), type: "error" });
      }
    } catch (error) {
      logger.error("Error blocking user:", error, { context: "Comments" });
      setAlertInfo({ message: t("comments.blockFail"), type: "error" });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <CommentsSkeleton />;
  }

  if (error) {
    return (
      <Alert message={error} type="error" onClose={() => setError(null)} />
    );
  }

  if (!commentsData || commentsData.comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-lg">
        <BiCommentDetail className="w-16 h-16 text-neutral-300 mb-4" />
        <p className="text-neutral-500 text-lg font-medium mb-2">
          {t("comments.noComments")}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10">
      <h1 className="text-2xl font-bold pb-6 border-b">
        {t("comments.title")}
      </h1>
      {commentsData.comments.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {paginatedComments.map((comment: CommentInfo) => {
              const book = commentsData.books.find(
                (b: BookInfo) => b.id === comment.bookId
              );
              return (
                <li key={comment.id} className="flex">
                  <div className="w-2/3">
                    <CommentItem
                      comment={comment}
                      actions={{
                        onLike: handleLike,
                        onReply: handleReply,
                        onDelete: handleDelete,
                        onBlock: handleBlock
                      }}
                      showDeleteButton={true}
                      showBlockButton={true}
                    />
                  </div>
                  {book && (
                    <div className="w-1/3 flex items-center gap-10">
                      <Image
                        src={book.coverImageUrl || ""}
                        width={400}
                        height={600}
                        alt={`${book.title} cover` || "cover"}
                        className="w-16 h-20 object-cover object-center"
                        onError={(e) => {
                          logger.error(
                            "Image loading failed:",
                            book.coverImageUrl,
                            { context: "Comments" }
                          );
                        }}
                      />
                      <p className="text-sm line-clamp-1 font-semibold mt-2">
                        {book.title}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="my-20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10">{t("comments.noComments")}</div>
      )}
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={() => setAlertInfo(null)}
        />
      )}
    </div>
  );
};

export default Comments;

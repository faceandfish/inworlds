"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CommentInfo } from "@/app/lib/definitions";
import {
  blockUserInBook,
  deleteComment,
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

const Comments: React.FC = () => {
  const { t } = useTranslation("studio");
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<CommentInfo[]>([]);
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
      // Since we have bookId in each comment, we can use any single book's comments endpoint
      const commentsResponse = await getBookComments(1, 1, 1000);
      if (
        commentsResponse.code === 200 &&
        "data" in commentsResponse &&
        commentsResponse.data?.dataList
      ) {
        setComments(commentsResponse.data.dataList);
      } else {
        logger.warn("Failed to fetch comments:", commentsResponse, {
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
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [comments, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(comments.length / ITEMS_PER_PAGE);
  }, [comments]);

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
    if (!user?.id) return;
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment?.bookId) throw new Error("Book ID not found");

      const response = await addCommentOrReply(
        comment.bookId,
        content,
        commentId
      );
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
    if (!user?.id || comments.length === 0) return;
    try {
      // Use the bookId from the first comment
      const bookId = comments[0]?.bookId;
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

  if (comments.length === 0) {
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
      {comments.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {paginatedComments.map((comment: CommentInfo) => (
              <li key={comment.id} className="flex py-4">
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
                <div className="w-1/3 flex items-center gap-10">
                  <Image
                    src={comment.bookCoverUrl || ""}
                    width={400}
                    height={600}
                    alt={comment.bookTitle || "book cover"}
                    className="w-16 h-20 object-cover object-center"
                    unoptimized
                    onError={(e) => {
                      logger.error(
                        "Image loading failed:",
                        comment.bookCoverUrl,
                        { context: "Comments" }
                      );
                    }}
                  />
                  <p className="text-sm line-clamp-1 font-semibold mt-2">
                    {comment.bookTitle}
                  </p>
                </div>
              </li>
            ))}
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

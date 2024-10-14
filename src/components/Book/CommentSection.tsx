"use client";
import React, { useState, useEffect } from "react";
import { CommentInfo } from "@/app/lib/definitions";
import {
  getBookComments,
  addCommentOrReply,
  likeComment
} from "@/app/lib/action";

import Alert from "../Main/Alert";
import CommentItem from "../Main/CommentItem";
import Pagination from "../Main/Pagination";
import { useTranslation } from "../useTranslation";
import BookContentSkeleton from "./skeleton/BookContentSkeleton";

interface CommentSectionProps {
  bookId: number;
  isLoggedIn: boolean; // 新增：用于判断用户是否已登录
  onLogin: () => void; // 新增：登录回调函数
}

const CommentSection: React.FC<CommentSectionProps> = ({
  bookId,
  isLoggedIn,
  onLogin
}) => {
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const commentsPerPage = 20;
  const { t, isLoaded } = useTranslation("book");

  useEffect(() => {
    fetchComments(currentPage);
  }, [bookId, currentPage]);

  const fetchComments = async (page: number) => {
    setLoading(true);
    try {
      const response = await getBookComments(bookId, page, commentsPerPage);
      setComments(response.data.dataList);
      setTotalPages(Number(response.data.totalPage));
    } catch (err) {
      setError(t("failedToLoadComments"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await addCommentOrReply(bookId, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
      fetchComments(1);
    } catch (err) {
      setError(t("addingCommentFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    try {
      const response = await addCommentOrReply(bookId, content, commentId);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              }
            : comment
        )
      );
    } catch (err) {
      setError(t("replyFailed"));
    }
  };

  const handleLike = async (commentId: number) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    try {
      await likeComment(commentId);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (err) {
      setError(t("likeFailed"));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isLoaded) {
    return <BookContentSkeleton />; // 显示骨架屏
  }

  return (
    <div className="my-5 md:my-10 px-4 md:px-0">
      <form onSubmit={handleSubmitComment} className="mb-6 flex flex-col">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("leaveComment")}
          className="w-full md:w-1/2 p-2 border rounded text-neutral-600 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 w-full md:w-fit bg-orange-400 text-white rounded hover:bg-orange-500 disabled:bg-neutral-400"
        >
          {loading ? t("submitting") : t("addComment")}
        </button>
      </form>

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      {showLoginAlert && (
        <Alert
          message={t("pleaseLoginToComment")}
          type="error"
          onClose={() => setShowLoginAlert(false)}
          customButton={{
            text: t("login"),
            onClick: () => {
              setShowLoginAlert(false);
              onLogin();
            }
          }}
          autoClose={false}
        />
      )}

      {loading && <p>{t("loadingComments")}</p>}
      {!loading && comments.length === 0 && <p>{t("noCommentsYet")}</p>}

      <div className="mb-10 md:mb-20">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            actions={{
              onLike: handleLike,
              onReply: handleReply
            }}
            showDeleteButton={false}
            showBlockButton={false}
          />
        ))}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {totalPages > currentPage && (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm md:text-base"
        >
          {t("loadMore")}
        </button>
      )}
    </div>
  );
};

export default CommentSection;

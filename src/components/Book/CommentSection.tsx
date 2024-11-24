"use client";
import React, { useState, useEffect } from "react";
import { CommentInfo } from "@/app/lib/definitions";
import {
  getBookComments,
  addCommentOrReply,
  likeComment,
  deleteComment
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
  currentUserId: number | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  bookId,
  isLoggedIn,
  onLogin,
  currentUserId
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
  const MAX_COMMENT_LENGTH = 1000; // 最大评论字数

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
    if (newComment.length > MAX_COMMENT_LENGTH) {
      setError(t("commentTooLong"));
      return;
    }
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await addCommentOrReply(bookId, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
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
                replies: [...(comment.replies || []), response.data],
                replyCount: (comment.replyCount || 0) + 1
              }
            : comment
        )
      );
    } catch (err) {
      setError(t("replyFailed"));
    }
  };

  const handleDeleteComment = async (
    commentId: number,
    isReply: boolean = false
  ) => {
    try {
      await deleteComment(commentId);

      if (isReply) {
        // 如果是删除回复,只需要过滤掉该条回复
        setComments(
          comments.map((comment) => ({
            ...comment,
            replies:
              comment.replies?.filter((reply) => reply.id !== commentId) || [],
            replyCount: (
              comment.replies?.filter((reply) => reply.id !== commentId) || []
            ).length
          }))
        );
      } else {
        // 如果是删除主评论,直接过滤掉整个评论及其回复
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (err) {
      setError(t("deletingCommentFailed"));
    }
  };

  const handleLike = async (commentId: number) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }

    try {
      const currentComment = comments.find((c) => c.id === commentId);
      if (!currentComment) return;

      const response = await likeComment(commentId, !currentComment.isLiked);

      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: response.data.isLiked,
                likes: response.data.likes
              }
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
          onChange={(e) => {
            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
              setNewComment(e.target.value);
            }
          }}
          placeholder={t("leaveComment")}
          maxLength={MAX_COMMENT_LENGTH}
          className="w-full md:w-1/2 p-2 border rounded text-neutral-600 focus:outline-none"
          rows={3}
        />
        {newComment && ( // 添加字数提示
          <div className="text-sm text-gray-500 mt-1">
            {newComment.length}/{MAX_COMMENT_LENGTH}
          </div>
        )}
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
              onReply: handleReply,
              onDelete: handleDeleteComment
            }}
            showDeleteButton={currentUserId === comment.userId} // 只有当前用户的评论才显示删除按钮
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

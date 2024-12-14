"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { useWordCount } from "../WritingPage/useWordCount";

interface CommentSectionProps {
  bookId: number;
  isLoggedIn: boolean;
  onLogin: () => void;
  currentUserId: number | null;
  onCommentCountChange?: (newCount: number) => void;
}

const MAX_COMMENT_LENGTH = 1000;

const CommentSection: React.FC<CommentSectionProps> = ({
  bookId,
  isLoggedIn,
  onLogin,
  currentUserId,
  onCommentCountChange
}) => {
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const commentsPerPage = 20;
  const { t, isLoaded } = useTranslation("book");

  const {
    text: newComment,
    wordCount,
    handleTextChange,
    isMaxLength
  } = useWordCount("", MAX_COMMENT_LENGTH);

  const fetchComments = useCallback(
    async (page: number) => {
      // 避免重复加载
      if (loading) return;

      setLoading(true);
      try {
        const response = await getBookComments(bookId, page, commentsPerPage);
        if (response.code === 200 && "data" in response) {
          setComments(response.data.dataList);
          setTotalPages(response.data.totalPage);
        } else {
          throw new Error(response.msg);
        }
      } catch (err) {
        setError(t("failedToLoadComments"));
      } finally {
        setLoading(false);
      }
    },
    [bookId, t]
  );

  useEffect(() => {
    fetchComments(1);
  }, [bookId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (isMaxLength) {
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
      if (response.code === 200 && "data" in response) {
        const newCommentData = {
          ...response.data,
          replies: [],
          replyCount: 0
        };
        setComments([newCommentData, ...comments]);
        handleTextChange("");
        onCommentCountChange?.(comments.length + 1);
      } else {
        throw new Error(response.msg);
      }
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
      if (response.code === 200 && "data" in response) {
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
      } else {
        throw new Error(response.msg);
      }
    } catch (err) {
      setError(t("replyFailed"));
    }
  };

  const handleDeleteComment = async (
    commentId: number,
    isReply: boolean = false
  ) => {
    try {
      const response = await deleteComment(commentId);
      if (response.code === 200) {
        if (isReply) {
          setComments(
            comments.map((comment) => ({
              ...comment,
              replies:
                comment.replies?.filter((reply) => reply.id !== commentId) ||
                [],
              replyCount: (
                comment.replies?.filter((reply) => reply.id !== commentId) || []
              ).length
            }))
          );
        } else {
          setComments(comments.filter((comment) => comment.id !== commentId));
          onCommentCountChange?.(comments.length - 1);
        }
      } else {
        throw new Error(response.msg);
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

      if (response.code === 200 && "data" in response) {
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
      } else {
        throw new Error(response.msg);
      }
    } catch (err) {
      setError(t("likeFailed"));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isLoaded) {
    return <BookContentSkeleton />;
  }

  return (
    <div className="my-5 md:my-10 px-4 md:px-0">
      <form onSubmit={handleSubmitComment} className="mb-6 flex flex-col">
        <textarea
          value={newComment}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={t("leaveComment")}
          className={`w-full md:w-1/2 p-2 border rounded text-neutral-600 focus:outline-none ${
            isMaxLength ? "border-red-500" : ""
          }`}
          rows={3}
        />
        {newComment && (
          <div
            className={`text-sm mt-1 ${
              isMaxLength ? "text-red-500" : "text-gray-500"
            }`}
          >
            {wordCount}/{MAX_COMMENT_LENGTH}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || isMaxLength || !newComment.trim()}
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
            showDeleteButton={currentUserId === comment.userId}
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

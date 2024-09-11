"use client";
import React, { useState, useEffect } from "react";
import { CommentInfo } from "@/app/lib/definitions";
import {
  getBookComments,
  addCommentOrReply,
  likeComment
} from "@/app/lib/action";

import Alert from "../Alert";
import CommentItem from "../CommentItem";
import Pagination from "../Pagination";

interface CommentSectionProps {
  bookId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ bookId }) => {
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const commentsPerPage = 20;

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
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await addCommentOrReply(bookId, newComment);
      setComments([response.data, ...comments]);
      setNewComment("");
      // Refresh the first page to show the new comment
      fetchComments(1);
    } catch (err) {
      setError("添加评论失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: number, content: string) => {
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
      setError("回复失败，请稍后重试");
    }
  };

  const handleLike = async (commentId: number) => {
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
      setError("点赞失败，请稍后重试");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-neutral-600 mb-4">留言评论</h2>

      <form onSubmit={handleSubmitComment} className="mb-6 flex flex-col">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="新留言..."
          className="w-1/2 p-2 border rounded text-neutral-600 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 w-24 bg-orange-400 text-white rounded hover:bg-orange-500 disabled:bg-neutral-400"
        >
          {loading ? "提交中..." : "添加留言"}
        </button>
      </form>

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      {loading && <p>Loading comments...</p>}

      <div className="mb-20">
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CommentSection;

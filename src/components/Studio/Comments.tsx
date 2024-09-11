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
import CommentItem from "../CommentItem";
import { useUserInfo } from "../useUserInfo";
import WorkContentSkeleton from "./Skeleton/WorkContentSkeleton";
import Alert from "../Alert";
import Pagination from "../Pagination";
import { getImageUrl } from "@/app/lib/imageUrl";
import Image from "next/image";
import CommentsSkeleton from "./Skeleton/CommentsSkeleton";

const ITEMS_PER_PAGE = 10;

interface CommentsData {
  comments: CommentInfo[];
  books: BookInfo[];
}

const Comments: React.FC = () => {
  const { user } = useUserInfo();
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsData, setCommentsData] = useState<CommentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 注释：获取所有评论数据
  const fetchComments = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const booksResponse = await fetchBooksList(userId, 1, 1000, "published");
      const allBooks = booksResponse.data.dataList;
      const allComments: CommentInfo[] = [];

      for (const book of allBooks) {
        const commentsResponse = await getBookComments(book.id, 1, 1000); // 获取所有评论
        allComments.push(...commentsResponse.data.dataList);
      }

      setCommentsData({
        comments: allComments,
        books: allBooks
      });
    } catch (err) {
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

  // 分页评论
  const paginatedComments = useMemo(() => {
    if (!commentsData) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return commentsData.comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [commentsData, currentPage]);

  // 总页数
  const totalPages = useMemo(() => {
    if (!commentsData) return 0;
    return Math.ceil(commentsData.comments.length / ITEMS_PER_PAGE);
  }, [commentsData]);

  // 注释：处理点赞操作
  const handleLike = async (commentId: number) => {
    if (!user?.id) return;
    try {
      await likeComment(commentId);
      setAlertInfo({ message: "点赞成功！", type: "success" });
      fetchComments(user.id);
    } catch (error) {
      setAlertInfo({ message: "点赞失败，请稍后重试", type: "error" });
    }
  };

  // 注释：处理回复操作
  const handleReply = async (commentId: number, content: string) => {
    if (!user?.id || !commentsData) return;
    try {
      const bookId = commentsData.comments.find(
        (c) => c.id === commentId
      )?.bookId;
      if (!bookId) throw new Error("Book ID not found");
      await addCommentOrReply(bookId, content, commentId);
      setAlertInfo({ message: "回复成功！", type: "success" });
      fetchComments(user.id);
    } catch (error) {
      setAlertInfo({ message: "回复失败，请稍后重试", type: "error" });
    }
  };

  // 注释：处理删除操作
  const handleDelete = async (commentId: number) => {
    if (!user?.id) return;
    try {
      await deleteComment(commentId);
      setAlertInfo({ message: "评论已删除！", type: "success" });
      fetchComments(user.id);
    } catch (error) {
      setAlertInfo({ message: "删除失败，请稍后重试", type: "error" });
    }
  };

  // 注释：处理拉黑用户操作
  const handleBlock = async (userId: number) => {
    if (!user?.id || !commentsData) return;
    try {
      const bookId = commentsData.books[0]?.id;
      if (!bookId) throw new Error("No books available");
      await blockUserInBook(userId, bookId);
      setAlertInfo({ message: "用户已被拉黑！", type: "success" });
      fetchComments(user.id);
    } catch (error) {
      setAlertInfo({ message: "拉黑用户失败，请稍后重试", type: "error" });
    }
  };

  // 注释：处理页码变化
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

  if (!commentsData) {
    return <div>No comments available.</div>;
  }

  return (
    <div className="container mx-auto px-10">
      <h1 className="text-2xl font-bold pb-6 border-b">评论管理</h1>
      <ul className="divide-y divide-gray-200 ">
        {paginatedComments.map((comment: CommentInfo) => {
          const book = commentsData.books.find(
            (b: BookInfo) => b.id === comment.bookId
          );
          return (
            <li key={comment.id} className="flex ">
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
                    src={getImageUrl(book.coverImageUrl)}
                    width={400}
                    height={600}
                    alt={`${book.title} cover`}
                    className="w-16 h-20 object-cover"
                    onError={(e) => {
                      console.error(`图片加载失败: ${book.coverImageUrl}`);
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

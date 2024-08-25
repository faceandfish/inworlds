import React, { useState, useEffect } from "react";
import { CommentInfo, BookInfo, UserInfo } from "@/app/lib/definitions";
import {
  blockUser,
  deleteComment,
  fetchBooksList,
  getBookComments,
  getUserInfo,
  likeComment,
  replyToComment
} from "@/app/lib/action";
import CommentItem from "../CommentItem";

const Comments: React.FC = () => {
  const [comments, setComments] = useState<CommentInfo[]>([]);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 获取用户信息
        const userResponse = await getUserInfo();
        if (userResponse.code !== 200 || !userResponse.data) {
          throw new Error("获取用户信息失败");
        }
        setUser(userResponse.data);

        // 获取所有书籍
        const booksResponse = await fetchBooksList(
          userResponse.data.id,
          1,
          20,
          "published"
        );
        const booksWithComments = booksResponse.data.dataList.filter(
          (book) => book.commentsCount > 0
        );
        setBooks(booksWithComments);

        // 获取所有书籍的评论
        const allComments: CommentInfo[] = [];
        for (const book of booksResponse.data.dataList) {
          const commentsResponse = await getBookComments(book.id, 1, 20);
          allComments.push(...commentsResponse.data.dataList);
        }
        setComments(allComments);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取数据失败");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (id: number) => {
    try {
      await likeComment(id);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id
            ? { ...comment, likes: (comment.likes || 0) + 1 }
            : comment
        )
      );
      console.log(`Liked comment ${id}`);
    } catch (err) {
      console.error(`Error liking comment ${id}:`, err);
    }
  };

  const handleReply = async (id: number, content: string) => {
    try {
      const response = await replyToComment(id, content);
      setComments((prevComments) => [...prevComments, response.data]);
      console.log(`Replied to comment ${id}`);
    } catch (err) {
      console.error(`Error replying to comment ${id}:`, err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id)
      );
      console.log(`Deleted comment ${id}`);
    } catch (err) {
      console.error(`Error deleting comment ${id}:`, err);
    }
  };

  const handleBlock = async (userId: number) => {
    try {
      await blockUser(userId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.userId !== userId)
      );
      console.log(`Blocked user ${userId}`);
    } catch (err) {
      console.error(`Error blocking user ${userId}:`, err);
    }
  };
  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center py-4">暂无评论</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold pb-6 border-b">评论管理</h1>

      <ul className="divide-y divide-gray-200">
        {comments.map((comment) => {
          const book = books.find((b) => b.id === comment.bookId);
          return (
            <li key={comment.id} className="flex py-5">
              {/* 左侧：评论内容 */}
              <div className="w-2/3">
                <CommentItem
                  {...comment}
                  onLike={handleLike}
                  onReply={handleReply}
                  onDelete={handleDelete}
                  onBlock={handleBlock}
                />
              </div>

              {/* 右侧：相关书籍信息 */}
              {book && (
                <div className="w-1/3">
                  <div className="w-16 h-20 bg-gray-100"></div>
                  <p className="text-sm font-semibold mt-2">{book.title}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Comments;

import React from "react";
import { Comment, BookInfo } from "@/app/lib/definitions";
import CommentItem from "../CommentItem";
import { mockComments, mockBooks } from "@/mockData";

interface CommentsPageProps {
  comments: Comment[] | null | undefined;
  books: BookInfo[];
  isAdminView?: boolean;
}

const Comments: React.FC<CommentsPageProps> = () =>
  // 注释掉实际的 props
  // {
  //   comments,
  //   books,
  //   isAdminView = false,
  // }
  {
    // 使用假数据
    const comments = mockComments;
    const books = mockBooks;
    const isAdminView = false;

    const handleLike = (id: number) => {
      console.log(`Like comment ${id}`);
      // 实现点赞逻辑
    };

    const handleReply = (id: number) => {
      console.log(`Reply to comment ${id}`);
      // 实现回复逻辑
    };

    const handleDelete = (id: number) => {
      console.log(`Delete comment ${id}`);
      // 实现删除逻辑
    };

    const handleBlock = (id: number) => {
      console.log(`Block user of comment ${id}`);
      // 实现拉黑逻辑
    };

    if (!comments || comments.length === 0) {
      return <div className="text-center py-4">暂无评论</div>;
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold pb-6 border-b ">评论管理</h1>

        <ul className="divide-y divide-gray-200 ">
          {comments.map((comment) => {
            const book = books.find((b) => b.id === comment.bookId);
            return (
              <li key={comment.id} className="flex py-5">
                {/* 左侧：评论内容 */}
                <div className="w-3/4 ">
                  <CommentItem
                    {...comment}
                    onLike={handleLike}
                    onReply={handleReply}
                    onDelete={isAdminView ? handleDelete : undefined}
                    onBlock={isAdminView ? handleBlock : undefined}
                    isAdminView={isAdminView}
                  />
                </div>

                {/* 右侧：相关书籍信息 */}
                {book && (
                  <div className="w-1/4">
                    <div className="w-16 h-20 bg-gray-100 mx-auto"></div>
                    <p className="text-sm font-semibold text-center mt-2">
                      {book.title}
                    </p>
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

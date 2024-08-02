import { Comment } from "@/app/lib/definitions";
import React from "react";

interface CommentItemProps extends Comment {
  onLike?: (id: number) => void;
  onReply?: (id: number) => void;
  onDelete?: (id: number) => void;
  onBlock?: (id: number) => void;
  isAdminView?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  username,
  createdAt,
  likes,
  onLike,
  onReply,
  onDelete,
  onBlock,
  isAdminView = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")} `;
  };

  return (
    <div className="flex  py-5  justify-start gap-5">
      <div className="w-10 h-10 rounded-full bg-red-300"></div>
      <div className="flex flex-col  justify-between">
        <div>
          <p className="text-sm text-gray-400 ">
            {username} {formatDate(createdAt)}
          </p>
        </div>
        <p className="py-5">{content}</p>
        <div className="flex space-x-4 text-sm">
          {onReply && (
            <button
              onClick={() => onReply(id)}
              className="text-gray-500 hover:text-green-700"
            >
              💬 回复
            </button>
          )}
          {onLike && (
            <button
              onClick={() => onLike(id)}
              className="text-gray-500 hover:text-pink-500"
            >
              👍 点赞 ({likes})
            </button>
          )}
          {isAdminView && (
            <div className="flex space-x-2">
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ 删除
                </button>
              )}
              {onBlock && (
                <button
                  onClick={() => onBlock(id)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  🚫 拉黑
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

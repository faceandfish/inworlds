import React from "react";
import { CommentInfo } from "../app/lib/definitions";
import { FiThumbsUp, FiMessageSquare, FiTrash2, FiSlash } from "react-icons/fi";

interface CommentItemProps extends CommentInfo {
  onLike?: (id: number) => void;
  onReply?: (id: number) => void;
  onDelete?: (id: number) => void;
  onBlock?: (id: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  replyCount,
  username,
  createdAt,
  likes,
  onLike,
  onReply,
  onDelete,
  onBlock
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")} `;
  };

  return (
    <div className="flex justify-start py-5 gap-2">
      <div className="w-10 h-10 rounded-full bg-red-300"></div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-400 ">
            {username} {formatDate(createdAt)}
          </p>
        </div>
        <p className="py-5">{content}</p>
        <div className="flex space-x-10 text-sm">
          {onReply && (
            <button
              onClick={() => onReply(id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiMessageSquare className="mr-1 text-xl" /> {replyCount}
            </button>
          )}
          {onLike && (
            <button
              onClick={() => onLike(id)}
              className="text-gray-500 hover:text-red-500 flex items-center"
            >
              <FiThumbsUp className="mr-1 text-xl" /> {likes}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className=" hover:text-gray-700 text-gray-500  "
            >
              <FiTrash2 className="text-xl mr-1" />
            </button>
          )}
          {onBlock && (
            <button
              onClick={() => onBlock(id)}
              className="text-gray-500 hover:text-gray-700 "
            >
              <FiSlash className="text-xl mr-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;

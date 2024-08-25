"use client";
import React, { useState } from "react";
import { CommentInfo } from "../app/lib/definitions";
import { FiThumbsUp, FiMessageSquare, FiTrash2, FiSlash } from "react-icons/fi";
import { toast } from "react-toastify";

interface CommentItemProps extends CommentInfo {
  onLike?: (id: number) => void;
  onReply?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
  onBlock?: (userId: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  userId,
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
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleReplySubmit = async () => {
    if (onReply) {
      try {
        await onReply(id, replyContent);
        toast.success("回复成功！");
        setReplyContent("");
        setIsReplying(false);
      } catch (error) {
        toast.error("回复失败，请稍后重试");
      }
    }
  };
  const handleLike = async () => {
    if (onLike) {
      try {
        await onLike(id);
        toast.success("点赞成功！");
      } catch (error) {
        toast.error("点赞失败，请稍后重试");
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(id);
        toast.success("评论已删除！");
      } catch (error) {
        toast.error("删除失败，请稍后重试");
      }
    }
  };

  const handleBlock = async () => {
    if (onBlock) {
      try {
        await onBlock(userId);
        toast.success("用户已被拉黑！");
      } catch (error) {
        toast.error("拉黑用户失败，请稍后重试");
      }
    }
  };

  return (
    <div className="flex justify-start py-5 gap-2">
      <div className="w-10 h-10 rounded-full bg-red-300"></div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {username} {formatDate(createdAt)}
          </p>
        </div>
        <p className="py-5">{content}</p>
        <div className="flex space-x-10 text-sm">
          {onReply && (
            <button
              onClick={handleReplyClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiMessageSquare className="mr-1 text-xl" /> {replyCount}
            </button>
          )}
          {onLike && (
            <button
              onClick={handleLike}
              className="text-gray-500 hover:text-red-500 flex items-center"
            >
              <FiThumbsUp className="mr-1 text-xl" /> {likes}
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="hover:text-gray-700 text-gray-500"
            >
              <FiTrash2 className="text-xl mr-1" />
            </button>
          )}
          {onBlock && (
            <button
              onClick={handleBlock}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiSlash className="text-xl mr-1" />
            </button>
          )}
        </div>
        {isReplying && (
          <div className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="输入你的回复..."
            />
            <button
              onClick={handleReplySubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              提交回复
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

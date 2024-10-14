import React, { useState } from "react";
import { FiThumbsUp, FiMessageSquare, FiTrash2, FiSlash } from "react-icons/fi";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import Image from "next/image";
import Alert from "./Alert";
import { CommentInfo } from "../../app/lib/definitions";

interface CommentActions {
  onLike: (commentId: number) => Promise<void>;
  onReply: (commentId: number, content: string) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  onBlock?: (userId: number) => Promise<void>;
}

interface CommentItemProps {
  comment: CommentInfo;
  actions: CommentActions;
  showDeleteButton?: boolean;
  showBlockButton?: boolean;
  isTopLevel?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  actions,
  showDeleteButton = false,
  showBlockButton = false,
  isTopLevel = true
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState<() => void>(
    () => {}
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleReplyToggle = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    try {
      await actions.onReply(comment.id, replyContent);
      setReplyContent("");
    } catch (error) {
      console.error("回复失败", error);
    }
  };

  const handleLike = async () => {
    try {
      await actions.onLike(comment.id);
    } catch (error) {
      console.error("点赞失败", error);
    }
  };

  const handleDelete = () => {
    setAlertMessage("你确定要删除这条评论吗？此操作无法撤销。");
    setAlertConfirmAction(() => async () => {
      if (actions.onDelete) {
        try {
          await actions.onDelete(comment.id);
        } catch (error) {
          console.error("删除失败", error);
        }
      }
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const handleBlock = () => {
    setAlertMessage("你确定要拉黑这个用户吗？此操作可能会影响用户体验。");
    setAlertConfirmAction(() => async () => {
      if (actions.onBlock) {
        try {
          await actions.onBlock(comment.userId);
        } catch (error) {
          console.error("拉黑用户失败", error);
        }
      }
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  return (
    <div className="flex justify-start py-5 gap-2">
      <Image
        src={getAvatarUrl(comment.avatarUrl)}
        alt={comment.username}
        width={200}
        height={200}
        className="rounded-full w-10 h-10 cursor-pointer hover:brightness-90 transition-all duration-200"
      />
      <div className="flex flex-col justify-between flex-grow">
        <div className="text-neutral-400 space-x-5">
          <span>{comment.username}</span>
          <span className="text-sm">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="py-2 mb-3 pr-10">{comment.content}</p>
        <div className="flex space-x-10 text-sm">
          {isTopLevel && (
            <div className="flex space-x-10 text-sm">
              <button
                onClick={handleReplyToggle}
                className="text-gray-500 hover:text-gray-700  flex items-center"
              >
                <FiMessageSquare className="mr-1 text-xl" />{" "}
                {comment.replyCount}
              </button>
              <button
                onClick={handleLike}
                className="text-gray-500 hover:text-red-500 flex items-center"
              >
                <FiThumbsUp className="mr-1 text-xl" /> {comment.likes}
              </button>
            </div>
          )}

          {showDeleteButton && (
            <button
              onClick={handleDelete}
              className="hover:text-gray-700 text-gray-500"
            >
              <FiTrash2 className="text-xl mr-1" />
            </button>
          )}
          {showBlockButton && (
            <button
              onClick={handleBlock}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiSlash className="text-xl mr-1" />
            </button>
          )}
        </div>
        {isTopLevel && showReplies && (
          <div className="mt-2 flex flex-col">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-1/2 p-2 border focus:outline-none rounded"
              placeholder="输入你的回复..."
            />
            <button
              onClick={handleReplySubmit}
              className="mt-2 px-4 py-2 w-24 bg-neutral-400 text-white rounded hover:bg-neutral-500"
            >
              提交回复
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-8">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    actions={actions}
                    showDeleteButton={showDeleteButton}
                    showBlockButton={showBlockButton}
                    isTopLevel={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showAlert && (
        <Alert
          message={alertMessage}
          type="error"
          onClose={() => setShowAlert(false)}
          customButton={{
            text: "确认",
            onClick: alertConfirmAction
          }}
          autoClose={false}
        />
      )}
    </div>
  );
};

export default CommentItem;

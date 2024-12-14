import React, { useState } from "react";
import { FiThumbsUp, FiMessageSquare, FiTrash2, FiSlash } from "react-icons/fi";
import Image from "next/image";
import Alert from "./Alert";
import { CommentInfo } from "../../app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { useWordCount } from "../WritingPage/useWordCount";
import { logger } from "./logger";

interface CommentActions {
  onLike: (commentId: number, isLiked: boolean) => Promise<void>;
  onReply: (commentId: number, content: string) => Promise<void>;
  onDelete?: (commentId: number, isReply: boolean) => Promise<void>;
  onBlock?: (userId: number) => Promise<void>;
}

interface CommentItemProps {
  comment: CommentInfo;
  actions: CommentActions;
  showDeleteButton?: boolean;
  showBlockButton?: boolean;
  isTopLevel?: boolean;
  currentUserId?: number | null;
}

const MAX_COMMENT_LENGTH = 1000; // 最大评论字数

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  actions,
  showDeleteButton = false,
  showBlockButton = false,
  isTopLevel = true,
  currentUserId
}) => {
  const { t } = useTranslation("book");
  const [showReplies, setShowReplies] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState<() => void>(
    () => {}
  );

  const {
    text: replyContent,
    wordCount,
    handleTextChange,
    isMaxLength
  } = useWordCount("", MAX_COMMENT_LENGTH);

  const handleReplyToggle = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    if (isMaxLength) {
      return;
    }
    try {
      await actions.onReply(comment.id, replyContent);
      handleTextChange(""); // 清空回复内容
    } catch (error) {
      logger.error("handleReplySubmit", error, {
        context: "handleReplySubmit"
      });
    }
  };

  const handleLike = async () => {
    try {
      await actions.onLike(comment.id, !comment.isLiked);
    } catch (error) {
      logger.error("handleLike", error, {
        context: "handleLike"
      });
    }
  };

  const handleDelete = () => {
    setAlertMessage(t("comment.deleteConfirm"));
    setAlertConfirmAction(() => async () => {
      if (actions.onDelete) {
        try {
          await actions.onDelete(comment.id, !isTopLevel);
        } catch (error) {
          logger.error("handleDelete", error, {
            context: "handleDelete"
          });
        }
      }
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const handleBlock = () => {
    setAlertMessage(t("comment.blockConfirm"));
    setAlertConfirmAction(() => async () => {
      if (actions.onBlock) {
        try {
          await actions.onBlock(comment.userId);
        } catch (error) {
          logger.error("handleBlock", error, {
            context: "handleBlock"
          });
        }
      }
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  return (
    <div className="flex justify-start py-5 gap-2">
      <Image
        src={comment.avatarUrl || "/defaultImg.png"}
        alt={comment.username || "username"}
        width={200}
        height={200}
        className="rounded-full w-10 h-10 cursor-pointer hover:brightness-90 transition-all duration-200"
      />
      <div className="flex flex-col justify-between flex-grow">
        <div className="text-neutral-400 space-x-5">
          <span>{comment.username}</span>
          <span className="text-sm">{comment.createdAt}</span>
        </div>
        <p className="py-2 mb-3 pr-10">{comment.content}</p>
        <div className="flex space-x-10 text-sm">
          <div className="flex space-x-10 text-sm">
            {isTopLevel && (
              <button
                onClick={handleReplyToggle}
                className="text-gray-500 hover:text-orange-500 flex items-center"
              >
                <FiMessageSquare className="mr-1 text-xl" />{" "}
                {comment.replyCount}
              </button>
            )}
            <button
              onClick={handleLike}
              className={`flex items-center ${
                comment.isLiked
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <FiThumbsUp className="mr-1 text-xl" /> {comment.likes}
            </button>
          </div>

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
              onChange={(e) => handleTextChange(e.target.value)}
              className={`w-1/2 p-2 border rounded focus:outline-none ${
                isMaxLength ? "border-red-500" : "border-gray-200"
              }`}
              placeholder={t("comment.enterReply")}
            />
            <div className="mt-1 text-sm">
              {isMaxLength ? (
                <span className="text-red-500">
                  {t("comment.exceedLimit", { max: MAX_COMMENT_LENGTH })}
                </span>
              ) : (
                <span
                  className={`text-gray-500 ${
                    wordCount > MAX_COMMENT_LENGTH * 0.8
                      ? "text-orange-500"
                      : ""
                  }`}
                >
                  {t("comment.characterCount", {
                    current: wordCount,
                    max: MAX_COMMENT_LENGTH
                  })}
                </span>
              )}
            </div>
            <button
              onClick={handleReplySubmit}
              disabled={isMaxLength || !replyContent.trim()}
              className={`mt-2 px-4 py-2 w-24 rounded text-white
                ${
                  isMaxLength || !replyContent.trim()
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500"
                }`}
            >
              {t("comment.submitReply")}
            </button>
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
              <div className="mt-4 ml-8">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    actions={actions}
                    currentUserId={currentUserId}
                    showDeleteButton={currentUserId === reply.userId}
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
            text: t("comment.confirm"),
            onClick: alertConfirmAction
          }}
          autoClose={false}
        />
      )}
    </div>
  );
};

export default CommentItem;

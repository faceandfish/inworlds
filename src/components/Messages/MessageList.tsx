import React, { useEffect, useRef } from "react";
import { Message, SystemNotification, UserInfo } from "@/app/lib/definitions";
import { BiBell } from "react-icons/bi";

interface MessageListProps {
  messages: Message[];
  currentUser: UserInfo;
  systemNotifications: SystemNotification[];
  isViewingSystemMessages: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  systemNotifications,
  isViewingSystemMessages,
}) => {
  // 新增: 创建 ref 和 scrollToBottom 函数
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 新增: 使用 useEffect 在消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, systemNotifications]);

  return (
    <div className="flex-grow overflow-y-auto h-80">
      {isViewingSystemMessages ? (
        // 系统通知区域
        <div className="p-4 divide-y bg ">
          {systemNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start py-4 first:pt-0 last:pb-0"
            >
              <div className="bg-orange-500 rounded-full p-2 mr-3 flex-shrink-0">
                <BiBell size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-600">系统通知</h3>
                <div className="bg-white max-w-[70%] p-3 rounded-lg  text-gray-800 rounded-tl-none">
                  <p className="text-sm text-gray-600">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* 新增: 添加引用元素 */}
        </div>
      ) : (
        // 普通消息列表
        <div className="flex-grow p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-br-none "
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} /> {/* 新增: 添加引用元素 */}
        </div>
      )}
    </div>
  );
};

export default MessageList;

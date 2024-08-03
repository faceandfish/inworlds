"use client";

import React, { useState, useEffect } from "react";
import {
  MessagingState,
  Conversation,
  Message,
  UserInfo,
  SystemNotification, // 新增：导入 SystemNotification 类型
} from "@/app/lib/definitions";
import Navbar from "@/components/Navbar";
import ConversationList from "@/components/Messages/ConversationList";
import MessageList from "@/components/Messages/MessageList";
import MessageInput from "@/components/Messages/MessageInput";
import {
  getCurrentUser,
  mockConversations,
  mockMessages,
  mockUsers,
  mockSystemNotifications,
} from "@/mockData";

const MessagingPage: React.FC = () => {
  const [messagingState, setMessagingState] = useState<MessagingState>({
    conversations: [],
    selectedConversation: null,
    messages: [],
    systemNotifications: [], // 新增：在 MessagingState 中添加 systemNotifications
  });

  const [isViewingSystemMessages, setIsViewingSystemMessages] = useState(true);
  const currentUser = getCurrentUser();
  const useMockData = true; // 设置为 false 以使用动态数据

  useEffect(() => {
    if (useMockData) {
      // 使用模拟数据初始化会话列表
      setMessagingState((prev) => ({
        ...prev,
        conversations: mockConversations,
        systemNotifications: mockSystemNotifications,
        messages: [],
      }));
    } else {
      // 原有的动态数据获取逻辑
      // fetchConversations().then(conversations => setMessagingState(prev => ({ ...prev, conversations })));
      // 新增：获取系统通知的逻辑
      // fetchSystemNotifications().then(notifications => setMessagingState(prev => ({ ...prev, systemNotifications: notifications })));
    }
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setIsViewingSystemMessages(false);
    setMessagingState((prev) => ({
      ...prev,
      selectedConversation: conversation,
    }));

    if (useMockData) {
      // 使用模拟数据
      setMessagingState((prev) => ({
        ...prev,
        messages: mockMessages.filter(
          (msg) =>
            conversation.participants.includes(msg.senderId) &&
            conversation.participants.includes(msg.receiverId)
        ),
      }));
    } else {
      // 原有的动态数据获取逻辑
      // fetchMessages(conversation.id).then(messages => setMessagingState(prev => ({ ...prev, messages })));
    }
  };

  const handleSendMessage = (content: string) => {
    if (messagingState.selectedConversation) {
      const newMessage: Message = {
        id: Date.now(), // 使用时间戳作为临时ID
        senderId: currentUser.id,
        receiverId:
          messagingState.selectedConversation.participants.find(
            (id) => id !== currentUser.id
          ) || 0,
        content: content,
        createdAt: new Date().toISOString(),
      };
      if (useMockData) {
        // 使用模拟数据
        setMessagingState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
          conversations: prev.conversations.map((conv) =>
            conv.id === prev.selectedConversation?.id
              ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
              : conv
          ),
        }));
      } else {
        // 原有的发送消息逻辑
        // sendMessage({ senderId: currentUser.id, receiverId: messagingState.selectedConversation.participants[0], content })
        //   .then(newMessage => setMessagingState(prev => ({ ...prev, messages: [...prev.messages, newMessage] })));
      }
    }
  };
  const getOtherUser = (conversation: Conversation): UserInfo => {
    const otherUserId = conversation.participants.find(
      (id) => id !== currentUser.id
    );
    const otherUser = mockUsers.find((user) => user.id === otherUserId);
    if (!otherUser) {
      throw new Error("Invalid conversation: other user not found");
    }
    return otherUser;
  };
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const handleClearUnread = (conversationId: number) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleViewSystemMessages = () => {
    setIsViewingSystemMessages(true);
    setMessagingState((prev) => ({
      ...prev,
      selectedConversation: null,
      messages: [],
    }));
  };

  return (
    <div className="w-full h-screen bg-orange-400">
      <Navbar />
      <div className="flex gap-5 justify-center  mt-3">
        <ConversationList
          conversations={messagingState.conversations}
          onSelectConversation={handleSelectConversation}
          currentUser={currentUser}
          getOtherUser={getOtherUser}
          onClearUnread={handleClearUnread}
          onViewSystemMessages={handleViewSystemMessages}
        />
        <div className="bg-white shadow w-3/5 ">
          <h2 className="text-gray-500 font-light px-5 py-3 border-b border-gray-100">
            {isViewingSystemMessages
              ? "系统消息"
              : messagingState.selectedConversation
              ? getOtherUser(messagingState.selectedConversation).name
              : "选择一个对话"}
          </h2>
          <div className="bg-gray-200 ">
            <MessageList
              messages={messagingState.messages}
              currentUser={currentUser}
              systemNotifications={messagingState.systemNotifications}
              isViewingSystemMessages={isViewingSystemMessages}
            />

            {isViewingSystemMessages ? (
              <div className="h-[124px] bg-white"></div> // 占位 div，高度与 MessageInput 组件相同
            ) : (
              <MessageInput onSendMessage={handleSendMessage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;

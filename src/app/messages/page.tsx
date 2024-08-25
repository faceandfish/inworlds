"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessagingState,
  Conversation,
  Message,
  UserInfo,
  SystemNotification,
  PaginatedData
} from "@/app/lib/definitions";
import Navbar from "@/components/Navbar";
import ConversationList from "@/components/Messages/ConversationList";
import MessageList from "@/components/Messages/MessageList";
import MessageInput from "@/components/Messages/MessageInput";
import {
  fetchConversations,
  fetchMessages,
  fetchSystemNotifications,
  markConversationAsRead,
  sendMessage,
  getUserById
} from "../lib/action";
import { useUserInfo } from "@/components/useUserInfo";

const MessagingPage: React.FC = () => {
  const { user } = useUserInfo();
  const [messagingState, setMessagingState] = useState<MessagingState>({
    conversations: [],
    selectedConversation: null,
    messages: [],
    systemNotifications: []
  });
  const [isViewingSystemMessages, setIsViewingSystemMessages] = useState(true);
  const [conversationsPage, setConversationsPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [otherUsers, setOtherUsers] = useState<Record<number, UserInfo>>({});

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [conversationsData, notificationsData] = await Promise.all([
          fetchConversations(conversationsPage),
          fetchSystemNotifications(notificationsPage)
        ]);

        setMessagingState((prev) => ({
          ...prev,
          conversations: conversationsData.dataList,
          systemNotifications: notificationsData.dataList
        }));

        // 获取所有对话中其他用户的信息
        const otherUserIds = new Set(
          conversationsData.dataList.flatMap((conv) =>
            conv.participants.filter((id) => id !== user?.id)
          )
        );

        const userInfoPromises = Array.from(otherUserIds).map(getUserById);
        const userInfos = await Promise.all(userInfoPromises);

        setOtherUsers(
          userInfos.reduce((acc, userInfo) => {
            acc[userInfo.id] = userInfo;
            return acc;
          }, {} as Record<number, UserInfo>)
        );
      } catch (error) {
        console.error("初始化数据时出错:", error);
      }
    };

    if (user) {
      initializeData();
    }
  }, [conversationsPage, notificationsPage, user]);

  const handleSelectConversation = useCallback(
    async (conversation: Conversation) => {
      setIsViewingSystemMessages(false);
      setMessagingState((prev) => ({
        ...prev,
        selectedConversation: conversation
      }));

      try {
        const messagesData = await fetchMessages(conversation.id, messagesPage);
        setMessagingState((prev) => ({
          ...prev,
          messages: messagesData.dataList
        }));
        await markConversationAsRead(conversation.id);
      } catch (error) {
        console.error("获取消息时出错:", error);
      }
    },
    [messagesPage]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (messagingState.selectedConversation && user) {
        const otherUserId =
          messagingState.selectedConversation.participants.find(
            (id) => id !== user.id
          );
        if (!otherUserId) {
          console.error("无法找到接收者ID");
          return;
        }

        try {
          const sentMessage = await sendMessage({
            senderId: user.id,
            receiverId: otherUserId,
            content: content
          });
          setMessagingState((prev) => ({
            ...prev,
            messages: [...prev.messages, sentMessage],
            conversations: prev.conversations.map((conv) =>
              conv.id === prev.selectedConversation?.id
                ? { ...conv, lastMessage: sentMessage }
                : conv
            )
          }));
        } catch (error) {
          console.error("发送消息时出错:", error);
        }
      }
    },
    [messagingState.selectedConversation, user]
  );

  const getOtherUser = useCallback(
    (conversation: Conversation): UserInfo | null => {
      const otherUserId = conversation.participants.find(
        (id) => id !== user?.id
      );
      return otherUserId ? otherUsers[otherUserId] || null : null;
    },
    [user, otherUsers]
  );

  const handleClearUnread = useCallback(async (conversationId: number) => {
    try {
      await markConversationAsRead(conversationId);
      setMessagingState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      }));
    } catch (error) {
      console.error("标记对话为已读时出错:", error);
    }
  }, []);

  const handleViewSystemMessages = useCallback(() => {
    setIsViewingSystemMessages(true);
    setMessagingState((prev) => ({
      ...prev,
      selectedConversation: null,
      messages: []
    }));
  }, []);

  if (!user) {
    return <div>加载中...</div>;
  }

  return (
    <div className="w-full h-screen bg-orange-400">
      <Navbar />
      <div className="flex gap-5 justify-center mt-3">
        <ConversationList
          conversations={messagingState.conversations}
          onSelectConversation={handleSelectConversation}
          currentUser={user}
          getOtherUser={getOtherUser}
          onClearUnread={handleClearUnread}
          onViewSystemMessages={handleViewSystemMessages}
        />
        <div className="bg-white shadow w-3/5">
          <h2 className="text-gray-500 font-light px-5 py-3 border-b border-gray-100">
            {isViewingSystemMessages
              ? "系统消息"
              : messagingState.selectedConversation
              ? getOtherUser(messagingState.selectedConversation)
                  ?.displayName || "未知用户"
              : "选择一个对话"}
          </h2>
          <div className="bg-gray-200">
            <MessageList
              messages={messagingState.messages}
              currentUser={user}
              systemNotifications={messagingState.systemNotifications}
              isViewingSystemMessages={isViewingSystemMessages}
            />
            {isViewingSystemMessages ? (
              <div className="h-[124px] bg-white"></div>
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

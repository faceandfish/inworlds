import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUnreadNotificationCount,
  markNotificationAsRead
} from "@/app/lib/action";

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // 只在首次加载时获取一次初始数据
  useEffect(() => {
    const initializeUnreadCount = async () => {
      try {
        const response = await getUnreadNotificationCount();
        console.log("getUnreadNotificationCount", response);
        if (response.code === 200) {
          setUnreadCount(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial unread count:", error);
      }
    };

    initializeUnreadCount();
  }, []);

  const markAllAsRead = async () => {
    try {
      const response = await markNotificationAsRead();
      console.log("markNotificationAsRead:", response);
      if (response.code === 200) {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const value = {
    unreadCount,
    setUnreadCount, // 这个方法将用于接收后端推送的新数据
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

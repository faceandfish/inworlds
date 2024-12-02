import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUnreadNotificationCount,
  markNotificationAsRead
} from "@/app/lib/action";
import { useUser } from "./UserContextProvider";
import { logger } from "./Main/logger";

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
  const { user } = useUser();

  // 只在首次加载时获取一次初始数据
  useEffect(() => {
    const initializeUnreadCount = async () => {
      try {
        const response = await getUnreadNotificationCount();

        if (response.code === 200 && "data" in response) {
          setUnreadCount(response.data);
        }
      } catch (error) {
        logger.error("Failed to fetch initial unread count", error, {
          context: "NotificationProvider"
        });
      }
    };

    initializeUnreadCount();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const response = await markNotificationAsRead();

      if (response.code === 200) {
        setUnreadCount(0);
      }
    } catch (error) {
      logger.error("Failed to mark notifications as read", error, {
        context: "NotificationProvider"
      });
    }
  };

  const value = {
    unreadCount,
    setUnreadCount,
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

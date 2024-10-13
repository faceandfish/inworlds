// components/NotificationCard.tsx
import React from "react";
import { SystemNotification } from "@/app/lib/definitions";

const NotificationCard: React.FC<SystemNotification> = ({
  isRead,
  content,
  createdAt
}) => (
  <div
    className={`p-3 rounded-lg text-sm ${
      isRead ? "bg-gray-50" : "bg-orange-50"
    }`}
  >
    <p className={isRead ? "text-gray-700" : "text-orange-700"}>{content}</p>
    <p className="text-xs text-gray-500 mt-1">
      {new Date(createdAt).toLocaleString()}
    </p>
  </div>
);

export default NotificationCard;

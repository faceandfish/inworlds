import React from "react";
import {
  BookOpenIcon,
  UserGroupIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import { useTranslation } from "../useTranslation";
import { useNotification } from "../NotificationContext";
import { NotificationBadge } from "../Main/NotificationBadge";

export type SectionType = "books" | "authors" | "notifications";

interface MenuItem {
  key: SectionType;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { t } = useTranslation("message");
  const { unreadCount } = useNotification();

  const menuItems: MenuItem[] = [
    { key: "books", name: t("sidebar.favoriteBooks"), icon: BookOpenIcon },
    { key: "authors", name: t("sidebar.followedUsers"), icon: UserGroupIcon },
    {
      key: "notifications",
      name: t("sidebar.systemNotifications"),
      icon: BellIcon,
      badge: unreadCount
    }
  ];

  return (
    <div className="bg-orange-50 p-4 md:h-full md:fixed md:top-16 md:w-64">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        {t("sidebar.messageCenter")}
      </h1>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.key} className="mb-2">
              <button
                onClick={() => onSectionChange(item.key)}
                className={`flex items-center w-full p-2 rounded-lg  ${
                  activeSection === item.key
                    ? "bg-orange-500 text-white"
                    : "text-neutral-600 hover:bg-orange-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
                {item.key === "notifications" && (
                  <NotificationBadge count={unreadCount} className="ml-2" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

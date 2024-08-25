import React from "react";
import {
  UserCircleIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection
}) => {
  const menuItems: MenuItem[] = [
    { id: "profile", name: "个人资料", icon: UserCircleIcon },
    { id: "avatar", name: "头像管理", icon: CameraIcon },
    { id: "account", name: "账户设置", icon: CogIcon },
    { id: "security", name: "安全设置", icon: ShieldCheckIcon },
    { id: "notifications", name: "通知设置", icon: BellIcon }
  ];

  return (
    <div className="w-64 bg-orange-50 p-4">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-600 hover:bg-orange-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

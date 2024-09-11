import React from "react";
import {
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiOutlineChatBubbleBottomCenterText
} from "react-icons/hi2";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import { UserInfo } from "@/app/lib/definitions";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: UserInfo;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  user
}) => {
  const navItems = [
    { id: "works", label: "作品内容", icon: HiOutlineDocumentText },
    { id: "analysis", label: "数据分析", icon: HiOutlineChartBarSquare },
    {
      id: "comments",
      label: "评论",
      icon: HiOutlineChatBubbleBottomCenterText
    },
    { id: "copyright", label: "版权", icon: AiOutlineCopyrightCircle },
    { id: "income", label: "收入", icon: MdAttachMoney }
  ];

  return (
    <nav className="w-64 bg-white pt-10">
      <div className="mb-5 flex gap-5 flex-col items-center">
        <Image
          src={getAvatarUrl(user.avatarUrl || "")}
          alt={user.username || "用户头像"}
          width={200}
          height={200}
          className="rounded-full object-cover w-24 h-24"
        />
        <p className="text-neutral-700">{user.displayName || user.username}</p>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              flex items-center gap-3 ml-5 pl-5 py-3 cursor-pointer transition-colors duration-200
              ${
                activeSection === item.id
                  ? "bg-orange-400 text-white"
                  : "text-neutral-600 hover:bg-orange-100"
              }
            `}
          >
            <item.icon className="text-2xl" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Sidebar;

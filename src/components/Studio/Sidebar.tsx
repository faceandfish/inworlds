"use client";
import React, { useEffect, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiOutlineChatBubbleBottomCenterText
} from "react-icons/hi2";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import { useUserInfo } from "../useUserInfo";
import WorkContent from "./WorkContent";
import DataAnalysis from "./DataAnalysis";
import Comments from "./Comments";
import Copyright from "./Copyright";
import Income from "./Income";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";

const sidebarItems = [
  { icon: HiOutlineDocumentText, text: "作品內容" },
  { icon: HiOutlineChartBarSquare, text: "數據分析" },
  { icon: HiOutlineChatBubbleBottomCenterText, text: "評論" },
  { icon: AiOutlineCopyrightCircle, text: "版權" },
  { icon: MdAttachMoney, text: "收入" }
];

const Sidebar = () => {
  const { user } = useUserInfo();
  const [selectedItem, setSelectedItem] = useState(0);
  const [comments, setComments] = useState([]);
  const [books, setBooks] = useState([]);

  const handleItemClick = (index: any) => {
    setSelectedItem(index);
  };

  if (!user) {
    return;
  }
  // 假设有这样的 API 函数
  // useEffect(() => {
  //   fetchComments().then(setComments);
  //   fetchBooks().then(setBooks);
  // }, []);

  return (
    <div className="flex h-screen  bg-gray-50">
      <div className="w-64 bg-white  pt-10">
        <div className="mb-5 flex gap-5 flex-col items-center">
          <Image
            src={getAvatarUrl(user.avatarUrl)}
            alt={user!.displayName || "用户头像"}
            width={200}
            height={200}
            className="rounded-full object-cover w-24 h-24"
          />
          <p>{user?.username}笔名</p>
        </div>

        <ul>
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-5 px-6 py-4 cursor-pointer transition-colors duration-200 ${
                selectedItem === index
                  ? "bg-orange-50 text-black font-medium"
                  : "text-gray-700 hover:bg-orange-50"
              }`}
              onClick={() => handleItemClick(index)}
            >
              <item.icon
                className={`text-2xl ${
                  selectedItem === index ? "text-black" : "text-gray-500"
                }`}
              />
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-white pt-10">
        {selectedItem === 0 && <WorkContent />}
        {selectedItem === 1 && <DataAnalysis />}
        {selectedItem === 2 && <Comments />}
        {selectedItem === 3 && <Copyright />}
        {selectedItem === 4 && <Income />}
      </div>
    </div>
  );
};

export default Sidebar;

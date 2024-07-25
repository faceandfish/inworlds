"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  PencilIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface SidebarOption {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: "intro",
    title: "编辑简介",
    icon: PencilIcon,
  },
  {
    id: "cover",
    title: "添加细节",
    icon: PhotoIcon,
  },
  {
    id: "content",
    title: "编辑正文",
    icon: DocumentTextIcon,
  },
  {
    id: "authornote",
    title: "作者有话说",
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

const WritingSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleOptionClick = (id: string) => {
    router.push(`/write/${id}`);
  };

  return (
    <>
      <div className="w-64   p-6 bg-gray-100 flex flex-col  items-center ">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">开始创作吧</h2>
        <ul className="space-y-4 mb-8">
          {sidebarOptions.map((option) => {
            console.log("Current option:", option);
            console.log("Icon type:", typeof option.icon);

            return (
              <li key={option.id}>
                <Link href={`/write/${option.id}`}>
                  <div
                    onClick={() => handleOptionClick(option.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      pathname === `/write/${option.id}`
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <option.icon className="h-6 w-6" />

                    <span className="font-medium">{option.title}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-gray-200 pt-4">
          <div className="text-gray-600 mb-4">
            <div className="flex items-center mb-2">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              <span> 字</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>上次保存: </span>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200">
              保存草稿
            </button>
            <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
              发布文章
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WritingSidebar;

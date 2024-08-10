"use client";
import React from "react";
import {
  PencilIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { BookInfo } from "@/app/lib/definitions";

interface SidebarOption {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: "intro",
    title: "编辑简介",
    icon: PencilIcon
  },
  {
    id: "cover",
    title: "添加细节",
    icon: PhotoIcon
  },
  {
    id: "content",
    title: "编辑正文",
    icon: DocumentTextIcon
  },
  {
    id: "authornote",
    title: "作者有话说",
    icon: ChatBubbleBottomCenterTextIcon
  }
];

interface WritingSidebarProps {
  publishStatus: BookInfo["publishStatus"];
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
}

const WritingSidebar: React.FC<WritingSidebarProps> = ({
  publishStatus,
  onSaveDraft,
  onPublish
}) => {
  const handleOptionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    try {
      await onSaveDraft();
      toast.success("草稿已保存");
    } catch (error) {
      console.error("保存草稿失败:", error);
      toast.error("保存草稿失败，请重试");
    }
  };

  const handlePublish = async () => {
    try {
      await onPublish();
      toast.success("文章已发布");
    } catch (error) {
      console.error("发布文章失败:", error);
      toast.error("发布文章失败，请重试");
    }
  };

  return (
    <div className="w-64 h-screen  flex-shrink-0">
      <div className="w-64 min-h-screen p-6  flex flex-col items-center fixed left-0 top-0 pt-16 ">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">开始创作吧</h2>
        <ul className="space-y-4 mb-8">
          {sidebarOptions.map((option) => (
            <li key={option.id}>
              <button
                onClick={() => handleOptionClick(option.id)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 hover:text-white hover:bg-orange-400"
              >
                <option.icon className="h-6 w-6" />
                <span className="font-medium">{option.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 pt-10 w-full">
          <div className="space-y-3">
            <button
              onClick={handleSaveDraft}
              className={`w-full font-semibold py-2 px-4 rounded shadow transition duration-200 ${
                publishStatus === "draft"
                  ? "bg-white hover:bg-gray-100 text-gray-800 border border-gray-400"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
              }`}
            >
              {publishStatus === "draft" ? "保存草稿" : "已保存草稿箱"}
            </button>
            <button
              onClick={handlePublish}
              className={`w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 ${
                publishStatus === "published"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={publishStatus === "published"}
            >
              {publishStatus === "published" ? "发布文章" : "已发布"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSidebar;

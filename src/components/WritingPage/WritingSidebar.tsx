"use client";
import React from "react";
import {
  PencilIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import { BookInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface SidebarOption {
  id: string;
  title: string;
  icon: React.ElementType;
}

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
  const { t } = useTranslation("book");

  const sidebarOptions: SidebarOption[] = [
    {
      id: "intro",
      title: t("writingSidebar.editIntro"),
      icon: PencilIcon
    },
    {
      id: "cover",
      title: t("writingSidebar.addDetails"),
      icon: PhotoIcon
    },
    {
      id: "content",
      title: t("writingSidebar.editContent"),
      icon: DocumentTextIcon
    },
    {
      id: "authornote",
      title: t("writingSidebar.authorMessage"),
      icon: ChatBubbleBottomCenterTextIcon
    }
  ];

  const handleOptionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-64  flex-shrink-0 border-r">
      <div className="w-64 h-screen  flex flex-col items-center fixed left-0 top-0 pt-16 ">
        <h2 className="text-2xl font-bold bg-orange-400 w-full text-center py-5 text-white mb-6">
          {t("writingSidebar.startCreating")}
        </h2>
        <ul className="space-y-4 mb-8 ">
          {sidebarOptions.map((option) => (
            <li key={option.id}>
              <button
                onClick={() => handleOptionClick(option.id)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-neutral-600 hover:text-white hover:bg-orange-400"
              >
                <option.icon className="h-6 w-6" />
                <span className="font-medium">{option.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 pt-6 w-full">
          <div className="space-y-3 px-10">
            <button
              onClick={onSaveDraft}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transition duration-200 border border-gray-400"
            >
              {t("writingSidebar.saveDraft")}
            </button>
            <button
              onClick={onPublish}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 "
            >
              {t("writingSidebar.publishArticle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingSidebar;

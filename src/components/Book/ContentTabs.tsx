import { BookInfo, ChapterInfo } from "@/app/lib/definitions";
import React from "react";
import { useTranslation } from "../useTranslation";

type TabType = "comments" | "chapters";

interface ContentTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  book: BookInfo;
  totalRecord: number;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  setActiveTab,
  book,
  totalRecord
}) => {
  const { t } = useTranslation("book");

  return (
    <div className="flex  border-b">
      <div
        className={`cursor-pointer px-4 py-2 ${
          activeTab === "comments"
            ? "border-b-2 border-orange-400 text-orange-400"
            : ""
        }`}
        onClick={() => setActiveTab("comments")}
      >
        {t("comments")}
        <span className="ml-2 text-neutral-400 text-xs">
          {book.commentsCount}
        </span>
      </div>
      <div
        className={`cursor-pointer px-4 py-2 ${
          activeTab === "chapters"
            ? "border-b-2 border-orange-400 text-orange-400"
            : ""
        }`}
        onClick={() => setActiveTab("chapters")}
      >
        {t("chapters")}
        <span className="ml-2 text-neutral-400 text-xs">{totalRecord}</span>
      </div>
    </div>
  );
};

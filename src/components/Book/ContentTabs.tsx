import { BookInfo } from "@/app/lib/definitions";
import React from "react";

type TabType = "comments" | "chapters";

interface ContentTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  book: BookInfo;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  setActiveTab,
  book
}) => (
  <div className="flex  border-b">
    <div
      className={`cursor-pointer px-4 py-2 ${
        activeTab === "comments"
          ? "border-b-2 border-orange-400 text-orange-400"
          : ""
      }`}
      onClick={() => setActiveTab("comments")}
    >
      评论
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
      章节目录
      <span className="ml-2 text-neutral-400 text-xs">
        {book.latestChapterNumber}
      </span>
    </div>
  </div>
);

import React from "react";

type TabType = "comments" | "chapters";

interface ContentTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  setActiveTab,
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
      評論
    </div>
    <div
      className={`cursor-pointer px-4 py-2 ${
        activeTab === "chapters"
          ? "border-b-2 border-orange-400 text-orange-400"
          : ""
      }`}
      onClick={() => setActiveTab("chapters")}
    >
      章節目錄
    </div>
  </div>
);

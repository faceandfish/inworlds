"use client";
import React, { useState } from "react";

const WorkContent = () => {
  const [activeTab, setActiveTab] = useState("全部內容");
  const [works, setWorks] = useState([
    { id: 1, title: "作品1", status: "正在連載", updatedAt: "2023-05-15" },
    { id: 2, title: "作品2", status: "已完結", updatedAt: "2023-04-20" },
    { id: 3, title: "作品3", status: "草稿", updatedAt: "2023-05-10" },
    { id: 4, title: "作品4", status: "正在連載", updatedAt: "2023-05-12" },
  ]);

  const tabs = ["全部內容", "正在連載", "已完結", "草稿箱"];

  const filteredWorks = works.filter((work) => {
    if (activeTab === "全部內容") return true;
    if (activeTab === "正在連載") return work.status === "正在連載";
    if (activeTab === "已完結") return work.status === "已完結";
    if (activeTab === "草稿箱") return work.status === "草稿";
    return false;
  });

  return (
    <div className="w-full ">
      <ul className="flex text-xl h-10 text-gray-700 border-b">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`px-5 leading-10 cursor-pointer transition-colors duration-200 
              ${
                activeTab === tab
                  ? "border-b-2 border-orange-400 text-orange-600"
                  : "hover:text-orange-400"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            新增作品
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 ">
              <th className="p-2 text-left">標題</th>
              <th className="p-2 text-left">狀態</th>
              <th className="p-2 text-left">最後更新</th>
              <th className="p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorks.map((work) => (
              <tr
                key={work.id}
                className="border-b border-gray-200 hover:bg-neutral-100"
              >
                <td className="p-2">{work.title}</td>
                <td className="p-2">{work.status}</td>
                <td className="p-2">{work.updatedAt}</td>
                <td className="p-2">
                  <button className="text-orange-500 hover:text-orange-600 mr-2">
                    編輯
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkContent;

import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import Navbar from "@/components/Navbar";

function Studio() {
  return (
    <>
      <Navbar />
      <div className="flex my-10 ">
        <div className="  w-60   ">
          <div className="mb-5 flex gap-5 flex-col items-center">
            <div className="w-20 h-20 bg-black rounded-full"></div>
            <p>作者暱稱</p>
          </div>
          <ul>
            <li className="flex items-center gap-5 px-6  py-4 hover:bg-slate-100 text-gray-700  ">
              <HiOutlineDocumentText className="text-2xl text-gray-400" />
              <p>作品內容</p>
            </li>
            <li className="flex items-center gap-5 px-6  py-4 hover:bg-slate-100 text-gray-700  ">
              <HiOutlineChartBarSquare className="text-2xl text-gray-400" />
              <p>數據分析</p>
            </li>
            <li className="flex items-center gap-5 px-6  py-4 hover:bg-slate-100 text-gray-700  ">
              <HiOutlineChatBubbleBottomCenterText className="text-2xl text-gray-400" />
              <p>評論</p>
            </li>
            <li className="flex items-center gap-5 px-6  py-4 hover:bg-slate-100 text-gray-700  ">
              <AiOutlineCopyrightCircle className="text-2xl text-gray-400" />
              <p>版權</p>
            </li>
            <li className="flex items-center gap-5 px-6  py-4 hover:bg-slate-100 text-gray-700  ">
              <MdAttachMoney className="text-2xl text-gray-400" />
              <p>收入</p>
            </li>
          </ul>
        </div>
        {/* studio詳情內容 */}
        <div className="w-full h-96 border-l">
          <ul className=" flex  text-xl h-10  text-gray-700 ">
            <li className="px-5 leading-10  hover:border-orange-400 hover:border-b">
              全部內容
            </li>
            <li className="px-5 leading-10  hover:border-orange-400 hover:border-b">
              正在連結
            </li>
            <li className="px-5 leading-10  hover:border-orange-400 hover:border-b">
              已完結
            </li>
            <li className="px-5 leading-10  hover:border-orange-400 hover:border-b">
              草稿箱
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Studio;

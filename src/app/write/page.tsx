import Navbar from "@/components/Navbar";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";

function Write() {
  return (
    <div>
      <Navbar />
      <form className="flex items-center flex-col gap-8 w-full  ">
        <div className=" relative w-1/2 h-20 flex items-center  ">
          <label
            htmlFor="book-title"
            className=" text-gray-400 absolute top-5 left-0 pl-5 text-sm  mb-5 "
          >
            標題（必填）
          </label>
          <input
            type="text"
            id="book-title"
            className="appearance-none border rounded  
            w-4/5 h-20 border-gray-400
             py-6 mt-6 px-5 text-gray-700 leading-tight  focus:outline-none focus:border-orange-400"
            placeholder="輸入書名"
          />
        </div>
        {/* 詳情 */}
        <div className=" relative w-1/2 h-80 flex  ">
          <label
            htmlFor="book-brief"
            className=" text-gray-400 absolute top-5 left-0 pl-5 text-sm  mb-5 "
          >
            詳情描述（必填）
          </label>
          <textarea
            id="book-brief"
            className="appearance-none border rounded  
            w-4/5 py-12  border-gray-400
             px-5 text-gray-700 leading-tight  focus:outline-none focus:border-orange-400"
            placeholder="輸入詳情內容..."
          />
        </div>
        {/* 分類 */}
        <div className="flex w-1/2 items-center space-x-5 ">
          <label htmlFor="book-category" className=" text-gray-700 ">
            書籍頻道分類:
          </label>
          <select
            id="book-category"
            className=" bg-white border border-gray-300 hover:border-orange-400 px-4 py-2  rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-400 w-1/2"
          >
            <option value="female-story">女性故事</option>
            <option value="male-story">男性故事</option>
            <option value="children-story">兒童故事</option>
            <option value="literature-story">文學故事</option>
            <option value="biography">自傳紀實</option>
          </select>
        </div>
        {/* 分级 */}
        <div className="h-30">作品分级：</div>
      </form>
    </div>
  );
}

export default Write;

import Navbar from "@/components/Navbar";

import React from "react";

function Books() {
  return (
    <div>
      <Navbar />

      <div className="w-5/6 mx-auto ">
        <div className="flex justify-between mt-10 w-full h-56 ">
          <div className="flex gap-10">
            <div className="w-44 h-56 bg-orange-400 rounded-xl "></div>
            <div className="flex flex-col justify-around ">
              <h2>書名</h2>
              <p>連載中...</p>
              <p>最新章節：第八十章 章節名字 2024年12月12日</p>
              <div>
                <button className="hover:bg-orange-500  bg-orange-400 px-5 py-2 rounded text-white mr-10">
                  立即閱讀
                </button>
                <button className="hover:text-orange-400">訂閱本書</button>
              </div>
            </div>
          </div>
          <div className=" w-80 border-l border-gray-100  flex flex-col items-center justify-around">
            <div className="w-10 h-10 rounded-full bg-slate-400"></div>
            <p>作者暱稱</p>
            <p>作者簡介...</p>
            <button className="hover:bg-orange-500  bg-orange-400 px-5 py-2 rounded text-white ">
              訂閱
            </button>
          </div>
        </div>
        {/* 作品簡介 */}
        <div className="w-full h-32  my-16">
          <p className="text-xl pb-2 border-b border-gray-100">作品簡介</p>
          <p className=" font-light mt-2 px-10">這裡作品簡介...</p>
        </div>
        {/* 章節目錄 */}
        <div className="w-full h-48 ">
          <p className="text-xl pb-2 border-b border-gray-100">章節目錄</p>
          <div className="font-light my-2 px-10">
            <div className=" flex my-5 justify-between ">
              <div className="flex gap-5">
                <p>第一章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第二章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第三章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第四章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
            </div>
            <div className=" flex my-5 justify-between ">
              <div className="flex gap-5">
                <p>第一章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第二章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第三章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第四章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
            </div>
            <div className=" flex my-5 justify-between ">
              <div className="flex gap-5">
                <p>第一章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第二章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第三章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
              <div className="flex gap-5">
                <p>第四章</p>
                <p>椒鹽炸杏鮑菇</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;

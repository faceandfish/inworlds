"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

function MailBox() {
  return (
    <div className="w-full h-screen bg-orange-400">
      <Navbar />
      <div className="flex gap-5  justify-center  mt-10">
        <ul className="  bg-white shadow list-disc list-inside w-48 py-10 text-gray-600">
          <li className=" list-none text-2xl font-bold text-center pb-5 border-b border-gray-100">
            消息中心
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5      hover:bg-gray-100 hover:text-orange-400">
            我的消息
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5      hover:bg-gray-100 hover:text-orange-400">
            系統通知
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5      hover:bg-gray-100 hover:text-orange-400">
            回復我的
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5      hover:bg-gray-100 hover:text-orange-400">
            @ 我的
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5   border-b border-gray-100   hover:bg-gray-100 hover:text-orange-400">
            收到的贊
          </li>
          <li className=" cursor-pointer  h-10 leading-10 px-5  mt-5 hover:bg-gray-100 hover:text-orange-400">
            消息設置
          </li>
        </ul>

        <div className="  bg-white shadow ">
          <h2 className="text-gray-500 font-light px-5 py-2 border-b border-gray-100">
            我的消息
          </h2>
          <div className=" bg-gray-200 flex  ">
            <ul className=" bg-white  ">
              <li className="px-5 w-52 py-4 flex items-center gap-3 border-b   border-gray-100 hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full  bg-slate-500"></div>
                <p className="font-light">ALICE</p>
              </li>
              <li className="px-5 w-52 py-4 flex items-center gap-3 border-b   border-gray-100 hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full  bg-slate-500"></div>
                <p className="font-light">ALICE</p>
              </li>
              <li className="px-5 w-52 py-4 flex items-center gap-3 border-b   border-gray-100 hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full  bg-slate-500"></div>
                <p className="font-light">ALICE</p>
              </li>
              <li className="px-5 w-52 py-4 flex items-center gap-3 border-b   border-gray-100 hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full  bg-slate-500"></div>
                <p className="font-light">ALICE</p>
              </li>

              <li className="px-5 w-52 py-4 flex items-center gap-3  hover:bg-gray-100">
                <div className="w-10 h-10 rounded-full  bg-slate-500"></div>
                <p className="font-light">ALICE</p>
              </li>
            </ul>
            <div className="w-96  ">
              <div className="border-b mt-5 h-3/5 border-gray-400 flex gap-3 px-5">
                <div className="w-10 h-10 rounded bg-slate-500"></div>
                <div className="bg-white h-10 rounded-r-2xl rounded-bl-2xl py-2 px-5">
                  你好，很高興認識你
                </div>
              </div>
              <div className="px-5">
                <input
                  type="textarea"
                  className=" outline-none w-full  h-16 bg-transparent"
                />
                <div className="flex justify-end ">
                  <button className=" hover:bg-orange-500 bg-orange-400  font-light py-2 px-4 rounded mt-auto">
                    提交
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailBox;

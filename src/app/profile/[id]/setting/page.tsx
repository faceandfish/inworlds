"use client";
import React from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  DocumentTextIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import UserAvatar from "@/components/UserAvatar";
import useUserInfo from "@/components/useUserInfo";

export default function UserEditPage() {
  const { user } = useUserInfo();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-200 to-indigo-600 text-white p-6">
          <h1 className="text-3xl font-extrabold text-center">编辑个人信息</h1>
        </div>
        <div className="p-6">
          <form className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* <img
                  src="/api/placeholder/150/150"
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                /> */}
                <UserAvatar
                  user={user}
                  className="w-32 h-32 rounded-full border-4 border-white text-2xl shadow-lg"
                />
                <button className="absolute bottom-0 right-0 rounded-full p-2 bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 text-white">
                  <CameraIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <UserCircleIcon className="h-5 w-5 text-indigo-500" />
                  <span>用户名</span>
                </label>
                <input
                  type="text"
                  placeholder="输入新的用户名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-500" />
                  <span>邮箱</span>
                </label>
                <input
                  type="email"
                  placeholder="输入新的邮箱地址"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500" />
                  <span>密码</span>
                </label>
                <input
                  type="password"
                  placeholder="输入新密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500" />
                  <span>确认密码</span>
                </label>
                <input
                  type="password"
                  placeholder="再次输入新密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-700 font-medium">
                <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
                <span>个人简介</span>
              </label>
              <textarea
                placeholder="编辑你的个人简介"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                保存修改
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

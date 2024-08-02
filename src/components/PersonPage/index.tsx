"use client";
import { useState } from "react";
import UserAvatar from "../UserAvatar";
import Clip from "../Clip";
import Link from "next/link";

import { useUserInfo } from "../useUserInfo";

function PersonPage() {
  const { user } = useUserInfo();
  const currentUser = user;
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 比较当前用户ID和页面显示的用户ID
  if (!user) {
    return <div>Loading...</div>;
  }

  const isCurrentUser = currentUser?.id === user.id;

  const handleSubscribe = () => {
    // 这里应该添加实际的订阅/取消订阅逻辑
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="max-w-full mx-auto ">
      <div className="bg-white border border-b-gray-200  overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-orange-200 to-purple-200 ">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2  ">
            <UserAvatar
              user={user}
              className="w-32 h-32 border-4 border-white shadow-lg text-7xl rounded-full text-center bg-gradient-to-br from-pink-400 to-red-500"
            />
          </div>
        </div>
        <div className="pt-20 pb-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.loginAct}
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-6 line-clamp-2">
            {user.introduction || "这个用户很懒，还没有填写个人介绍。"}
          </p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {user.articlesCount || 0}
              </div>
              <div className="text-sm text-gray-600">作品</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {user.followersCount || 0}
              </div>
              <div className="text-sm text-gray-600">粉丝</div>
            </div>

            {isCurrentUser && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {user.followingCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">关注</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {user.favoritesCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">收藏</div>
                </div>
              </>
            )}

            {isCurrentUser ? (
              <div>
                <Link href={`/profile/${user.id}/setting`}>
                  <button className="ml-4 px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out">
                    修改资料
                  </button>
                </Link>
                <Link href="#">
                  <button className="ml-4 px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out">
                    管理作品
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleSubscribe}
                  className={`ml-4 px-4 py-2 rounded-md text-white ${
                    isSubscribed
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-orange-400 hover:bg-orange-500"
                  } transition duration-300 ease-in-out`}
                >
                  {isSubscribed ? "取消关注" : "关注"}
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-md text-white 
                      bg-orange-400 hover:bg-orange-500
                  transition duration-300 ease-in-out"
                >
                  打赏
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 px-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 这里可以添加最近文章的列表 */}
        <div className="bg-white gap-8  rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">全部作品</h2>
          <div className="flex flex-col gap-8">
            <Clip />
            <Clip />
          </div>
        </div>
        <div className="bg-white  rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">火热连载</h2>
          <p className="text-gray-600">
            <div className="flex flex-col gap-8">
              <Clip />
            </div>
          </p>
          {/* 这里可以添加最近活动的列表 */}
        </div>
      </div>
    </div>
  );
}
export default PersonPage;

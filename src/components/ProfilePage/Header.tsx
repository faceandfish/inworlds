"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PublicUserInfo, ApiResponse } from "@/app/lib/definitions";
import UserActions from "./UserActions";
import Link from "next/link";
import { fetchUserInfo, getUserById } from "@/app/lib/action";

import { getAvatarUrl } from "@/app/lib/imageUrl";
import Image from "next/image";
import FollowButton from "./FollowButton";
import { useUser } from "../UserContextProvider";

const Header: React.FC = () => {
  const [user, setUser] = useState<PublicUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUser();

  const params = useParams();
  const userId = params.id as string;
  console.log("userid", userId);

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!userId || isNaN(Number(userId))) {
        setError("无效的用户ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userInfo = await getUserById(Number(userId));
        setUser(userInfo);
      } catch (err) {
        console.error("获取用户信息时出错:", err);
        setError("获取用户信息失败");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [userId]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error || !user) {
    return <div>错误：{error}</div>;
  }

  const isCurrentUser = currentUser?.id === Number(userId);

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white border border-b-gray-200 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-orange-200 to-purple-200">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 ">
            <Image
              src={getAvatarUrl(user.avatarUrl!)}
              alt={user.displayName!}
              width={200}
              height={200}
              className="rounded-full w-40 h-40 border-4 border-white shadow-md"
            />
          </div>
        </div>
        <div className="pt-20 pb-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.displayName}
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-6 line-clamp-2">
            {user.introduction || "这个用户很懒，还没有填写个人介绍。"}
          </p>
          <div className="flex justify-center items-center space-x-8">
            {user.userType === "creator" && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {user.booksCount || 0}
                </div>
                <div className="text-sm text-gray-600">作品</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {user.followersCount || 0}
              </div>
              <div className="text-sm text-gray-600">粉丝</div>
            </div>
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
            <UserActions isCurrentUser={isCurrentUser} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

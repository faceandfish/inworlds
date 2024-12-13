"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PublicUserInfo, ApiResponse } from "@/app/lib/definitions";
import UserActions from "./UserActions";
import Link from "next/link";
import { getUserById } from "@/app/lib/action";
import Image from "next/image";
import { useUser } from "../UserContextProvider";
import HeaderSkeleton from "./skeleton/HeaderSkeleton";
import { useTranslation } from "../useTranslation";

const Header: React.FC = () => {
  const { t } = useTranslation("profile");
  const [user, setUser] = useState<PublicUserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!userId || isNaN(Number(userId))) {
        setError(t("header.invalidUserId"));
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserById(Number(userId));
        if (response.code === 200 && "data" in response) {
          setUser(response.data);
        } else {
          setError(response.msg || t("header.fetchUserError"));
        }
      } catch (err) {
        setError(t("header.fetchUserError"));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [userId]);

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (error || !user) {
    return <div>错误：{error}</div>;
  }

  const isCurrentUser = currentUser?.id === Number(userId);

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white border border-b-gray-200 overflow-hidden">
        <div className="relative h-32 sm:h-48 bg-gradient-to-r from-orange-200 to-purple-200">
          <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2  ">
            <Image
              src={user.avatarUrl!}
              alt={user.displayName || "username"}
              width={200}
              height={200}
              className="rounded-full w-28 h-28 sm:w-40 sm:h-40 border-4 border-white shadow-md"
            />
          </div>
        </div>
        <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {user.displayName}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 line-clamp-2">
            {user.introduction || t("header.noIntroduction")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
            {user.userType === "creator" && (
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-neutral-800">
                  {user.booksCount || 0}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">
                  {t("header.works")}
                </div>
              </div>
            )}
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-neutral-800">
                {user.followersCount || 0}
              </div>
              <div className="text-xs sm:text-sm text-neutral-600">
                {t("header.followers")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-neutral-800">
                {user.followingCount || 0}
              </div>
              <div className="text-xs sm:text-sm text-neutral-600">
                {t("header.following")}
              </div>
            </div>

            <UserActions isCurrentUser={isCurrentUser} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { checkFollowStatus } from "@/app/lib/action";
import FollowButton from "./FollowButton";
import TipButton from "../Main/TipButton";
import { useTranslation } from "../useTranslation";

interface UserActionsProps {
  isCurrentUser: boolean;
  userId: number;
}

export default function UserActions({
  isCurrentUser,
  userId
}: UserActionsProps) {
  const { t } = useTranslation("profile");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await checkFollowStatus(userId);
        if ("data" in response && response.code === 200) {
          setIsFollowing(response.data);
        } else {
          // 静默处理错误，因为这个状态不是致命的
          setIsFollowing(false);
        }
      } catch (err) {
        // 出错时默认为未关注状态
        setIsFollowing(false);
      }
    };

    if (!isCurrentUser) {
      fetchFollowStatus();
    }
  }, [userId, isCurrentUser]);

  const handleFollowStatusChange = (newStatus: boolean) => {
    setIsFollowing(newStatus);
  };

  return (
    <div>
      {isCurrentUser ? (
        <>
          <Link href={`/user/${userId}/setting`}>
            <button className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out">
              {t("userActions.editProfile")}
            </button>
          </Link>
          <Link href={`/studio/${userId}`}>
            <button className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out">
              {t("userActions.manageWorks")}
            </button>
          </Link>
        </>
      ) : (
        <>
          <FollowButton
            userId={userId}
            onFollowStatusChange={handleFollowStatusChange}
          />
          <TipButton authorId={userId} className="ml-4" />
        </>
      )}
    </div>
  );
}

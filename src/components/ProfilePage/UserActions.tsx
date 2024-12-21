"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { checkFollowStatus } from "@/app/lib/action";
import FollowButton from "./FollowButton";
import TipButton from "../Main/TipButton";
import { useTranslation } from "../useTranslation";
import { BecomeCreatorModal } from "../Main/NewUserView";
import { useUser } from "../UserContextProvider";

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
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await checkFollowStatus(userId);
        if ("data" in response && response.code === 200) {
          setIsFollowing(response.data);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
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

  const handleManageWorksClick = (e: React.MouseEvent) => {
    if (user?.userType !== "creator") {
      e.preventDefault(); // 阻止默认的导航行为
      setShowCreatorModal(true);
    }
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
            <button
              onClick={handleManageWorksClick}
              className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out"
            >
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

      {/* 成为创作者模态框 */}
      <BecomeCreatorModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        onSuccess={() => {
          setShowCreatorModal(false);
          // 成功后导航到工作室页面
          window.location.href = `/studio/${userId}`;
        }}
      />
    </div>
  );
}

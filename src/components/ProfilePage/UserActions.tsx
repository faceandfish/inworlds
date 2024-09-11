import React, { useState, useEffect } from "react";
import Link from "next/link";
import { followUser, unfollowUser, checkFollowStatus } from "@/app/lib/action";
import FollowButton from "./FollowButton";

interface UserActionsProps {
  isCurrentUser: boolean;
  userId: number;
}

export default function UserActions({
  isCurrentUser,
  userId
}: UserActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const status = await checkFollowStatus(userId);
        setIsFollowing(status);
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
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
              修改资料
            </button>
          </Link>
          <Link href={`/studio/${userId}`}>
            <button className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out">
              管理作品
            </button>
          </Link>
        </>
      ) : (
        <>
          <FollowButton
            userId={userId}
            onFollowStatusChange={handleFollowStatusChange}
          />
          <button className="ml-4 px-5 py-2 rounded  text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out">
            打赏
          </button>
        </>
      )}
    </div>
  );
}

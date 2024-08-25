import React, { useState, useEffect } from "react";
import Link from "next/link";
import { followUser, unfollowUser, checkFollowStatus } from "@/app/lib/action";

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

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    } finally {
      setIsLoading(false);
    }
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
          <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out"
          >
            {isLoading ? "处理中..." : isFollowing ? "取消关注" : "关注"}
          </button>
          <button className="ml-4 px-4 py-2 rounded-md text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out">
            打赏
          </button>
        </>
      )}
    </div>
  );
}

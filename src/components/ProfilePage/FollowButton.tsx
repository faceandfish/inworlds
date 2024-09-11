import React, { useState, useEffect } from "react";
import { followUser, unfollowUser, checkFollowStatus } from "@/app/lib/action";

interface FollowButtonProps {
  userId: number;
  onFollowStatusChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  onFollowStatusChange
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus(userId)
      .then((status) => {
        setIsFollowing(status);
        if (onFollowStatusChange) onFollowStatusChange(status);
      })
      .catch(console.error);
  }, [userId, onFollowStatusChange]);

  const handleFollowClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await (isFollowing ? unfollowUser : followUser)(userId);
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);
      if (onFollowStatusChange) onFollowStatusChange(newFollowStatus);
    } catch (error) {
      console.error("关注/取消关注操作失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`px-5 py-2 rounded text-white ${
        isFollowing
          ? "bg-neutral-400 hover:bg-neutral-500"
          : "bg-orange-400 hover:bg-orange-500"
      } ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } transition-all duration-200`}
      onClick={handleFollowClick}
      disabled={isLoading}
    >
      {isLoading ? "处理中..." : isFollowing ? "取消关注" : "关注"}
    </button>
  );
};

export default FollowButton;

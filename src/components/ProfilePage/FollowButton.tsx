"use client";
import React, { useState, useEffect } from "react";
import { followUser, unfollowUser, checkFollowStatus } from "@/app/lib/action";
import { useUser } from "../UserContextProvider";
import { useRouter } from "next/navigation";
import Alert from "../Main/Alert";
import { useTranslation } from "../useTranslation";
import { logger } from "../Main/logger";

interface FollowButtonProps {
  userId: number;
  onFollowStatusChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  onFollowStatusChange
}) => {
  const { t } = useTranslation("profile");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const isLoggedIn = !!user;

  useEffect(() => {
    const checkStatus = async () => {
      if (isLoggedIn) {
        try {
          const response = await checkFollowStatus(userId);
          if (response.code === 200 && "data" in response) {
            setIsFollowing(response.data);
            if (onFollowStatusChange) onFollowStatusChange(response.data);
          } else {
            logger.warn("Failed to check follow status:", response, {
              context: "FollowButton"
            });
          }
        } catch (error) {
          logger.error("Error checking follow status:", error, {
            context: "FollowButton"
          });
        }
      }
    };

    checkStatus();
  }, [userId, onFollowStatusChange, isLoggedIn]);

  const handleFollowClick = async () => {
    if (isLoading) return;

    if (!isLoggedIn) {
      setAlert({
        message: t("followButton.loginRequired"),
        type: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await (isFollowing ? unfollowUser : followUser)(userId);
      if (response.code === 200) {
        const newFollowStatus = !isFollowing;
        setIsFollowing(newFollowStatus);
        if (onFollowStatusChange) onFollowStatusChange(newFollowStatus);
        setAlert({
          message: newFollowStatus
            ? t("followButton.followSuccess")
            : t("followButton.unfollowSuccess"),
          type: "success"
        });
      } else {
        logger.warn("Failed to update follow status:", response, {
          context: "FollowButton"
        });
        setAlert({
          message: t("followButton.operationFailed"),
          type: "error"
        });
      }
    } catch (error) {
      logger.error("Error updating follow status:", error, {
        context: "FollowButton"
      });
      setAlert({
        message: t("followButton.operationFailed"),
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
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
        {isLoading
          ? t("followButton.processing")
          : isFollowing
          ? t("followButton.unfollow")
          : t("followButton.follow")}
      </button>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
          customButton={
            alert.message === t("followButton.loginRequired")
              ? {
                  text: t("followButton.login"),
                  onClick: handleLogin
                }
              : undefined
          }
        />
      )}
    </>
  );
};

export default FollowButton;

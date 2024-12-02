"use client";

import { UserInfo, ApiResponse, FileUploadData } from "@/app/lib/definitions";

import { useState, useEffect, useCallback } from "react";
import { getUserInfo, logout, uploadAvatar } from "@/app/lib/action";
import { getToken, removeToken } from "@/app/lib/token";

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserInfo();
      if (response.code === 200 && "data" in response) {
        setUser(response.data);
        return response;
      }
    } catch (err) {
      setUser(null);
      setError("An error occurred while fetching user info");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const updateUser = useCallback((updatedData: Partial<UserInfo>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updatedData };
      if (updatedUser.userType === "creator") {
        return updatedUser as UserInfo;
      } else {
        return updatedUser as UserInfo;
      }
    });
  }, []);

  const updateAvatar = useCallback(async (fileData: FileUploadData) => {
    if (!fileData.avatarImage) {
      throw new Error("No avatar image provided");
    }

    try {
      setLoading(true);
      const response = await uploadAvatar(fileData);
      if (response.code === 200 && "data" in response) {
        setUser((prevUser) => {
          if (!prevUser) return null;
          return { ...prevUser, avatarUrl: response.data };
        });
        return response.data;
      } else {
        throw new Error(response.msg || "Avatar upload failed");
      }
    } catch (error) {
      setError("Failed to update avatar");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
    } finally {
      removeToken();
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUserInfo,
    updateUser,
    updateAvatar,
    logoutUser
  };
}

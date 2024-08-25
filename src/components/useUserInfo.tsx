"use client";

import {
  UserInfo,
  ApiResponse,
  CreatorUserInfo,
  FileUploadData,
  RegularUserInfo
} from "@/app/lib/definitions";

import { useState, useEffect, useCallback } from "react";
import { uploadAvatar } from "@/app/lib/action";

export function useUserInfo() {
  const [user, setUser] = useState<UserInfo | CreatorUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: Response = await fetch("/api/userinfo", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const json = (await response.json()) as ApiResponse<
        UserInfo | CreatorUserInfo
      >;
      if (json.code === 200) {
        setUser(json.data);
      } else {
        setError(json.msg || "Failed to fetch user info");
      }
    } catch (err) {
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
        return updatedUser as CreatorUserInfo;
      } else {
        return updatedUser as RegularUserInfo;
      }
    });
  }, []);

  const updateAvatar = useCallback(async (fileData: FileUploadData) => {
    if (!fileData.avatarImage) {
      console.error("No avatar image provided");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadAvatar(fileData);
      if (response.code === 200) {
        setUser((prevUser) => {
          if (!prevUser) return null;
          return { ...prevUser, avatarUrl: response.data };
        });
        return response.data; // 返回新的头像 URL
      } else {
        throw new Error(response.msg || "Avatar upload failed");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to update avatar");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUserInfo,
    updateUser,
    updateAvatar
  };
}

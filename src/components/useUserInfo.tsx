"use client";

import { UserInfo, ApiResponse, CreatorUserInfo } from "@/app/lib/definitions";

import { useState, useEffect, useCallback } from "react";

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
      const json = (await response.json()) as ApiResponse<UserInfo>;
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

  const refetch = useCallback(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const updateUser = (updatedUser: UserInfo | CreatorUserInfo) => {
    setUser(updatedUser);
  };

  return { user, loading, error, refetch, updateUser };
}

export default useUserInfo;

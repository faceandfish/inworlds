"use client";
import { getUserInfo } from "@/app/lib/action";
import { User, UserResponse } from "@/app/lib/definitions";
import { useState, useEffect, useCallback } from "react";

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UserResponse = await getUserInfo();
      if (response.code === 200) {
        setUser(response.data);
      } else {
        setError(response.msg || "Failed to fetch user info");
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

  return { user, loading, error, refetch };
}

export default UserInfo;

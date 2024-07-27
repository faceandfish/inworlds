"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

import { User } from "@/app/lib/definitions";
import { getUserInfo } from "@/app/lib/action";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    if (initialUser.code === 200) {
      return initialUser.data;
    }
    return null;
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUserInfo();
        if (response.code === 200 && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("userInfo must be used within a UserProvider");
  }
  return context;
};

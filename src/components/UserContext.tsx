"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

import { User } from "@/app/lib/definitions";
import { getUserInfo } from "@/app/lib/action";

const defaultUser: User = {
  id: 1,
  loginAct: "Wus",
  name: "face",
  email: "123@gmail.com",
  followers: 100,
  articles: 5,
  bio: "这个用户很懒，还没有填写个人介绍。这个用户很懒，还没有填写个人介绍。这个用户很懒，还没有填写个人介绍。这个用户很懒，还没有填写个人介绍。这个用户很懒，还没有填写个人介绍。",
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getUserInfo();
        if (response.code === 200 && response.data) {
          setUser(response.data);
        } else {
          setUser(defaultUser);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(defaultUser);
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

export const userInfo = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("userInfo must be used within a UserProvider");
  }
  return context;
};

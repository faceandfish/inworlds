"use client";

import React, { createContext, useContext } from "react";
import { useUserInfo } from "./useUserInfo";
import { UserInfo, FileUploadData } from "@/app/lib/definitions";

type UserContextType = ReturnType<typeof useUserInfo>;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const userInfo = useUserInfo();

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

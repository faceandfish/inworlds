"use client";
import React from "react";

import { notFound, useParams } from "next/navigation";

import { User } from "@/app/lib/definitions";
import PersonPage from "@/components/PersonPage";
import { userInfo } from "@/components/UserContext";

const ProfilePage = () => {
  const { user } = userInfo();
  if (!user) {
    return <div>User not found</div>;
  }
  console.log("ProfilePage received user:", user);
  const { username } = useParams();

  // 检查 URL 中的 username 是否匹配用户的 loginAct 或 name
  if (
    typeof username === "string" &&
    user.loginAct.toLowerCase() !== username.toLowerCase() &&
    user.name.toLowerCase() !== username.toLowerCase()
  ) {
    notFound();
  }

  return <PersonPage user={user} />;
};

export default ProfilePage;

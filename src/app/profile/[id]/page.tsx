"use client";
import React from "react";

import { notFound, useParams } from "next/navigation";
import { userInfo } from "@/components/UserContext";

const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const { user } = userInfo();
  console.log("🚀 ~ userInfo:", userInfo());

  if (!user) {
    return <div>User not found</div>;
  }

  // 检查 URL 中的 username 是否匹配用户的 loginAct 或 name
  if (
    typeof username === "string" &&
    user.loginAct.toLowerCase() !== username.toLowerCase() &&
    user.name.toLowerCase() !== username.toLowerCase()
  ) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Profile</h1>
      <div className="space-y-2">
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Login Account:</strong> {user.loginAct}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* 添加其他可用的用户信息字段 */}
      </div>
    </div>
  );
};

export default ProfilePage;

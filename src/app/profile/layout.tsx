import React from "react";
import { userInfo } from "@/components/UserContext";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = userInfo();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      {/* 这里可以添加 profile 页面的通用布局元素 */}
      <main>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { user })
            : child
        )}
      </main>
    </div>
  );
}

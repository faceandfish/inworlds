"use client";
import React, { useState, useCallback, Suspense } from "react";
import Sidebar from "./Sidebar";
import { useUserInfo } from "../useUserInfo";
import Alert from "../Alert";
import { useRouter } from "next/navigation";
import ContentWrapper from "./ContentWrapper";
import SidebarSkeleton from "./Skeleton/SidebarSkeleton";
import WorkContentSkeleton from "./Skeleton/WorkContentSkeleton";

const Studio: React.FC = () => {
  const [activeSection, setActiveSection] = useState("works");
  const { user, loading: userLoading } = useUserInfo();
  const router = useRouter();

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  if (userLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SidebarSkeleton />
        <div className="flex-1 bg-white pt-10 overflow-auto">
          <WorkContentSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert
        message="无法加载用户信息。请重新登录或稍后再试。"
        type="error"
        onClose={() => {}}
        customButton={{
          text: "返回登录页面",
          onClick: () => router.push("/login")
        }}
        autoClose={false}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        user={user}
      />
      <div className="flex-1 bg-white pt-10 overflow-auto">
        <ContentWrapper activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Studio;

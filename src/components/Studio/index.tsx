"use client";
import React, { useState, useCallback, Suspense, useEffect } from "react";
import Sidebar from "./Sidebar";
import Alert from "../Alert";
import { useRouter } from "next/navigation";
import ContentWrapper from "./ContentWrapper";
import SidebarSkeleton from "./Skeleton/SidebarSkeleton";
import WorkContentSkeleton from "./Skeleton/WorkContentSkeleton";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import MobileStudioNotice from "./Skeleton/MobileStudioNotice";

const Studio: React.FC = () => {
  const [activeSection, setActiveSection] = useState("works");
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { t } = useTranslation("studio");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        message={t("studio.userLoadingError")}
        type="error"
        onClose={() => {}}
        customButton={{
          text: t("studio.loginButton"),
          onClick: () => router.push("/login")
        }}
        autoClose={false}
      />
    );
  }
  if (isMobile) {
    return <MobileStudioNotice />;
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

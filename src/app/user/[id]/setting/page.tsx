"use client";

import UserSettingsPage from "@/components/ProfileSettingsPage";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto  overflow-hidden">
        <div className="bg-gradient-to-r from-orange-100 to-rose-200 text-neutral-700 p-6">
          <h1 className="text-3xl font-extrabold text-center">编辑个人信息</h1>
        </div>
        <UserSettingsPage />
      </div>
    </div>
  );
}

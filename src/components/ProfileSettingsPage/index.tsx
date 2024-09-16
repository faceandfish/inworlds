"use client";
import React, { useState } from "react";
import ProfileSettings from "./ProfileSetting";
import AccountSettings from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AvatarUpload from "./AvatarUpload";
import Sidebar from "./Sidebar";
import {
  UserInfo,
  UpdateUserRequest,
  ChangePasswordRequest,
  FileUploadData
} from "@/app/lib/definitions";
import { updateProfile, uploadAvatar, changePassword } from "@/app/lib/action";

import { toast } from "react-toastify";
import { useUser } from "../UserContextProvider";

const UserSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const { user, updateUser } = useUser();

  const handleProfileSave = async (updatedData: UpdateUserRequest) => {
    try {
      const response = await updateProfile(updatedData);
      if (user) {
        const updatedUser: UserInfo = {
          ...user,
          ...response.data
        };
        updateUser(updatedUser);
      }
      toast.success("个人资料更新成功！");
    } catch (error) {
      console.error("更新个人资料失败:", error);
      toast.error("更新个人资料失败，请稍后重试。");
    }
  };
  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (user) {
      const updatedUser: UserInfo = {
        ...user,
        avatarUrl: newAvatarUrl
      };
      updateUser(updatedUser);
    }
    toast.success("头像更新成功！");
  };

  const handlePasswordChange = async (passwordData: ChangePasswordRequest) => {
    try {
      await changePassword(passwordData);
      toast.success("密码修改成功！");
    } catch (error) {
      console.error("修改密码失败:", error);
      toast.error("密码修改失败，请检查您的当前密码并重试。");
    }
  };

  const renderContent = () => {
    if (!user) return <div>加载中...</div>;

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSettings
            user={user}
            onSave={handleProfileSave}
            onAvatarChange={handleAvatarChange}
          />
        );
      case "avatar":
        return <AvatarUpload user={user} onAvatarChange={handleAvatarChange} />;
      case "account":
        return <AccountSettings user={user} onSave={handleProfileSave} />;
      case "security":
        return <SecuritySettings onPasswordChange={handlePasswordChange} />;
      case "notifications":
        return <NotificationSettings user={user} />;
      default:
        return (
          <ProfileSettings
            user={user}
            onSave={handleProfileSave}
            onAvatarChange={handleAvatarChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen px-10 ">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
        <div className="flex">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <div className="flex-1 p-6 bg-white min-h-screen">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;

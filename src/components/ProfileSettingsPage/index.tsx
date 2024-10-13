"use client";
import React, { useEffect, useState } from "react";
import ProfileSettings from "./ProfileSetting";
import AccountSettings from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import AvatarUpload from "./AvatarUpload";
import Sidebar from "./Sidebar";
import Alert from "../Alert";
import {
  UserInfo,
  UpdateUserRequest,
  ChangePasswordRequest
} from "@/app/lib/definitions";
import { updateProfile, changePassword } from "@/app/lib/action";

import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

const UserSettingsPage: React.FC = () => {
  const { t, lang } = useTranslation("profile");
  const [activeSection, setActiveSection] = useState("profile");
  const { user, updateUser, refetch } = useUser();
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 当语言变化时，重新获取用户信息
    refetch();
  }, [lang, refetch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
  };

  const handleProfileSave = async (updatedData: UpdateUserRequest) => {
    try {
      const response = await updateProfile(updatedData);

      if (user) {
        const updatedUser: UserInfo = {
          ...user,
          ...response.data
        };
        updateUser(updatedUser);
        await refetch();

        console.log("更改后：", user);
      }
      showAlert(t("userSettings.profileUpdateSuccess"), "success");
    } catch (error) {
      showAlert(t("userSettings.profileUpdateFail"), "error");
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
    showAlert(t("userSettings.avatarUpdateSuccess"), "success");
  };

  const handlePasswordChange = async (passwordData: ChangePasswordRequest) => {
    try {
      const response = await changePassword(passwordData);

      if (response.code === 200) {
        showAlert(t("userSettings.passwordChangeSuccess"), "success");
      } else {
        // 任何非 200 的 code 都视为错误，显示后端返回的具体错误信息
        showAlert(
          response.msg || t("userSettings.passwordChangeFail"),
          "error"
        );
      }
    } catch (error) {
      // 处理网络错误或其他未预期的错误
      showAlert(t("userSettings.networkError"), "error");
    }
  };

  const renderContent = () => {
    if (!user) return <div>{t("userSettings.loading")}</div>;

    switch (activeSection) {
      case "profile":
        return <ProfileSettings user={user} onSave={handleProfileSave} />;
      case "avatar":
        return <AvatarUpload user={user} onAvatarChange={handleAvatarChange} />;
      case "account":
        return <AccountSettings user={user} onSave={handleProfileSave} />;
      case "security":
        return (
          <SecuritySettings
            onPasswordChange={handlePasswordChange}
            showAlert={showAlert}
          />
        );
      // case "notifications":
      //   return <NotificationSettings user={user} />;
      default:
        return <ProfileSettings user={user} onSave={handleProfileSave} />;
    }
  };

  const MobileNavbar = () => (
    <div className=" p-4 mb-4 ">
      <select
        value={activeSection}
        onChange={(e) => setActiveSection(e.target.value)}
        className="w-full p-2 bg-white border rounded"
      >
        <option value="profile">{t("sidebar.personalProfile")}</option>
        <option value="avatar">{t("sidebar.avatarManagement")}</option>
        <option value="account">{t("sidebar.accountSettings")}</option>
        <option value="security">{t("sidebar.securitySettings")}</option>
        {/* <option value="notifications">
          {t("sidebar.notificationSettings")}
        </option> */}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-orange-100 to-rose-200 text-neutral-700 p-6">
          <h1 className="text-3xl font-extrabold text-center">
            {t("userSettings.editProfileTitle")}
          </h1>
        </div>
        <div className="md:px-10">
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className={`flex ${isMobile ? "flex-col" : ""}`}>
              {isMobile ? (
                <MobileNavbar />
              ) : (
                <Sidebar
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              )}
              <div className="flex-1 p-6 bg-white min-h-screen">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UserSettingsPage;

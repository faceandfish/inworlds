"use client";
import React, { useState } from "react";
import {
  PencilIcon,
  UsersIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { UserInfo } from "@/app/lib/definitions";
import Alert from "../Alert";
import { useTranslation } from "../useTranslation";

interface NewUserViewProps {
  user: UserInfo;
  onUserTypeChange: (newUserInfo: UserInfo) => Promise<void>;
}

export const NewUserView: React.FC<NewUserViewProps> = ({
  user,
  onUserTypeChange
}) => {
  const { t } = useTranslation("book");
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
  };

  const handleBecomeCreator = async () => {
    if (user.userType === "creator") {
      showAlert(t("newUserView.alreadyCreator"), "success");
      return;
    }

    try {
      const newCreatorInfo: UserInfo = {
        ...user,
        userType: "creator",
        articlesCount: 0,
        followersCount: 0,
        followingCount: 0,
        favoritesCount: 0
      };

      await onUserTypeChange(newCreatorInfo);
      showAlert(t("newUserView.congratulations"), "success");
    } catch (error) {
      console.error("Failed to become a creator:", error);
      showAlert(t("newUserView.becomeCreatorFailed"), "error");
    }
  };

  const features = [
    { Icon: PencilIcon, text: t("newUserView.publishOriginalContent") },
    { Icon: UsersIcon, text: t("newUserView.interactWithReaders") },
    { Icon: CurrencyDollarIcon, text: t("newUserView.earnFromCreations") }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-purple-100 to-orange-200 flex justify-center">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-orange-600 my-8">
            {t("newUserView.becomeCreator")}
          </h1>
        </div>

        <div className="bg-white px-20 py-20 mx-auto w-2/3 shadow-xl rounded-lg overflow-hidden">
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t("newUserView.joinCreatorCommunity")}
            </h2>
            <div className="space-y-6">
              {features.map(({ Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-lg text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-8 pt-8">
            <button
              onClick={handleBecomeCreator}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105"
            >
              {user.userType === "creator"
                ? t("newUserView.alreadyCreator")
                : t("newUserView.startCreatingJourney")}
            </button>
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
  );
};

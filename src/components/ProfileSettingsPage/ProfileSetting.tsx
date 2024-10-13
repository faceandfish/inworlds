"use client";
import React, { useState, useEffect } from "react";
import { UpdateUserRequest, UserInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface ProfileSettingsProps {
  user: UserInfo;
  onSave: (updatedData: UpdateUserRequest) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave }) => {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [introduction, setIntroduction] = useState(user.introduction || "");
  const { t } = useTranslation("profile");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUserData: UpdateUserRequest = {
      displayName,
      introduction
    };
    await onSave(updatedUserData);
  };

  const renderField = (
    field: "displayName" | "introduction",
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div className="flex flex-col md:flex-row md:items-center mb-4">
      <div className="w-full md:w-52  flex justify-start md:justify-end items-start md:items-center md:pr-4 mb-2 md:mb-0">
        <label
          htmlFor={field}
          className="flex items-center text-sm font-medium text-gray-700"
        >
          {label}:
        </label>
      </div>
      <div className="w-full md:w-2/3">
        {field === "introduction" ? (
          <textarea
            id={field}
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        ) : (
          <input
            type="text"
            id={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full md:space-y-10 ">
      <div className="hidden md:block border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">
          {t("profileSettings.title")}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10 ">
        {renderField(
          "displayName",
          t("profileSettings.nickname"),
          displayName,
          setDisplayName
        )}
        {renderField(
          "introduction",
          t("profileSettings.introduction"),
          introduction,
          setIntroduction
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="py-3 px-6 border border-transparent shadow-sm font-medium rounded-full text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {t("profileSettings.saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;

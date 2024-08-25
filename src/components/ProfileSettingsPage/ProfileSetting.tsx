import React, { useState } from "react";

import {
  FileUploadData,
  UpdateUserRequest,
  UserInfo
} from "@/app/lib/definitions";

interface ProfileSettingsProps {
  user: UserInfo;
  onSave: (updatedData: UpdateUserRequest) => Promise<void>;
  onAvatarChange: (newAvatarUrl: string) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave }) => {
  console.log("User data in ProfileSettings:", user);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [introduction, setIntroduction] = useState(user.introduction || "");

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
    <div className="flex items-center mb-4">
      <div className="w-40 flex justify-end items-center pr-4">
        <label
          htmlFor={field}
          className="flex items-center text-sm font-medium text-gray-700"
        >
          {label}:
        </label>
      </div>
      <div className="w-2/3">
        {field === "introduction" ? (
          <textarea
            id={field}
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={user.introduction || `输入您的${label}`}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        ) : (
          <input
            type="text"
            id={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={user.displayName || `输入您的${label}`}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-10">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">个人资料</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        {renderField(
          "displayName",
          "昵称",

          displayName,
          setDisplayName
        )}
        {renderField(
          "introduction",
          "个人简介",

          introduction,
          setIntroduction
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="py-3 px-6 border border-transparent shadow-sm font-medium rounded-full text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            保存修改
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;

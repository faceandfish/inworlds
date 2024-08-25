import React, { useState } from "react";

import { UpdateUserRequest, UserInfo } from "@/app/lib/definitions";

type AccountSettingsFields = Pick<
  UpdateUserRequest,
  "email" | "phone" | "language" | "gender" | "birthDate"
>;

interface AccountSettingsProps {
  user: UserInfo;
  onSave: (updatedData: Partial<AccountSettingsFields>) => Promise<void>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<AccountSettingsFields>({
    email: user.email,
    phone: user.phone || "",
    language: user.language || "简体中文",
    gender: user.gender || "other",
    birthDate: user.birthDate || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderField = (
    field: keyof AccountSettingsFields | "username",
    label: string,
    inputType: string = "text"
  ) => (
    <div className="flex items-center mb-4">
      <div className="w-40 flex justify-end items-center pr-4">
        <label
          htmlFor={field}
          className="flex items-center text-sm font-medium text-neutral-600"
        >
          {label}:
        </label>
      </div>
      <div className="w-2/3">
        {field === "username" ? (
          <input
            type="text"
            id={field}
            value={user.username}
            className="w-full p-2 bg-gray-100 outline-none border-orange-400 rounded"
            disabled
          />
        ) : field === "gender" ? (
          <select
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="w-36 border p-2 outline-none border-neutral-300 focus:border-orange-400  rounded"
          >
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">保密</option>
          </select>
        ) : field === "language" ? (
          <select
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="w-36 p-2 border outline-none border-neutral-300 focus:border-orange-400  rounded"
          >
            <option value="简体中文">简体中文</option>
            <option value="繁體中文">繁體中文</option>
            <option value="English">English</option>
            <option value="日本語">日本語</option>
          </select>
        ) : field === "birthDate" ? (
          <input
            type="date"
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="w-36 p-2  border border-neutral-300 focus:border-orange-400 outline-none rounded "
          />
        ) : (
          <input
            type={inputType}
            name={field}
            id={field}
            value={formData[field] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        )}
      </div>
    </div>
  );

  const handleSave = async () => {
    await onSave(formData);
  };

  return (
    <div className="space-y-10 w-full ">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">账户设置</h2>
      </div>
      <div className="space-y-10">
        {renderField("username", "用户名")}
        {renderField("email", "电子邮箱", "email")}
        {renderField("phone", "手机号码")}
        {renderField("language", "语言偏好")}
        {renderField("gender", "性别")}
        {renderField("birthDate", "出生日期")}
      </div>
      <button
        onClick={handleSave}
        className=" mt-4 mx-auto rounded-full  block py-3  px-6 border border-transparent shadow-sm font-medium  text-white bg-orange-400 hover:bg-orange-500 "
      >
        保存修改
      </button>
    </div>
  );
};

export default AccountSettings;

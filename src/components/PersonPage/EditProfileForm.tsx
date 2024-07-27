"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { UpdateProfileCredentials, User } from "@/app/lib/definitions";
import { updateProfile } from "@/app/lib/action";
import { useUserInfo } from "../UserContext";

export function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { user: currentUser } = useUserInfo();
  const [formData, setFormData] = useState<UpdateProfileCredentials>({
    id: user.id, // 确保 id 是数字类型
    name: user.name || "",
    introduction: user.introduction || "",
    loginPwd: "",
    reLoginPwd: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const dataToSubmit: UpdateProfileCredentials = {
        ...formData,
        avatarFile: avatarFile || undefined,
      };

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await updateProfile(dataToSubmit, token);

      if (response.code === 200) {
        router.push(`/profile/${user.id}`);
      } else {
        setError(response.msg || "更新失败，请重试。");
      }
    } catch (err) {
      setError("更新过程中发生错误，请重试。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          姓名
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="introduction"
          className="block text-sm font-medium text-gray-700"
        >
          个人简介
        </label>
        <textarea
          id="introduction"
          name="introduction"
          value={formData.introduction}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="avatarFile"
          className="block text-sm font-medium text-gray-700"
        >
          头像
        </label>
        <input
          type="file"
          id="avatarFile"
          name="avatarFile"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="loginPwd"
          className="block text-sm font-medium text-gray-700"
        >
          新密码（可选）
        </label>
        <input
          type="password"
          id="loginPwd"
          name="loginPwd"
          value={formData.loginPwd}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="reLoginPwd"
          className="block text-sm font-medium text-gray-700"
        >
          确认新密码
        </label>
        <input
          type="password"
          id="reLoginPwd"
          name="reLoginPwd"
          value={formData.reLoginPwd}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "更新中..." : "保存更改"}
        </button>
      </div>
    </form>
  );
}

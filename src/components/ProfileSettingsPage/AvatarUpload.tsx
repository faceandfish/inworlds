import React, { useState, useRef } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { FileUploadData, UserInfo } from "@/app/lib/definitions";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import { uploadAvatar } from "@/app/lib/action";
import { useTranslation } from "../useTranslation";

interface AvatarUploadProps {
  user: UserInfo;
  onAvatarChange: (newAvatarUrl: string) => Promise<void>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  user,
  onAvatarChange
}) => {
  const { t } = useTranslation("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (avatarFile) {
      setIsUploading(true);
      const fileData: FileUploadData = {
        avatarImage: avatarFile
      };
      try {
        const response = await uploadAvatar(fileData);
        if (response.code === 200 && response.data) {
          // 响应的 data 字段直接就是新的头像 URL
          const newAvatarUrl = response.data;
          await onAvatarChange(newAvatarUrl);
          setAvatarPreview(null);
          setAvatarFile(null);
          alert(t("avatarUpload.uploadSuccess"));
        } else {
          throw new Error(response.msg || t("avatarUpload.uploadFailed"));
        }
      } catch (error) {
        alert(
          `${t("avatarUpload.uploadFailed")}${
            error instanceof Error ? error.message : "未知错误"
          }`
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">
          {t("avatarUpload.title")}
        </h2>
      </div>
      <div className="flex flex-col items-center space-y-6 p-6">
        <div className="relative">
          <Image
            src={avatarPreview || getAvatarUrl(user.avatarUrl!)}
            alt={user.displayName || "avatar"}
            width={160}
            height={160}
            className="rounded-full object-cover w-40 h-40"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full p-3 bg-orange-500 hover:bg-orange-600 transition-colors duration-200 text-white shadow-lg"
          >
            <CameraIcon className="h-6 w-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div className="text-center space-y-10">
          <p className="text-sm text-gray-500 mt-5">
            {t("avatarUpload.uploadNew")}
            <br />
            {t("avatarUpload.bestSize")}
          </p>
          {avatarFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`px-6 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-colors duration-200 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading
                ? t("avatarUpload.uploading")
                : t("avatarUpload.saveNewAvatar")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;

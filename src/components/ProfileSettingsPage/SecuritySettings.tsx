"use client";
import React, { useCallback, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { ChangePasswordRequest } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { logger } from "../Main/logger";

interface SecuritySettingsProps {
  onPasswordChange: (passwordData: ChangePasswordRequest) => Promise<void>;
  showAlert: (message: string, type: "success" | "error") => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onPasswordChange,
  showAlert
}) => {
  const { t } = useTranslation("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert(t("securitySettings.fillAllFields"), "error");
        setIsSubmitting(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        showAlert(t("securitySettings.passwordMismatch"), "error");
        setIsSubmitting(false);
        return;
      }

      const passwordData: ChangePasswordRequest = {
        currentPassword,
        newPassword
      };

      try {
        await onPasswordChange(passwordData);
        // 不在这里显示成功消息，因为 onPasswordChange 现在负责显示所有消息
        // 只有当没有错误发生时才清空表单
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        logger.error("Password change error:", error, {
          context: "onPasswordChange"
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, onPasswordChange, showAlert]
  );

  const renderPasswordField = (
    id: string,
    label: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="flex flex-col md:flex-row md:items-center mb-4">
      <div className="w-full md:w-52 flex justify-start md:justify-end items-start md:items-center md:pr-4 mb-2 md:mb-0">
        <label htmlFor={id} className="text-sm font-medium text-neutral-600">
          {label}:
        </label>
      </div>
      <div className="w-full md:w-2/3 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockClosedIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="password"
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-2 pl-10 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="md:space-y-10 w-full">
      <div className="hidden md:block border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">
          {t("securitySettings.title")}
        </h2>
      </div>
      <form className="space-y-10" onSubmit={handleSubmit}>
        {renderPasswordField(
          "current-password",
          t("securitySettings.currentPassword"),
          t("securitySettings.enterCurrentPassword"),
          currentPassword,
          (e) => setCurrentPassword(e.target.value)
        )}
        {renderPasswordField(
          "new-password",
          t("securitySettings.newPassword"),
          t("securitySettings.enterNewPassword"),
          newPassword,
          (e) => setNewPassword(e.target.value)
        )}
        {renderPasswordField(
          "confirm-password",
          t("securitySettings.confirmNewPassword"),
          t("securitySettings.reenterNewPassword"),
          confirmPassword,
          (e) => setConfirmPassword(e.target.value)
        )}
        <button
          type="submit"
          className="mt-4 mx-auto rounded-full block py-3 px-6 border border-transparent shadow-sm font-medium text-white bg-orange-400 hover:bg-orange-500"
        >
          {t("securitySettings.updateSecuritySettings")}
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;

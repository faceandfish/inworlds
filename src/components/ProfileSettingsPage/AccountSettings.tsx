import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { UpdateUserRequest, UserInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { useUser } from "../UserContextProvider";
import { LanguageSelector } from "./LanguageSelector";
import { logger } from "../Main/logger";

type AccountSettingsFields = Pick<
  UpdateUserRequest,
  "email" | "phone" | "language" | "gender" | "birthDate"
>;

interface AccountSettingsProps {
  user: UserInfo;
  onSave: (updatedData: Partial<AccountSettingsFields>) => Promise<void>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onSave }) => {
  const { t } = useTranslation("profile");
  const { updateUser } = useUser();
  const [formData, setFormData] = useState<AccountSettingsFields>({
    email: user.email,
    phone: user.phone || "",
    language: user.language || "en",
    gender: user.gender || "male",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : ""
  });

  useEffect(() => {
    setFormData({
      email: user.email,
      phone: user.phone || "",
      language: user.language || "en",
      gender: user.gender || "other",
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : ""
    });
  }, [user]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: AccountSettingsFields) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (key === "language") return false;
        return value !== null && value !== "";
      })
    ) as Partial<AccountSettingsFields>;

    try {
      await onSave(filteredData);
      updateUser({ ...user, ...filteredData });
    } catch (error) {
      if (error instanceof Error && error.message === "成功") {
        return;
      }

      logger.error("onSave error:", error, { context: "handleSubmit" });
    }
  };

  const renderField = (
    field: keyof (AccountSettingsFields & { username: string }),
    inputType: string = "text"
  ) => (
    <div className="flex flex-col md:flex-row md:items-center mb-4">
      <div className="w-full md:w-52 flex justify-start md:justify-end items-start md:items-center md:pr-4 mb-2 md:mb-0">
        <label
          htmlFor={String(field)}
          className="flex items-center text-sm font-medium text-neutral-600"
        >
          {t(`accountSettings.${String(field)}`)}:
        </label>
      </div>
      <div className="w-full md:w-2/3">
        {field === "username" || field === "email" ? (
          <input
            type="text"
            id={String(field)}
            value={field === "username" ? user.username : user.email}
            className="w-full p-2 bg-gray-100 outline-none border-orange-400 rounded"
            disabled
          />
        ) : field === "gender" ? (
          <select
            name={String(field)}
            value={formData.gender}
            onChange={handleInputChange}
            className="w-36 border p-2 outline-none border-neutral-300 focus:border-orange-400 rounded"
          >
            <option value="male">{t("accountSettings.male")}</option>
            <option value="female">{t("accountSettings.female")}</option>
            <option value="other">{t("accountSettings.other")}</option>
          </select>
        ) : field === "language" ? (
          <LanguageSelector className="w-36" />
        ) : field === "birthDate" ? (
          <input
            type="date"
            name={String(field)}
            value={formData[field]}
            onChange={handleInputChange}
            className="w-36 p-2 border border-neutral-300 focus:border-orange-400 outline-none rounded"
          />
        ) : (
          <input
            type={inputType}
            name={String(field)}
            id={String(field)}
            value={formData[field as keyof AccountSettingsFields] || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-neutral-300 outline-none focus:border-orange-400 rounded"
          />
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="md:space-y-10 w-full">
      <div className="hidden md:block border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">
          {t("accountSettings.title")}
        </h2>
      </div>
      <div className="space-y-10">
        {renderField("username")}
        {renderField("email", "email")}
        {renderField("phone", "tel")}
        {renderField("language")}
        {renderField("gender")}
        {renderField("birthDate")}
      </div>
      <button
        type="submit"
        className="my-10 mx-auto rounded-full block py-3 px-6 border border-transparent shadow-sm font-medium text-white bg-orange-400 hover:bg-orange-500"
      >
        {t("accountSettings.saveChanges")}
      </button>
    </form>
  );
};

export default AccountSettings;

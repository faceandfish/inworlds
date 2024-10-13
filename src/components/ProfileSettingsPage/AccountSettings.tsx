import React, { useEffect, useState, FormEvent } from "react";

import { UpdateUserRequest, UserInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { i18n } from "@/app/i18n-config";
import { useUser } from "../UserContextProvider";

type AccountSettingsFields = Pick<
  UpdateUserRequest,
  "email" | "phone" | "language" | "gender" | "birthDate"
>;

interface AccountSettingsProps {
  user: UserInfo;
  onSave: (updatedData: Partial<AccountSettingsFields>) => Promise<void>;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onSave }) => {
  const { t, setLanguage } = useTranslation("profile");
  const { updateUser } = useUser();
  const [formData, setFormData] = useState<AccountSettingsFields>({
    email: user.email,
    phone: user.phone || "",
    language: user.language,
    gender: user.gender || "male",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : ""
  });

  useEffect(() => {
    setFormData({
      email: user.email,
      phone: user.phone || "",
      language: user.language,
      gender: user.gender || "other",
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : ""
    });
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      await onSave(formData);
      console.log("Form data saved successfully");

      updateUser({ ...user, ...formData });

      if (formData.language !== user.language) {
        setLanguage(formData.language!);
      }
    } catch (error) {
      console.error("保存失败:", error);
      // 可以在这里添加错误提示
    }
  };

  const renderLanguageOptions = () => {
    return i18n.locales.map((locale) => (
      <option key={locale} value={locale}>
        {t(`languages.${locale}`)}
      </option>
    ));
  };

  const renderField = (
    field: keyof AccountSettingsFields | "username",
    label: string,
    inputType: string = "text"
  ) => (
    <div className="flex flex-col md:flex-row md:items-center mb-4">
      <div className="w-full md:w-52  flex justify-start md:justify-end items-start md:items-center md:pr-4 mb-2 md:mb-0">
        <label
          htmlFor={field}
          className="flex items-center text-sm font-medium text-neutral-600"
        >
          {t(`accountSettings.${field}`)}:
        </label>
      </div>
      <div className="w-full md:w-2/3">
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
            value={formData.gender}
            onChange={handleInputChange}
            className="w-36 border p-2 outline-none border-neutral-300 focus:border-orange-400  rounded"
          >
            <option value="male">{t("accountSettings.male")}</option>
            <option value="female">{t("accountSettings.female")}</option>
            <option value="other">{t("accountSettings.other")}</option>
          </select>
        ) : field === "language" ? (
          <select
            name={field}
            value={formData.language}
            onChange={handleInputChange}
            className="w-36 p-2 border outline-none border-neutral-300 focus:border-orange-400  rounded"
          >
            {renderLanguageOptions()}
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

  return (
    <form onSubmit={handleSubmit} className="md:space-y-10 w-full">
      <div className="hidden md:block border-b pb-2">
        <h2 className="text-2xl font-bold text-neutral-600">账户设置</h2>
      </div>
      <div className="space-y-10">
        {renderField("username", t("accountSettings.username"))}
        {renderField("email", t("accountSettings.email"))}
        {renderField("phone", t("accountSettings.phone"))}
        {renderField("language", t("accountSettings.language"))}
        {renderField("gender", t("accountSettings.gender"))}
        {renderField("birthDate", t("accountSettings.birthDate"))}
      </div>
      <button
        type="submit"
        className=" my-10 mx-auto rounded-full  block py-3  px-6 border border-transparent shadow-sm font-medium  text-white bg-orange-400 hover:bg-orange-500 "
      >
        {t("accountSettings.saveChanges")}
      </button>
    </form>
  );
};

export default AccountSettings;

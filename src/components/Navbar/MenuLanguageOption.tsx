import React from "react";
import { IoLanguageOutline } from "react-icons/io5";
import { i18n, Locale } from "@/app/i18n-config";
import { useTranslation } from "../useTranslation";
import { useLanguageHandler } from "../useLanguageHandler";
import { FaChevronRight } from "react-icons/fa";

interface MenuLanguageOptionProps {
  variant: "mobile" | "desktop" | "auth-desktop";
}

const MenuLanguageOption: React.FC<MenuLanguageOptionProps> = ({ variant }) => {
  const { t, setLanguage } = useTranslation("profile");
  const { handleLanguageChange, getCurrentLanguage } = useLanguageHandler();

  const onLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const newLanguage = e.target.value as Locale;

      // 先更新本地状态
      setLanguage(newLanguage);

      // 等待路由更新完成
      const result = await handleLanguageChange(newLanguage);

      if (!result || result.code !== 200) {
      }
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const selectClasses = {
    mobile:
      "bg-transparent hover:bg-transparent focus:bg-transparent w-24 p-2 border outline-none border-neutral-300 focus:border-orange-400 rounded",
    desktop:
      "bg-transparent hover:bg-transparent focus:bg-transparent w-full text-base outline-none",
    "auth-desktop":
      "bg-transparent hover:bg-transparent focus:bg-transparent w-28 p-1.5 border outline-none border-neutral-300 focus:border-orange-400 rounded text-base"
  }[variant];

  const iconClasses = {
    mobile: "text-2xl mr-2",
    desktop: "text-2xl mr-5",
    "auth-desktop": "text-xl mr-2"
  }[variant];

  const containerClasses = {
    mobile: "flex items-center",
    desktop: "group/item border-b border-gray-100 px-4 py-2 hover:bg-gray-100",
    "auth-desktop": "flex items-center"
  }[variant];

  return (
    <div className={containerClasses} onClick={handleSelectClick}>
      <div className="flex items-center justify-between cursor-pointer w-full">
        <div className="flex items-center flex-grow">
          <IoLanguageOutline className={iconClasses} />
          <select
            value={getCurrentLanguage()}
            onChange={onLanguageChange}
            className={selectClasses}
            onClick={handleSelectClick}
          >
            {i18n.locales.map((locale: Locale) => (
              <option
                key={locale}
                value={locale}
                onClick={(e) => e.stopPropagation()}
              >
                {t(`languages.${locale}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MenuLanguageOption;

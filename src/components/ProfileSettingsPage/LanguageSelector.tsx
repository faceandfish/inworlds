import React from "react";
import { i18n, Locale } from "@/app/i18n-config";
import { useTranslation } from "../useTranslation";
import { useLanguageHandler } from "../useLanguageHandler";

export const LanguageSelector: React.FC<{ className?: string }> = ({
  className = ""
}) => {
  const { t, setLanguage } = useTranslation("profile");
  const { handleLanguageChange, getCurrentLanguage } = useLanguageHandler();

  const onLanguageChange = async (newLanguage: Locale) => {
    await handleLanguageChange(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <select
      value={getCurrentLanguage()}
      onChange={(e) => onLanguageChange(e.target.value as Locale)}
      className={`w-36 p-2 border outline-none border-neutral-300 focus:border-orange-400 rounded ${className}`}
    >
      {i18n.locales.map((locale: Locale) => (
        <option key={locale} value={locale}>
          {t(`languages.${locale}`)}
        </option>
      ))}
    </select>
  );
};

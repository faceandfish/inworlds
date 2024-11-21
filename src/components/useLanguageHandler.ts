// hooks/useLanguageHandler.ts

import { useRouter, useParams } from "next/navigation";
import { i18n, Locale } from "@/app/i18n-config";
import { updateUserLanguage, updatePublicLanguage } from "@/app/lib/action";
import { useUser } from "./UserContextProvider";

export const useLanguageHandler = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const handleLanguageChange = async (newLanguage: Locale) => {
    try {
      if (user) {
        const response = await updateUserLanguage(newLanguage);
        if (response.code === 200) {
          const currentPath = window.location.pathname;

          const newPath = currentPath.replace(/^\/[^/]+/, `/${newLanguage}`);

          if (newPath !== currentPath) {
            await router.push(newPath);
            router.refresh();
          } else {
            console.warn("Path didn't change:", currentPath, newPath);
          }
          return response; // 返回响应
        }
      } else {
        const response = await updatePublicLanguage(newLanguage);

        if (response.code === 200) {
          if (typeof window !== "undefined") {
            localStorage.setItem("preferredLanguage", newLanguage);
          }

          const currentPath = window.location.pathname;

          const newPath = currentPath.replace(/^\/[^/]+/, `/${newLanguage}`);

          await router.push(newPath);
          router.refresh();
          return response;
        }
      }
    } catch (error) {
      console.error("Language change failed:", error);
      throw error; // 抛出错误
    }
  };

  const getCurrentLanguage = (): Locale => {
    // 1. 未登录用户：优先使用 localStorage 中保存的语言选择
    if (!user) {
      const storedLanguage = localStorage.getItem(
        "preferredLanguage"
      ) as Locale;
      if (storedLanguage && i18n.locales.includes(storedLanguage)) {
        return storedLanguage;
      }
    }

    // 2. 已登录用户：使用用户设置的语言
    if (user?.language) {
      return user.language as Locale;
    }

    // 3. 如果以上都没有，才使用 URL 参数或默认语言
    return (params.lang as Locale) || "en";
  };

  return {
    handleLanguageChange,
    getCurrentLanguage
  };
};

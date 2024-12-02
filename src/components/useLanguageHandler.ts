// hooks/useLanguageHandler.ts
import { useRouter, useParams } from "next/navigation";
import { i18n, Locale } from "@/app/i18n-config";
import { updateUserLanguage, updatePublicLanguage } from "@/app/lib/action";
import { useUser } from "./UserContextProvider";
import { logger } from "./Main/logger";
import { useEffect, useRef } from "react";

export const useLanguageHandler = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const syncRef = useRef(false);

  useEffect(() => {
    const syncLanguageWithUser = async () => {
      if (!syncRef.current && user?.language) {
        const currentPath = window.location.pathname;
        const currentLang = currentPath.split("/")[1];

        if (currentLang !== user.language) {
          try {
            syncRef.current = true;
            const newPath = currentPath.replace(
              /^\/[^/]+/,
              `/${user.language}`
            );

            if (typeof window !== "undefined") {
              localStorage.setItem("preferredLanguage", user.language);
            }

            await router.push(newPath);
            router.refresh();
          } catch (error) {
            logger.error("Language sync failed", {
              error,
              context: "useLanguageHandler.syncLanguageWithUser",
              currentPath,
              userLanguage: user.language
            });
            syncRef.current = false;
          }
        }
      }
    };

    const timer = setTimeout(() => {
      syncLanguageWithUser();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [user, router]);

  const handleLanguageChange = async (newLanguage: Locale) => {
    try {
      let response;

      if (user) {
        response = await updateUserLanguage(newLanguage);
      } else {
        response = await updatePublicLanguage(newLanguage);
      }

      if (response.code === 200) {
        if (typeof window !== "undefined") {
          localStorage.setItem("preferredLanguage", newLanguage);
        }

        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/^\/[^/]+/, `/${newLanguage}`);

        if (newPath !== currentPath) {
          await router.push(newPath);
          router.refresh();
        }
        return response;
      }
    } catch (error) {
      logger.error("Language change failed", {
        error,
        context: "useLanguageHandler",
        newLanguage,
        currentPath: window.location.pathname,
        userId: user?.id
      });
      throw error;
    }
  };

  const getCurrentLanguage = (): Locale => {
    if (!user) {
      const storedLanguage =
        typeof window !== "undefined"
          ? (localStorage.getItem("preferredLanguage") as Locale)
          : null;

      if (storedLanguage && i18n.locales.includes(storedLanguage)) {
        return storedLanguage;
      }
    }

    if (user?.language) {
      return user.language as Locale;
    }

    return (params.lang as Locale) || "en";
  };

  return {
    handleLanguageChange,
    getCurrentLanguage
  };
};

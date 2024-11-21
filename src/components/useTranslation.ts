"use client";

import { getDictionary } from "@/app/dictionaries";
import { i18n, Locale, mapLanguage, Namespace } from "@/app/i18n-config";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "./UserContextProvider";

// 保留全局缓存对象
const translationCache: Record<string, Record<string, any>> = {};

const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

export function useTranslation(namespace: Namespace = "navbar") {
  const params = useParams();
  const [dict, setDict] = useState<Record<string, any>>({});
  const { user, updateUser } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    i18n.defaultLocale
  );

  // useTranslation.ts
  const locale = useMemo(() => {
    let selectedLocale: Locale = i18n.defaultLocale;

    // 1. 未登录用户：优先使用 localStorage
    if (!user) {
      const storage = getLocalStorage();
      if (storage) {
        const savedLanguage = storage.getItem("preferredLanguage");
        if (savedLanguage && i18n.locales.includes(savedLanguage as Locale)) {
          selectedLocale = savedLanguage as Locale;
          return selectedLocale;
        }
      }
    }

    // 2. 已登录用户：使用用户设置
    if (user?.language && i18n.locales.includes(user.language as Locale)) {
      selectedLocale = user.language as Locale;
      return selectedLocale;
    }

    // 3. 如果都没有，才使用 URL 参数
    if (params?.lang && i18n.locales.includes(params.lang as Locale)) {
      selectedLocale = params.lang as Locale;
    }

    return selectedLocale;
  }, [user, params.lang]);
  const loadTranslations = useCallback(async () => {
    const cacheKey = `${locale}:${namespace}`;
    if (translationCache[cacheKey]) {
      setDict(translationCache[cacheKey]);
      setIsLoaded(true);
    } else {
      try {
        const translations = await getDictionary(locale as Locale, namespace);
        translationCache[cacheKey] = translations;
        setDict(translations);
      } catch (error) {
        console.error(
          `Failed to load translations for ${locale}:${namespace}`,
          error
        );
      } finally {
        setIsLoaded(true);
      }
    }
  }, [locale, namespace]);

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  const setLanguage = useCallback(
    (newLanguage: Locale) => {
      const mappedLanguage = mapLanguage(newLanguage);
      setCurrentLocale(mappedLanguage as Locale);
      updateUser({ ...user, language: newLanguage });
    },
    [user, updateUser]
  );

  const t = useCallback(
    (key: string, variables?: Record<string, any>): string => {
      const keys = key.split(".");
      let translation: any = dict;

      for (const k of keys) {
        translation = translation?.[k];
        if (translation === undefined) {
          return key; // 如果找不到翻译，返回原始 key
        }
      }

      if (typeof translation !== "string") {
        return key; // 如果最终值不是字符串，返回原始 key
      }

      if (variables) {
        Object.entries(variables).forEach(([varKey, value]) => {
          translation = translation.replace(
            new RegExp(`\\{${varKey}\\}`, "g"),
            String(value)
          );
        });
      }

      return translation;
    },
    [dict]
  );

  // 获取浏览器语言
  const browserLanguage = useMemo(() => {
    if (typeof window !== "undefined") {
      return navigator.language;
    }
    return null;
  }, []);

  return {
    t,
    isLoaded,
    lang: locale,
    setLanguage,
    browserLanguage
  };
}

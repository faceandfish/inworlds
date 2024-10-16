"use client";

import { getDictionary } from "@/app/dictionaries";
import { i18n, Locale, mapLanguage, Namespace } from "@/app/i18n-config";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "./UserContextProvider";

// 保留全局缓存对象
const translationCache: Record<string, Record<string, any>> = {};

export function useTranslation(namespace: Namespace = "navbar") {
  const params = useParams();
  const [dict, setDict] = useState<Record<string, any>>({});
  const { user, updateUser } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    i18n.defaultLocale
  );

  const locale = useMemo(() => {
    let selectedLocale: Locale;
    if (user?.language && i18n.locales.includes(user.language as Locale)) {
      selectedLocale = user.language as Locale;
    } else if (params.lang && i18n.locales.includes(params.lang as Locale)) {
      selectedLocale = params.lang as Locale;
    } else {
      selectedLocale = i18n.defaultLocale;
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

  return { t, isLoaded, lang: locale, setLanguage };
}

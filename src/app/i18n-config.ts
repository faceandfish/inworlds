export const i18n = {
  defaultLocale: "en",
  locales: ["en", "cn", "tw", "ja"],
  namespaces: [
    "navbar",
    "seo",
    "alert",
    "book",
    "bookedit",
    "message",
    "profile",
    "studio",
    "wallet",
    "authorArea"
  ],
  languageMapping: {
    "zh-cn": "cn",
    "zh-tw": "tw",
    "zh-hk": "tw", // 假设香港使用繁体中文
    ja: "ja",
    en: "en",
    cn: "cn",
    tw: "tw"
    // 可以根据需要添加更多映射
  }
} as const;

export type Locale = (typeof i18n)["locales"][number];
export type Namespace = (typeof i18n)["namespaces"][number];

export function mapLanguage(lang: string): Locale {
  lang = lang.toLowerCase();

  // 检查完整的语言代码（例如 "zh-cn"）
  if (lang in i18n.languageMapping) {
    return i18n.languageMapping[
      lang as keyof typeof i18n.languageMapping
    ] as Locale;
  }

  // 检查主要语言代码（例如 "zh"）
  const mainLang = lang.split("-")[0];
  const mappedLang = Object.keys(i18n.languageMapping).find((key) =>
    key.startsWith(mainLang)
  );
  if (mappedLang) {
    return i18n.languageMapping[
      mappedLang as keyof typeof i18n.languageMapping
    ] as Locale;
  }

  // 如果没有匹配的语言，返回默认语言
  return i18n.defaultLocale;
}

export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim());

    for (const lang of languages) {
      const mappedLang = mapLanguage(lang);
      if (i18n.locales.includes(mappedLang)) {
        return mappedLang;
      }
    }
  }

  return i18n.defaultLocale;
}

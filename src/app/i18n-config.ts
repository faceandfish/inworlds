export const i18n = {
  defaultLocale: "en",
  locales: ["en", "zh-CN", "zh-TW", "ja"],
  namespaces: [
    "navbar",
    "alert",
    "book",
    "bookedit",
    "message",
    "profile",
    "studio",
    "wallet",
    "authorArea",
    "help"
  ]
} as const;

export type Locale = (typeof i18n)["locales"][number];
export type Namespace = (typeof i18n)["namespaces"][number];
export type Dictionary = {
  [key: string]: string | Dictionary;
};

export function mapLanguage(lang: string): Locale {
  // 转换输入的语言代码为标准格式
  const normalizedLang = lang
    .split("-")
    .map((part, index) =>
      index === 0 ? part.toLowerCase() : part.toUpperCase()
    )
    .join("-");

  // 直接检查是否在支持的语言列表中
  if (i18n.locales.includes(normalizedLang as Locale)) {
    return normalizedLang as Locale;
  }

  // 处理简化的中文代码情况（如 'zh'）
  if (normalizedLang.startsWith("zh")) {
    // 默认使用简体中文
    return "zh-CN";
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

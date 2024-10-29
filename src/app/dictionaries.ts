import { Locale, Namespace } from "./i18n-config";

const dictionaries = {
  en: (namespace: Namespace) =>
    import(`../locales/en/${namespace}.json`).then((module) => module.default),
  "zh-CN": (namespace: Namespace) =>
    import(`../locales/zh-CN/${namespace}.json`).then(
      (module) => module.default
    ),
  "zh-TW": (namespace: Namespace) =>
    import(`../locales/zh-TW/${namespace}.json`).then(
      (module) => module.default
    ),
  ja: (namespace: Namespace) =>
    import(`../locales/ja/${namespace}.json`).then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale, namespace: Namespace) =>
  dictionaries[locale](namespace);

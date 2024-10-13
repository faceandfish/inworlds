import { Locale, Namespace } from "./i18n-config";

const dictionaries = {
  en: (namespace: Namespace) =>
    import(`../locales/en/${namespace}.json`).then((module) => module.default),
  cn: (namespace: Namespace) =>
    import(`../locales/cn/${namespace}.json`).then((module) => module.default),
  tw: (namespace: Namespace) =>
    import(`../locales/tw/${namespace}.json`).then((module) => module.default),
  ja: (namespace: Namespace) =>
    import(`../locales/ja/${namespace}.json`).then((module) => module.default)
} as const;

export const getDictionary = async (locale: Locale, namespace: Namespace) =>
  dictionaries[locale](namespace);

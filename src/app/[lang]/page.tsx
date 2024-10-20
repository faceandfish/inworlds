import { fetchHomepageBooks } from "@/app/lib/action";
import { Metadata } from "next";
import { getDictionary } from "../dictionaries";
import { Locale, Namespace, Dictionary } from "../i18n-config";
import HomePage from "@/components/Main/HomePage";

type Props = {
  params: { lang: Locale };
};

export default async function Home({ params }: Props) {
  const lang = params.lang;
  const dict = await getDictionary(lang, "navbar" as Namespace);

  const initialBooksResponse = await fetchHomepageBooks(1);
  const initialBooks = initialBooksResponse.data.dataList;

  return <HomePage initialBooks={initialBooks} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  const dict = await getDictionary(lang, "seo" as Namespace);
  return {
    title: lang === "en" ? "InWorlds" : `InWorlds - ${lang.toUpperCase()}`,
    description: dict.description
  };
}

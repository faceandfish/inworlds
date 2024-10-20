import { fetchHomepageBooks } from "@/app/lib/action";
import { Metadata } from "next";
import { getDictionary } from "../dictionaries";
import { Locale, Namespace, Dictionary } from "../i18n-config";
import HomePage from "@/components/Main/HomePage";
import { GetServerSideProps } from "next";
import { BookInfo } from "../lib/definitions";

type Props = {
  params: { lang: Locale };
  initialBooks: BookInfo[]; // 使用适当的类型替换 any[]
  dict: Dictionary; // 使用适当的类型替换 any
};

export default function Home({ initialBooks, dict }: Props) {
  return <HomePage initialBooks={initialBooks} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const lang = params?.lang as Locale;
  const dict = await getDictionary(lang, "navbar" as Namespace);

  const initialBooksResponse = await fetchHomepageBooks(1);
  const initialBooks = initialBooksResponse.data.dataList;

  return {
    props: {
      initialBooks,
      dict,
      params: { lang }
    }
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang;
  const dict = await getDictionary(lang, "seo" as Namespace);
  return {
    title: lang === "en" ? "InWorlds" : `InWorlds - ${lang.toUpperCase()}`,
    description: dict.description
  };
}

import { BookInfo } from "@/app/lib/definitions";
import { fetchHomepageBooks } from "@/app/lib/action";
import { Metadata } from "next";
import { getDictionary } from "../dictionaries";
import { Locale, Namespace } from "../i18n-config"; // 更新导入
import HomePage from "@/components/HomePage";

type Props = {
  params: { lang: Locale };
};

export default async function Home({ params: { lang } }: Props) {
  const dict = await getDictionary(lang, "navbar" as Namespace); // 使用 'navbar' 作为示例

  const initialBooksResponse = await fetchHomepageBooks(1);
  const initialBooks = initialBooksResponse.data.dataList;

  return <HomePage initialBooks={initialBooks} />;
}

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "cn" },
    { lang: "tw" },
    { lang: "ja" }
  ] as const;
}

export async function generateMetadata({
  params: { lang }
}: Props): Promise<Metadata> {
  const dict = await getDictionary(lang, "seo" as Namespace); // 使用 'seo' 命名空间
  return {
    title: lang === "en" ? "InWorlds" : `InWorlds - ${lang.toUpperCase()}`,
    description: dict.description // 假设 description 直接在 dict 对象中
  };
}

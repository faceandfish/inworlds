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

  // 直接在代码中维护优化过的SEO内容
  const seoContent = {
    en: {
      title: "InWorlds - Write Stories & Earn Like YouTube Creators",
      description:
        "Join InWorlds to write stories and earn 50% ad revenue like YouTube creators. A modern alternative to AO3 with monetization features. Start writing and earning today!"
    },
    "zh-CN": {
      title: "InWorlds - 创作故事赚取收益 | 更自由的创作平台",

      description:
        "加入InWorlds，创作故事即可获得50%广告收益。结合起点、晋江、番茄、七猫的创作平台的创作平台，支持多种题材，无限制创作。像YouTube一样赚钱，支持中文创作，全球分享，立即开始创作并获得收益！"
    },
    "zh-TW": {
      title: "InWorlds - 創作故事賺取收益 | 像YouTube創作者一樣賺錢",
      description:
        "加入InWorlds，創作故事即可獲得50%廣告收益。结合POPO、魔豆、創作者村的創作平台，支持多種題材，無限制創作。像YouTube創作者一樣賺錢，支持繁體中文創作，全球分享，立即開始創作並獲得收益！"
    },
    ja: {
      title:
        "InWorlds - 小説投稿サイト | なろう系より収益化できるプラットフォーム",
      description:
        "小説家になろう、カクヨム、ピッコマのような小説投稿サイトをお探しですか？InWorldsなら広告収入の50%を獲得できます！ライトノベル、web小説の投稿が可能で、YouTubeクリエイターのように収益化できます。グローバルな読者層にリーチ可能！"
    }
  };

  return {
    title: seoContent[lang as keyof typeof seoContent].title,
    description: seoContent[lang as keyof typeof seoContent].description,
    alternates: {
      languages: {
        en: "/en",
        "zh-CN": "/zh-CN",
        "zh-TW": "/zh-TW",
        ja: "/ja"
      },
      canonical: `https://inworlds.xyz/${lang}`
    },
    openGraph: {
      title: seoContent[lang as keyof typeof seoContent].title,
      description: seoContent[lang as keyof typeof seoContent].description,
      url: `https://inworlds.xyz/${lang}`,
      locale: lang
    }
  };
}

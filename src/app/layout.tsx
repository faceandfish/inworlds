import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import logo from "../../public/inworlds.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://inworlds.xyz"), // 替换成您的域名
  title: {
    default:
      "InWorlds - Earn Money Writing Stories | 50% Revenue Share Writing Platform",
    template: "%s | InWorlds - Write & Earn"
  },
  description:
    "Looking for AO3 alternative? InWorlds offers free story writing platform with 50% revenue share from ads. Like Archive of Our Own but with earnings. Write fanfiction, original stories in multiple languages and earn like YouTube creators. Better than AO3 with monetization features.",
  keywords: [
    // AO3 相关关键词
    "AO3",
    "Archive of Our Own",
    "AO3 alternative",
    "better than AO3",
    "like AO3",
    "fanfiction site",
    "fanfic platform",
    "AO3 with earnings",
    "modern AO3",
    "AO3 replacement",
    // 创作相关
    "fiction writing",
    "creative writing",
    "fanfiction",
    "AO3 alternative",
    "web novels",
    "story creation",
    // 收益相关
    "earn money writing",
    "writing income",
    "story monetization",
    "revenue share writing",
    "paid storytelling",
    "YouTube model writing",
    "50% revenue share",
    "writing platform with ads",
    // 平台特色
    "multilingual stories",
    "global storytelling",
    "writing community",
    "free writing platform",
    "author earnings"
  ],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    siteName: "InWorlds",
    title: "InWorlds - Write Stories & Earn 50% Revenue Share",
    description:
      "Turn your creativity into income! Write stories and earn 50% of ad revenue, just like YouTube's model. A free multilingual platform with guaranteed earnings for writers. Start writing and earning today!",
    images: [
      {
        url: logo.src,
        width: logo.width, // 添加宽度
        height: logo.height, // 添加高度
        alt: "InWorlds - Write Stories & Earn Money" // 添加替代文本
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Write Stories & Earn 50% Revenue Share on InWorlds",
    description:
      "Create stories, build audience, and earn money with 50% ad revenue share. A modern platform combining creativity with income opportunities.",
    images: [logo.src]
  },
  alternates: {
    languages: {
      en: "/en",
      "zh-CN": "/zh-cn",
      "zh-TW": "/zh-tw",
      ja: "/ja"
    }
  }
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

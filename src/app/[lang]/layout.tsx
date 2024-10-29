"use client";
import { UserProvider } from "@/components/UserContextProvider";
import Navbar from "@/components/Navbar";
import { PurchasedChaptersProvider } from "@/components/PurchasedChaptersProvider.tsx";
import { Suspense } from "react";
import UserMenuSkeleton from "@/components/Navbar/Skeleton/UserMenuSkeleton";
import AdSenseScript from "@/components/AdSenseScript";
import { usePathname } from "next/navigation";

export default function LangLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const pathname = usePathname();
  const isChapterPage = /^\/[a-z]{2}\/book\/\d+\/chapter\/\d+$/.test(pathname);

  return (
    <UserProvider>
      <PurchasedChaptersProvider>
        <AdSenseScript />
        <Suspense fallback={<UserMenuSkeleton />}>
          <Navbar className="fixed top-0 w-full z-50" />{" "}
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <main
            className={`flex-grow ${
              isChapterPage
                ? "md:pt-16 md:pb-0" // 在章节页面，仅在桌面端添加padding
                : "pt-16 pb-16 md:pb-0" // 在其他页面保持原有padding
            }`}
          >
            {children}
          </main>
        </div>
      </PurchasedChaptersProvider>
    </UserProvider>
  );
}

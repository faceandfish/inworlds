import { UserProvider } from "@/components/UserContextProvider";
import Navbar from "@/components/Navbar";
import { PurchasedChaptersProvider } from "@/components/PurchasedChaptersProvider.tsx";
import { Suspense } from "react";
import UserMenuSkeleton from "@/components/Navbar/Skeleton/UserMenuSkeleton";

export default function LangLayout({
  children,
  params: { lang }
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <UserProvider>
      <PurchasedChaptersProvider>
        <Suspense fallback={<UserMenuSkeleton />}>
          <Navbar className="fixed top-0 w-full z-50" />{" "}
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pt-16 pb-16 md:pb-0">{children}</main>
        </div>
      </PurchasedChaptersProvider>
    </UserProvider>
  );
}

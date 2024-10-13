import { UserProvider } from "@/components/UserContextProvider";
import Navbar from "@/components/Navbar";
import { PurchasedChaptersProvider } from "@/components/PurchasedChaptersProvider.tsx";

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
        <Navbar className="fixed top-0 w-full z-50" />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pt-16 pb-16 md:pb-0">{children}</main>
        </div>
      </PurchasedChaptersProvider>
    </UserProvider>
  );
}

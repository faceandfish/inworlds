"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { useUser } from "../UserContextProvider";
import UserMenuSkeleton from "./Skeleton/UserMenuSkeleton";
import { IoIosSearch } from "react-icons/io";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { user, loading } = useUser();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 检查是否为章节页面，支持任意两个小写字母的语言代码
  const isChapterPage = /^\/[a-z]{2}\/book\/\d+\/chapter\/\d+$/.test(pathname);

  // 检查是否为搜索页面
  const isSearchPage = pathname.endsWith("/search") && searchParams.has("q");

  useEffect(() => {
    // 如果是搜索页面，自动展开搜索栏
    setIsSearchExpanded(isSearchPage);
  }, [isSearchPage]);

  // 如果是章节页面，不渲染 Navbar
  if (isChapterPage) {
    return null;
  }

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    if (isSearchPage) {
      // 如果在搜索页面，关闭搜索栏时返回上一页
      router.push("/");
    }
  };

  return (
    <nav className={`bg-white border-b ${className}`}>
      {isSearchExpanded || isSearchPage ? (
        <div className="h-16">
          <SearchBar isExpanded={true} onClose={handleSearchClose} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4 md:px-16 h-16">
            <Logo />
            <div className="hidden md:block flex-grow mx-4">
              <SearchBar />
            </div>
            <div className="hidden md:block">
              {loading ? (
                <UserMenuSkeleton />
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <AuthButtons isMobile={false} />
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="flex items-center justify-center h-10 w-10 text-orange-400"
              >
                <IoIosSearch className="text-2xl" />
              </button>
            </div>
          </div>
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="flex justify-center h-16">
              {loading ? (
                <UserMenuSkeleton />
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <AuthButtons isMobile={true} />
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;

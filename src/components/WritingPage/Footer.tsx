import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Pagination from "../Pagination";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = 4; // 固定的页面总数
  const pages = ["intro", "cover", "content", "authornote"];

  // 根据当前路径确定当前页码
  const currentPageIndex = pages.findIndex((page) => pathname.includes(page));
  const currentPage = currentPageIndex !== -1 ? currentPageIndex + 1 : 1;

  // 更新 URL 搜索参数以反映正确的页码
  const updatedSearchParams = new URLSearchParams(searchParams);
  updatedSearchParams.set("page", currentPage.toString());

  return (
    <footer className="py-10">
      <div className="max-w-7xl mx-auto">
        <Pagination totalPages={totalPages} />
      </div>
    </footer>
  );
};

export default Footer;

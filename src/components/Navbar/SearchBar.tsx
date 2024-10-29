"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "../useTranslation";
import { getSearchHistory } from "@/app/lib/action";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useUser } from "@/components/UserContextProvider";
import { ApiResponse, SearchHistoryItem } from "@/app/lib/definitions";

interface SearchBarProps {
  isExpanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isExpanded = false,
  onClose
}) => {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const { t, isLoaded } = useTranslation("navbar");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lang = pathname?.split("/")[1] || "en";
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
      setShowHistory(true);
      fetchSearchHistory();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 确保点击的目标不是搜索框内的元素
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        !document
          .querySelector(".history-dropdown")
          ?.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    // 将事件监听添加到捕获阶段
    document.addEventListener("mousedown", handleClickOutside, true);

    // 清理函数
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const fetchSearchHistory = async () => {
    if (!user) return;

    try {
      const response = await getSearchHistory();

      if (response.code === 200) {
        const sortedHistory = response.data.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );
        setHistory(sortedHistory); // 设置历史记录数组
      }
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const handleInputFocus = async () => {
    setShowHistory(true);
    await fetchSearchHistory();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setShowHistory(false);
    if (isExpanded && onClose) {
      onClose();
    }
    router.push(`/${lang}/search?q=${encodeURIComponent(query)}`);
  };

  const handleHistoryItemClick = (keyword: string) => {
    console.log("History item clicked:", keyword);
    setQuery(keyword);
    setShowHistory(false);

    router.push(`/${lang}/search?q=${encodeURIComponent(keyword)}`);

    if (isExpanded && onClose) {
      onClose();
    }
  };

  const renderSearchBar = () => (
    <div className="flex w-full justify-center relative">
      <div ref={searchBarRef} className="w-full md:w-2/3 ">
        <form className="flex w-full  text-neutral-600" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            className="border-orange-400 border w-full  h-10 px-6 focus:outline-none font-light rounded-tl-3xl rounded-bl-3xl"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-orange-400 rounded-tr-3xl rounded-br-3xl hover:bg-orange-500 h-10 w-14"
            aria-label={t("search")}
          >
            <IoIosSearch className="text-2xl text-white" />
          </button>
        </form>

        {showHistory && !isExpanded && (
          <div className="absolute top-full left-0 w-full flex justify-center px-5 md:px-0 mt-2">
            <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-[100]">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleHistoryItemClick(item.keyword)}
                  >
                    <ClockIcon className=" w-5 text-neutral-400 mr-3" />
                    <span className="text-neutral-600">{item.keyword}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-neutral-500 text-center">
                  {!isLoaded ? (
                    <div className="flex justify-center py-1">
                      <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                  ) : user ? (
                    t("noSearchHistory")
                  ) : (
                    t("loginToSeeHistory")
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center p-4 border-b border-gray-100">
          <button
            type="button"
            className="py-2 pr-2"
            onClick={onClose}
            aria-label={t("closeSearch")}
          >
            <IoMdClose className="text-2xl text-gray-600" />
          </button>
          {renderSearchBar()}
        </div>

        <div className="flex-1 bg-white overflow-y-auto">
          {history.length > 0 ? (
            history.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  console.log("Item clicked"); // 添加日志
                  handleHistoryItemClick(item.keyword);
                }}
              >
                <ClockIcon className="w-5 text-neutral-400 mr-3 flex-shrink-0" />
                <span className="text-neutral-600 truncate">
                  {item.keyword}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-neutral-500 text-center">
              {!isLoaded ? (
                <div className="flex justify-center py-1">
                  <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                t("noSearchHistory")
              ) : (
                t("loginToSeeHistory")
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return renderSearchBar();
};

export default SearchBar;

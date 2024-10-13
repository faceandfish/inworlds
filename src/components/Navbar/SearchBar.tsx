// "use client";
// import React, { useState } from "react";
// import { IoIosSearch } from "react-icons/io";
// import { useRouter } from "next/navigation";
// import { useTranslation } from "../useTranslation";

// const SearchBar = () => {
//   const [query, setQuery] = useState("");
//   const router = useRouter();
//   const { t } = useTranslation("navbar");

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     router.push(`/search?q=${encodeURIComponent(query)}`);
//   };

//   return (
//     <form className="flex" onSubmit={handleSearch}>
//       <input
//         className="border-orange-400 border w-80 h-10 px-6 focus:outline-none font-light rounded-tl-3xl rounded-bl-3xl"
//         type="text"
//         placeholder={t("searchPlaceholder")}
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <button
//         type="submit"
//         className="flex items-center justify-center bg-orange-400 rounded-tr-3xl rounded-br-3xl hover:bg-orange-500 h-10 w-14"
//         aria-label={t("search")}
//       >
//         <IoIosSearch className="text-2xl text-white" />
//       </button>
//     </form>
//   );
// };

// export default SearchBar;

"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "../useTranslation";
import { getSearchHistory } from "@/app/lib/action";

interface SearchBarProps {
  isExpanded?: boolean;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isExpanded = false,
  onClose
}) => {
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("navbar");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lang = pathname?.split("/")[1] || "en";
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // useEffect(() => {
  //   fetchSearchHistory();
  // }, []);

  // const fetchSearchHistory = async () => {
  //   try {
  //     const history = await getSearchHistory();
  //     setSearchHistory(history.data);
  //   } catch (error) {
  //     console.error("Error fetching search history:", error);
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowHistory(true);
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setShowHistory(false);
    if (onClose) onClose();
    router.push(`/${lang}/search?q=${encodeURIComponent(query)}`);
  };

  const handleHistoryItemClick = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    if (onClose) onClose();
    router.push(`/${lang}/search?q=${encodeURIComponent(item)}`);
  };

  const renderSearchBar = () => (
    <div ref={searchBarRef} className="flex w-full justify-center relative">
      <form
        className="flex md:w-2/3 md:px-0 w-full px-5 text-neutral-600"
        onSubmit={handleSearch}
      >
        <input
          ref={inputRef}
          className="border-orange-400 border w-full h-10 px-6 focus:outline-none font-light rounded-tl-3xl rounded-bl-3xl"
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowHistory(true)}
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-orange-400 rounded-tr-3xl rounded-br-3xl hover:bg-orange-500 h-10 w-14"
          aria-label={t("search")}
        >
          <IoIosSearch className="text-2xl text-white" />
        </button>
      </form>
      {/* {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md mt-1 rounded-md max-h-60 overflow-y-auto">
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleHistoryItemClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-white h-16  z-50 flex flex-col">
        <div className="flex items-center p-4 ">
          <button
            type="button"
            className="mr-2"
            onClick={onClose}
            aria-label={t("closeSearch")}
          >
            <IoMdClose className="text-2xl" />
          </button>
          {renderSearchBar()}
        </div>
      </div>
    );
  }

  return renderSearchBar();
};

export default SearchBar;

import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 导航到搜索结果页面
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className="flex" onSubmit={handleSearch}>
      <input
        className="border-orange-400 border w-80 h-10 px-6 focus:outline-none font-light rounded-tl-3xl rounded-bl-3xl"
        type="text"
        placeholder="搜索书籍或作者..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="flex items-center justify-center bg-orange-400 rounded-tr-3xl rounded-br-3xl hover:bg-orange-500 h-10 w-14"
      >
        <IoIosSearch className="text-2xl text-white" />
      </button>
    </form>
  );
};

export default SearchBar;

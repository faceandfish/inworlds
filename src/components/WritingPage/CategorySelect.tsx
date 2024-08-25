import React from "react";
import { BookInfo } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径

interface CategorySelectProps {
  value: BookInfo["category"];
  onChange: (newValue: BookInfo["category"]) => void;
  error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  error
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as BookInfo["category"]);
  };

  const categories = [
    { value: "female-story", label: "女性故事" },
    { value: "male-story", label: "男性故事" },
    { value: "children-story", label: "儿童故事" },
    { value: "personal-story", label: "个人专栏" },
    { value: "literature-story", label: "文学作品" }
  ];

  return (
    <div className="space-y-5 ">
      <label
        htmlFor="book-category"
        className="block text-2xl font-medium text-gray-700 mb-1"
      >
        作品分类
      </label>
      <p className="text-sm bg-yellow-50 border-l-4 border-yellow-400  p-2  text-yellow-700">
        提示：请根据您作品的主要风格和目标读者群体选择最合适的分类。
      </p>
      <select
        id="book-category"
        name="category"
        value={value}
        onChange={handleInputChange}
        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 ease-in-out"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;

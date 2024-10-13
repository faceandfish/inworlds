import React from "react";
import { BookInfo } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径
import { useTranslation } from "../useTranslation";

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
  const { t } = useTranslation("book");

  const categories = [
    { value: "female-story", label: t("categorySelect.femaleStory") },
    { value: "male-story", label: t("categorySelect.maleStory") },
    { value: "children-story", label: t("categorySelect.childrenStory") },
    { value: "personal-story", label: t("categorySelect.personalColumn") },
    { value: "literature-story", label: t("categorySelect.literaryWork") }
  ];

  return (
    <div className="space-y-5 ">
      <label
        htmlFor="book-category"
        className="block text-2xl font-medium text-gray-700 mb-1"
      >
        {t("categorySelect.title")}
      </label>
      <p className="text-sm bg-yellow-50 border-l-4 border-yellow-400  p-2  text-yellow-700">
        {t("categorySelect.tip")}
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

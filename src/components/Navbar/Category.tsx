import Link from "next/link";
import React from "react";
import { useTranslation } from "../useTranslation";

interface CategoryItemProps {
  href?: string;
  label: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ href, label }) => {
  const content = (
    <div className="w-full   h-full md:px-5 flex items-center justify-center">
      {label}
    </div>
  );

  return (
    <li className="h-10 text-neutral-400 hover:bg-orange-400 hover:text-white">
      {href ? (
        <Link href={href} className="block w-full h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
};

function Category() {
  const { t } = useTranslation("navbar");

  const categories: CategoryItemProps[] = [
    { href: "/messages", label: t("favorites") },
    // { label: t("newBooks") },
    { href: "/for-authors", label: t("forAuthors") }
  ];

  return (
    <div className="w-full my-10 border-gray-200 border-b">
      <ul className="flex justify-evenly md:justify-start">
        {categories.map((category, index) => (
          <CategoryItem key={index} {...category} />
        ))}
      </ul>
    </div>
  );
}

export default Category;

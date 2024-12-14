"use client";
import { BookInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import BookDescriptionSkeleton from "./skeleton/BookDescriptionSkeleton";

interface BookDescriptionProps {
  book: BookInfo;
}

export const BookDescription: React.FC<BookDescriptionProps> = ({ book }) => {
  const { t, isLoaded } = useTranslation("book");
  if (!isLoaded) {
    return <BookDescriptionSkeleton />; 
  }
  return (
    <div className="w-full min-h-32 my-8 md:my-16">
      <p className="text-xl pb-2 border-b border-gray-100">
        {t("workIntroduction")}
      </p>
      <p className="font-light mt-2 px-2 md:px-10">{book.description}</p>
    </div>
  );
};

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookInfo } from "@/app/lib/definitions";
import { getImageUrl } from "@/app/lib/imageUrl";
import { useTranslation } from "../useTranslation";

interface FavoriteBookPreviewCardProps {
  book: BookInfo;
}

export const FavoriteBookPreviewCard: React.FC<
  FavoriteBookPreviewCardProps
> = ({ book }) => {
  const { t } = useTranslation("message");
  return (
    <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg">
      <Image
        src={getImageUrl(book.coverImageUrl || "")}
        alt={`Cover of ${book.title}` || "booktitle"}
        width={80}
        height={80}
        className="object-cover rounded"
      />
      <div className="flex-grow">
        <Link href={`/book/${book.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600">
          {t("favoriteBookPreviewCard.author")} {book.authorName}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {t("favoriteBookPreviewCard.latestChapter")}第
          {book.latestChapterNumber} {book.latestChapterTitle}
        </p>
      </div>
    </div>
  );
};

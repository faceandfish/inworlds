import Link from "next/link";
import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import { getImageUrl } from "@/app/lib/imageUrl";

interface ClipProps {
  book: BookInfo;
  width?: string;
  height?: string;
}

export const BookPreviewCard = React.memo(
  ({ book, width = "w-80", height = "h-48" }: ClipProps) => {
    console.log("Book ID:", book.id);
    return (
      <Link href={`/book/${book.id.toString()}`}>
        <div className={`flex ${width} ${height} flex-1 hover:bg-neutral-50`}>
          <div className="w-36 h-full border  rounded flex-shrink-0 overflow-hidden">
            {book.coverImageUrl ? (
              <img
                src={getImageUrl(book.coverImageUrl)}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`图片加载失败: ${book.coverImageUrl}`);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                封面
              </div>
            )}
          </div>
          <div className="flex flex-col mx-5 justify-around">
            <div className="text-xl font-bold">{book.title}</div>
            <div className="line-clamp-4 text-sm text-gray-600">
              {book.description}
            </div>
            <div>
              <p className="text-sm text-gray-500">{book.authorName}</p>
              <p className="text-sm text-orange-500">
                {book.followersCount}人在追
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

import Link from "next/link";
import React from "react";
import { BookInfo } from "@/app/lib/definitions";

interface ClipProps {
  book: BookInfo;
}

export function BookPreviewCard({ book }: ClipProps) {
  return (
    <Link href={`/${book.id}`}>
      <div className="flex w-80 h-48 flex-1 hover:bg-neutral-50">
        <div className="w-36 h-full bg-orange-400 rounded flex-shrink-0 overflow-hidden">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
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

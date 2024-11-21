"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import { getImageUrl } from "@/app/lib/imageUrl";
import Image from "next/image";
import AgeVerificationModal from "./AgeVerificationModal";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";

interface ClipProps {
  book: BookInfo;
  width?: string;
  height?: string;
}

const defaultCovers: string[] = [
  "cover1.jpg",
  "cover2.jpg",
  "cover3.jpg",
  "cover4.jpg"
];

export const BookPreviewCard = React.memo(
  ({ book, width = "w-80", height = "h-48" }: ClipProps) => {
    const [showAgeVerification, setShowAgeVerification] = useState(false);
    const { user } = useUser();
    const { t } = useTranslation("book");

    const handleBookClick = (e: React.MouseEvent) => {
      if (book.ageRating === "adult") {
        e.preventDefault();
        setShowAgeVerification(true);
      }
    };

    const handleConfirm = () => {
      setShowAgeVerification(false);
      window.location.href = `/book/${book.id.toString()}`;
    };

    const handleCancel = () => {
      setShowAgeVerification(false);
    };

    const isDefaultCover =
      book.coverImageUrl && defaultCovers.includes(book.coverImageUrl);

    return (
      <>
        <Link href={`/book/${book.id.toString()}`} onClick={handleBookClick}>
          <div
            className={`flex ${width} ${height} flex-1 hover:bg-neutral-50 overflow-hidden `}
          >
            <div className="w-36 h-full relative border  rounded flex-shrink-0 overflow-hidden">
              {book.coverImageUrl ? (
                <>
                  <Image
                    src={getImageUrl(book.coverImageUrl)}
                    width={400}
                    height={600}
                    alt={`${book.title} cover` || "cover"}
                    className="w-36 h-48 object-cover"
                    onError={(e) => {
                      console.error(
                        `Image loading failed: ${book.coverImageUrl}`
                      );
                    }}
                  />
                  {isDefaultCover && (
                    <div className="absolute inset-x-0 top-1/3 transform -translate-y-1/2 flex items-center justify-center  max-w-full px-2">
                      <p className="text-white text-center font-bold line-clamp-5 py-1 break-words bg-black bg-opacity-50 rounded ">
                        {book.title}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {t("cover")}
                </div>
              )}
            </div>
            <div className="flex flex-col py-2 mx-4 justify-start w-full min-w-0">
              <div className="text-xl font-bold overflow-hidden text-ellipsis  max-h-16 line-clamp-2 break-all mb-2">
                {book.title}
              </div>
              <p className="line-clamp-4 mb-2 min-h-0 text-sm text-gray-600 break-words whitespace-pre-wrap overflow-hidden">
                {book.description}
              </p>
              <div className="mt-auto pt-1">
                <p className="text-sm text-gray-500 break-all overflow-hidden text-ellipsis">
                  {book.authorName}
                </p>
                <p className="text-sm text-orange-500">
                  {book.views} {""}
                  {t("views")}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {showAgeVerification && (
          <AgeVerificationModal
            user={user!}
            book={book}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </>
    );
  }
);

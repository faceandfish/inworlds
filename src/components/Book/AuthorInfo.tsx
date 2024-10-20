"use client";
import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import Link from "next/link";
import FollowButton from "../ProfilePage/FollowButton";
import { useTranslation } from "../useTranslation";
import AuthorInfoSkeleton from "./skeleton/AuthorInfoSkeleton";

interface AuthorInfoProps {
  book: BookInfo;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ book }) => {
  const { t, isLoaded } = useTranslation("book");

  return (
    <div className="w-full md:w-80 border-t md:border-l border-gray-100 pt-6 md:pt-0 mt-6 md:mt-0 flex flex-col items-center justify-around space-y-4  pb-6 md:pb-0">
      <Link href={`/user/${book.authorId}`}>
        <Image
          src={getAvatarUrl(book.authorAvatarUrl)}
          alt={book.authorName || "authorname"}
          width={200}
          height={200}
          className="rounded-full w-24 h-24 cursor-pointer hover:brightness-90 transition-all duration-200"
        />
      </Link>
      <p>{book.authorName || t("author")}</p>
      <p className="text-sm text-neutral-600">
        {book.authorIntroduction || t("userLazy")}
      </p>
      <div className="flex gap-5 items-center">
        <FollowButton userId={book.authorId} />
        <p className="text-orange-400">
          {book.authorFollowersCount} {""}
          {t("peopleFollowing")}
        </p>
      </div>
    </div>
  );
};

export default AuthorInfo;

"use client";
import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import Link from "next/link";
import FollowButton from "../ProfilePage/FollowButton";

interface AuthorInfoProps {
  book: BookInfo;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({ book }) => {
  return (
    <div className="w-80 border-l border-gray-100 flex flex-col items-center justify-around">
      <Link href={`/user/${book.authorId}`}>
        <Image
          src={getAvatarUrl(book.authorAvatarUrl)}
          alt={book.authorName}
          width={200}
          height={200}
          className="rounded-full w-24 h-24 cursor-pointer hover:brightness-90 transition-all duration-200"
        />
      </Link>
      <p>{book.authorName || "作者"}</p>
      <p className="text-sm text-neutral-600">
        {book.authorIntroduction || "这个用户很懒，还没有填写个人介绍。"}
      </p>
      <div className="flex gap-5 items-center">
        <FollowButton userId={book.authorId} />
        <p className="text-orange-400">{book.authorFollowersCount}人已关注</p>
      </div>
    </div>
  );
};

export default AuthorInfo;

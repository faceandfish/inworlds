import React from "react";
import Image from "next/image";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import { PublicUserInfo } from "@/app/lib/definitions";
import Link from "next/link";

interface UserPreviewCardProps {
  user: PublicUserInfo;
}

export const UserPreviewCard: React.FC<UserPreviewCardProps> = ({ user }) => {
  return (
    <div className="   hover:bg-neutral-100 w-full">
      <Link
        href={`/user/${user.id}`}
        className="flex items-center pb-5 border-b "
      >
        <Image
          src={getAvatarUrl(user.avatarUrl!)}
          alt={user.displayName || user.username}
          width={200}
          height={200}
          className="rounded-full w-28 h-28"
        />
        <div className="ml-8">
          <h3 className="font-semibold">{user.displayName || user.username}</h3>
          <p className="text-sm  text-gray-600">粉丝：{user.followersCount} </p>
          <p className="text-sm  text-gray-600">
            {user.introduction || "这个用户很神秘，还没有介绍。"}
          </p>
        </div>
      </Link>
    </div>
  );
};

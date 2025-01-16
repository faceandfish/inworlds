import React from "react";
import Image from "next/image";
import { PublicUserInfo } from "@/app/lib/definitions";
import Link from "next/link";
import { useTranslation } from "../useTranslation";

interface UserPreviewCardProps {
  user: PublicUserInfo;
}

export const UserPreviewCard: React.FC<UserPreviewCardProps> = ({ user }) => {
  const { t } = useTranslation("message");
  return (
    <div className=" hover:bg-neutral-100 w-full">
      <Link
        href={`/user/${user.id}`}
        className="flex items-center pb-5 border-b "
      >
        <Image
          src={user.avatarUrl || "/defaultImg.png"}
          alt={user.displayName || "username"}
          width={200}
          height={200}
          className="rounded-full w-16 h-16 object-cover object-center"
        />
        <div className="ml-8">
          <h3 className="font-semibold">{user.displayName || user.username}</h3>
          <p className="text-sm  text-gray-600">
            {t("userPreviewCard.followers")}
            {user.followersCount}{" "}
          </p>
          <p className="text-sm  text-gray-600">
            {user.introduction || t("userPreviewCard.mysteriousUser")}
          </p>
        </div>
      </Link>
    </div>
  );
};

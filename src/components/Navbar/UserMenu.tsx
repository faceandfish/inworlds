"use client";
import { PiNotePencilLight } from "react-icons/pi";
import { GoBell } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import ProfilesMenu from "../ProfilesMenu";
import { useState } from "react";
import { User } from "@/app/lib/definitions";
import UserAvatar from "../UserAvatar";

const UserMenu = (user: User) => {
  const [profileMenu, setProfileMenu] = useState(false);

  const handleClick = () => {
    setProfileMenu(!profileMenu);
  };
  return (
    <div className="flex  justify-center items-center gap-10 relative">
      <Link href="/write" className=" group/write">
        <PiNotePencilLight className="text-4xl " />
        <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/write:visible group-hover/write:opacity-100 transition-opacity duration-300">
          立即開始創作
        </div>
      </Link>
      <Link href="/mail" className="group/message">
        <GoBell className="text-3xl" />
        <div className="absolute left-16 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/message:visible group-hover/message:opacity-100 transition-opacity duration-300">
          新消息{user.name}
        </div>
      </Link>
      {/* 个人头像 */}
      <div className="group/profiles ">
        <UserAvatar
          user={user}
          onClick={handleClick}
          className="w-10 h-10 bg-slate-600 rounded-full cursor-pointer"
        />
        {profileMenu && <ProfilesMenu />}
        {/* <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/profiles:visible group-hover/profiles:opacity-100 transition-opacity duration-300">
            個人主頁
          </div> */}
      </div>
    </div>
  );
};

export default UserMenu;

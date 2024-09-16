"use client";
import { PiNotePencilLight } from "react-icons/pi";
import { GoBell } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import ProfilesMenu from "../UserMenu";
import { useEffect, useRef, useState } from "react";
import { UserInfo } from "@/app/lib/definitions";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import LogoutButton from "../UserMenu/Logout";

const UserMenu = ({ user }: { user: UserInfo }) => {
  const [profileMenu, setProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    setProfileMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex  justify-center items-center gap-10 relative">
      <Link href="/writing" className=" group/write">
        <PiNotePencilLight className="text-4xl " />
        <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/write:visible group-hover/write:opacity-100 transition-opacity duration-300">
          立即開始創作
        </div>
      </Link>
      <Link href="/messages" className="group/message">
        <GoBell className="text-3xl" />
        <div className="absolute left-16 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/message:visible group-hover/message:opacity-100 transition-opacity duration-300">
          新消息
        </div>
      </Link>

      {/* 个人头像 */}
      <div className="group/profiles " ref={menuRef}>
        <Image
          src={getAvatarUrl(user.avatarUrl || "")}
          alt={user.displayName!}
          width={200}
          height={200}
          onClick={handleAvatarClick}
          className="rounded-full w-10 h-10 cursor-pointer hover:brightness-90 transition-all duration-200"
        />

        {profileMenu && <ProfilesMenu />}
      </div>
    </div>
  );
};

export default UserMenu;

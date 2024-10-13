"use client";
import React, { useEffect, useRef, useState } from "react";
import { PiNotePencilLight } from "react-icons/pi";
import { GoBell } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { UserInfo } from "@/app/lib/definitions";
import { getAvatarUrl } from "@/app/lib/imageUrl";
import { useTranslation } from "../useTranslation";
import UserOptionsMenu from "./UserOptionsMenu";

const UserMenu = ({ user }: { user: UserInfo }) => {
  const [optionMenu, setOptionMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("navbar");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOptionMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setOptionMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile) return;
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  return (
    <>
      <div className="flex md:justify-center justify-around items-center w-full md:w-auto md:gap-10 relative">
        <Link href="/writing" className="group/write">
          <PiNotePencilLight className="text-4xl" />
          <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/write:visible group-hover/write:opacity-100 transition-opacity duration-300 md:block hidden">
            {t("startWriting")}
          </div>
        </Link>
        <Link href="/messages" className="group/message">
          <GoBell className="text-3xl" />
          <div className="absolute left-16 top-full mt-2 px-2 py-1 bg-gray-500 text-white text-sm rounded opacity-0 invisible group-hover/message:visible group-hover/message:opacity-100 transition-opacity duration-300 md:block hidden">
            {t("newMessages")}
          </div>
        </Link>

        <div className="group/profiles flex-shrink-0" ref={menuRef}>
          <Image
            src={getAvatarUrl(user.avatarUrl || "")}
            alt={user.displayName!}
            width={200}
            height={200}
            onClick={handleAvatarClick}
            className="rounded-full w-10 h-10 cursor-pointer hover:brightness-90 transition-all duration-200"
          />

          {optionMenu && <UserOptionsMenu closeMenu={closeMenu} />}
        </div>
      </div>
      {isMobile && optionMenu && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4">
            <button onClick={closeMenu} className="mb-4">
              <IoMdClose className="text-2xl" />
            </button>
            <UserOptionsMenu closeMenu={closeMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;

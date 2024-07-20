import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AiOutlineLogout } from "react-icons/ai";
import { IoLanguageOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineHelpOutline } from "react-icons/md";
import { MdOutlineErrorOutline } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import { User } from "@/app/lib/definitions";
import { userInfo } from "../UserContext";
import LogoutButton from "./Logout";

const ProfilesMenu = () => {
  const { user } = userInfo();
  console.log("🚀 ~ ProfilesMenu ~ user:", user);

  return (
    <div className="absolute top-12 right-10">
      <ul className=" bg-white shadow w-72  py-2 rounded-md ">
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          {user && (
            <Link href={`/profile/${user.id}`} className="flex items-center">
              <HiOutlineHome className="text-2xl mr-5" />
              <div className=" text-base mr-32">我的主頁</div>
              <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
            </Link>
          )}
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <CgProfile className="text-2xl mr-5" />
            <div className=" text-base mr-32">個人資料</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <MdOutlineHealthAndSafety className="text-2xl mr-5" />
            <div className=" text-base mr-32">安全設置</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <RiMoneyDollarCircleLine className="text-2xl mr-5" />
            <div className=" text-base mr-32">購買內容</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2  hover:bg-gray-100 ">
          <Link href="./studio" className="flex items-center">
            <MdOutlineAnalytics className="text-2xl mr-5 " />
            <div className=" text-base mr-28">作家工作室</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <IoLanguageOutline className="text-2xl mr-5" />
            <div className=" text-base mr-28">語言：中文</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <SlLocationPin className="text-2xl mr-5" />
            <div className=" text-base mr-28">地區：台灣</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <MdOutlineHelpOutline className="text-2xl mr-5" />
            <div className=" text-base mr-32">需要幫助</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item  border-b border-gray-100 px-4 py-2 hover:bg-gray-100 ">
          <Link href="#" className="flex items-center">
            <MdOutlineErrorOutline className="text-2xl mr-5" />
            <div className=" text-base mr-32">發送反饋</div>
            <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000  ease-in-out" />
          </Link>
        </li>
        <li className="group/item   px-4 py-2 hover:bg-gray-100 ">
          <LogoutButton />
        </li>
      </ul>
    </div>
  );
};

export default ProfilesMenu;

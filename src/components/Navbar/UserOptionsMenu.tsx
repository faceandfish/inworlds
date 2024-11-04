"use client";
import React, { useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineHelpOutline, MdOutlineAnalytics } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLanguageOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import LogoutButton from "./Logout";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import { useRouter } from "next/navigation";
import { BecomeCreatorModal } from "../Main/NewUserView";

interface MenuOptionProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  onClick?: () => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  href,
  icon,
  text,
  onClick
}) => (
  <li className="group/item border-b border-gray-100 px-4 py-2 hover:bg-gray-100">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: "text-2xl mr-5" })}
      <div className="text-base flex-grow">{text}</div>
      <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out" />
    </div>
  </li>
);

interface UserOptionsMenuProps {
  closeMenu: () => void;
}

const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({ closeMenu }) => {
  const { user } = useUser();
  const { t, lang } = useTranslation("navbar");
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const router = useRouter();

  if (!user) return null;

  console.log("Current user type:", user.userType); // 添加调试日志

  const handleStudioClick = () => {
    console.log("Studio clicked"); // 添加调试日志
    if (user.userType === "regular") {
      console.log("Setting modal to true"); // 添加调试日志
      setShowCreatorModal(true);
    } else {
      router.push(`/${lang}/studio/${user.id}`);
      closeMenu();
    }
  };

  const menuOptions: MenuOptionProps[] = [
    {
      href: `/${lang}/user/${user.id}`,
      icon: <HiOutlineHome />,
      text: t("myHomepage"),
      onClick: () => router.push(`/${lang}/user/${user.id}`)
    },
    {
      href: `/${lang}/user/${user.id}/setting`,
      icon: <CgProfile />,
      text: t("accountModification"),
      onClick: () => router.push(`/${lang}/user/${user.id}/setting`)
    },
    {
      href: `/${lang}/user/${user.id}/wallet`,
      icon: <RiMoneyDollarCircleLine />,
      text: t("purchasedContent"),
      onClick: () => router.push(`/${lang}/user/${user.id}/wallet`)
    },
    {
      href: `/${lang}/studio/${user.id}`,
      icon: <MdOutlineAnalytics />,
      text: t("authorStudio"),
      onClick: handleStudioClick
    },
    {
      href: `/${lang}/user/${user.id}/setting`,
      icon: <IoLanguageOutline />,
      text: t("language"),
      onClick: () => router.push(`/${lang}/user/${user.id}/setting`)
    },
    {
      href: `/${lang}/contact`,
      icon: <MdOutlineHelpOutline />,
      text: t("needHelp"),
      onClick: () => router.push(`/${lang}/contact`)
    }
  ];

  return (
    <>
      <div className="md:absolute md:top-12 md:right-10 md:z-10">
        <ul className="bg-white md:shadow w-full md:w-80 py-2 md:rounded-md text-neutral-600 h-full md:h-auto">
          {menuOptions.map((option, index) => (
            <MenuOption key={index} {...option} />
          ))}
          <LogoutButton onClick={closeMenu} />
        </ul>
      </div>
      {/* 将 Modal 移到最外层 */}
      <BecomeCreatorModal
        isOpen={showCreatorModal}
        onClose={() => {
          console.log("Closing modal"); // 添加调试日志
          setShowCreatorModal(false);
        }}
        onSuccess={() => {
          console.log("Modal success"); // 添加调试日志
          router.push(`/${lang}/studio/${user.id}`);
        }}
      />
    </>
  );
};

export default UserOptionsMenu;

import React from "react";
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

interface MenuOptionProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  onClick: () => void;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  href,
  icon,
  text,
  onClick
}) => (
  <li className="group/item border-b border-gray-100 px-4 py-2 hover:bg-gray-100">
    <Link
      href={href}
      className="flex items-center justify-between"
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: "text-2xl mr-5" })}
      <div className="text-base flex-grow">{text}</div>
      <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out" />
    </Link>
  </li>
);

interface UserOptionsMenuProps {
  closeMenu: () => void;
}

const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({ closeMenu }) => {
  const { user } = useUser();
  const { t, lang } = useTranslation("navbar");

  if (!user) return null;

  const menuOptions: Omit<MenuOptionProps, "onClick">[] = [
    {
      href: `/${lang}/user/${user.id}`,
      icon: <HiOutlineHome />,
      text: t("myHomepage")
    },
    {
      href: `/${lang}/user/${user.id}/setting`,
      icon: <CgProfile />,
      text: t("accountModification")
    },
    {
      href: `/${lang}/user/${user.id}/wallet`,
      icon: <RiMoneyDollarCircleLine />,
      text: t("purchasedContent")
    },
    {
      href: `/${lang}/studio/${user.id}`,
      icon: <MdOutlineAnalytics />,
      text: t("authorStudio")
    },
    {
      href: `/${lang}/user/${user.id}/setting`,
      icon: <IoLanguageOutline />,
      text: t("language")
    },
    {
      href: `/${lang}/contact`,
      icon: <MdOutlineHelpOutline />,
      text: t("needHelp")
    }
  ];

  return (
    <div className="md:absolute md:top-12 md:right-10 md:z-10">
      <ul className="bg-white md:shadow w-full md:w-80 py-2 md:rounded-md text-neutral-600 h-full md:h-auto">
        {menuOptions.map((option, index) => (
          <MenuOption key={index} {...option} onClick={closeMenu} />
        ))}
        <LogoutButton onClick={closeMenu} />
      </ul>
    </div>
  );
};

export default UserOptionsMenu;

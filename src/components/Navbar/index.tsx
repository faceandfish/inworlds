"use client";
import React from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { useUserInfo } from "../UserInfo";

const Navbar: React.FC = () => {
  const { user } = useUserInfo();
  console.log("🚀 ~ navbar:", user);

  return (
    <>
      <div className="flex items-center justify-between  px-16  w-full h-16 bg-gray-100 z-10">
        <Logo />
        <SearchBar />
        {user ? <UserMenu user={user} /> : <AuthButtons />}
      </div>
    </>
  );
};

export default Navbar;

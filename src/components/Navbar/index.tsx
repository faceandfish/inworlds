"use client";
import React from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { useUserInfo } from "../useUserInfo";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { user } = useUserInfo();
  console.log("🚀 ~ navbar:", user);

  return (
    <div
      className={`flex items-center justify-between top-0 left-0 right-0 z-10 px-16 w-full h-16 bg-gray-100 ${className}`}
    >
      <Logo />
      <SearchBar />
      {user ? <UserMenu user={user} /> : <AuthButtons />}
    </div>
  );
};

export default Navbar;

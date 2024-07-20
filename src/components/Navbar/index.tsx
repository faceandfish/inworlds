"use client";
import React from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { userInfo } from "../UserContext";

const Navbar: React.FC = () => {
  const { user, loading } = userInfo();
  return (
    <>
      <div className="flex items-center justify-between  px-16  w-full h-16 bg-gray-100">
        <Logo />
        <SearchBar />
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <AuthButtons />
        )}
      </div>
    </>
  );
};

export default Navbar;

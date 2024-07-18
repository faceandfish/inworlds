"use client";
import Link from "next/link";
import React, { useState } from "react";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { useUser } from "../UserContext";

const Navbar: React.FC = async () => {
  const { user, loading } = useUser();
  return (
    <>
      <div className="flex items-center justify-between  px-16  w-full h-16 bg-gray-100">
        <Logo />
        <SearchBar />
        {user ? <UserMenu user={user} /> : <AuthButtons />}
      </div>
    </>
  );
};

export default Navbar;

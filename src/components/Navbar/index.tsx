import Link from "next/link";
import React, { useState } from "react";
import { auth } from "@/auth";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";

const Navbar: React.FC = async () => {
  const session = await auth();
  return (
    <>
      <div className="flex items-center justify-between  px-16  w-full h-16 bg-gray-100">
        <Logo />
        <SearchBar />
        {session ? <UserMenu session={session?.user} /> : <AuthButtons />}
      </div>
    </>
  );
};

export default Navbar;

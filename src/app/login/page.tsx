"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../lib/loginAuth";
import { LoginForm } from "@/components/LoginForm";

const Login = () => {
  const { handleLogin, isLoading, error } = useAuth();

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src="/login.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="absolute top-1/2 right-32 transform -translate-y-1/2 rounded-2xl z-10 bg-white px-10 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <div className="mt-4">
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-200 focus:outline-none focus:shadow-outline">
            <Image
              src="/google.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
        </div>
        <div className="mt-3 text-center">
          Don't have an account?
          <Link
            href="/register"
            className="text-orange-400 hover:text-orange-500"
          >
            {" "}
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

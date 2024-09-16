"use client";
import React, { useState } from "react";
import Link from "next/link";
import { login } from "@/app/lib/action";
import { GoogleLoginButton } from "@/components/Navbar/GoogleLoginButton";
import { useRouter } from "next/navigation";
import { setToken } from "../lib/token";

import { useUser } from "@/components/UserContextProvider";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refetch } = useUser();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login(username, password);

      if (response.code === 200 && response.data) {
        console.log("登陆成功：", response.data);

        setToken(response.data);
        console.log("token 保存成功了");
        await refetch();
        router.push("/");
      } else {
        setError(response.msg || "登录失败");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("登录过程中发生意外错误");
      }
    }
  };

  return (
    <div className="relative h-screen">
      {/* 背景图片和其他 UI 元素保持不变 */}
      <div className="absolute top-1/2 right-32 transform -translate-y-1/2 rounded-2xl z-10 bg-white shadow-lg px-10 py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign in
          </button>
        </form>
        <div className="mt-4">
          <GoogleLoginButton />
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

"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginCredentials } from "../lib/definitions";
import { getUserInfo, login } from "../lib/action";
import { userInfo } from "@/components/UserContext";

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    loginAct: "",
    loginPwd: "",
  });

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setUser } = userInfo();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    console.log("Submitting credentials:", credentials);

    try {
      console.log("Calling login function...");
      const loginResponse = await login(credentials);
      console.log("Login response received:", loginResponse);
      if (loginResponse.code === 200) {
        console.log("Login successful, saving token...");
        // 登录成功，保存 token
        localStorage.setItem("token", loginResponse.data);
        console.log("Fetching user info...");

        // 获取用户信息
        const userResponse = await getUserInfo();
        console.log("User info received:", userResponse);
        if (userResponse.code === 200) {
          console.log("User info fetched successfully, setting user...");
          // 保存用户信息（这里假设我们有一个全局状态管理，比如 Context 或 Redux）
          setUser(userResponse.data);
          console.log("Redirecting to home page...");
          console.log("User info response:", userResponse);
          // 重定向到仪表板或首页
          router.push("/");
        } else {
          console.error("Failed to fetch user info:", userResponse);
          setError("Failed to fetch user info");
        }
      } else {
        console.error("Login failed:", loginResponse);
        setError(loginResponse.msg || "Login failed");
      }
    } catch (err) {
      console.error("Error during login process:", err);
      setError("An error occurred during login");
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(`An error occurred during login: ${err.message}`);
      } else {
        setError("An unexpected error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image src="/login.png" alt="Background" layout="fill" quality={100} />
      </div>
      <div className="absolute top-1/2 right-32 transform -translate-y-1/2 rounded-2xl  z-10 bg-white px-10 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="loginAct"
            >
              Username or Email
            </label>
            <input
              className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={credentials.loginAct}
              type="text"
              placeholder="Enter your Username or Email"
              name="loginAct"
              autoComplete="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="loginPwd"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={credentials.loginPwd}
              onChange={handleChange}
              placeholder="Enter your password"
              name="loginPwd"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="hover:bg-orange-500 bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button className="hover:bg-gray-200 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center">
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
          Don&apos;t have an account?
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

"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(
        "https://8.142.44.107:8088/inworlds/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server error response:", errorResponse);
        throw new Error(
          "Login failed: " + (errorResponse.message || response.statusText)
        );
      }
      const result = await response.json();
      console.log("Login successful:", result);
      localStorage.setItem("token", result.token);
      router.push("/");
    } catch (error) {
      // 处理错误...
      console.error("Login error");
      setLoginError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    }
  };
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
      <div className="absolute top-1/2 right-32 transform -translate-y-1/2 rounded-2xl  z-10 bg-white px-10 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="loginAct"
            >
              Username or Email
            </label>
            <input
              className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register("loginAct", {
                required: "Username or Email is required",
              })}
              type="text"
              placeholder="Enter your Username or Email"
              name="loginAct"
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
              {...register("loginPwd", { required: "Password is required" })}
              type="password"
              placeholder="Enter your password"
              name="loginPwd"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="hover:bg-orange-500 bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Login
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

import React from "react";

import Image from "next/image";
import Link from "next/link";

const Register = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src="/register.png"
          alt="Background"
          layout="fill"
          quality={100}
        />
      </div>
      <div className="absolute top-1/2 right-32 transform -translate-y-1/2 rounded-2xl  z-10 bg-white px-10 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className=" hover:bg-orange-500 bg-orange-400  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
            >
              Register
            </button>
          </div>
          <div className="mt-3 text-center">
            already have an account
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-500"
            >
              {" "}
              login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

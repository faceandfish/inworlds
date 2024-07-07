import { signIn } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  async function handleLogin(formData: FormData) {
    "use server";

    const validatedFields = loginSchema.safeParse({
      emailOrUsername: formData.get("emailOrUsername"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      throw new Error("Invalid input");
    }

    const { emailOrUsername, password } = validatedFields.data;

    const result = await signIn("credentials", {
      emailOrUsername,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Handle error (e.g., show error message)
      throw new Error("Invalid credentials");
    }

    redirect("/");
  }

  const handleGoogleSignIn = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // 防止表单提交（如果按钮在表单内）
    signIn("google", { redirectTo: "/" });
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
        <form action={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username or Email
            </label>
            <input
              className="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="emailOrUsername"
              type="text"
              placeholder="Enter your Username or Email"
              name="emailOrUsername"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
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
          <button
            className="hover:bg-gray-200 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            type="button"
            onClick={handleGoogleSignIn}
          >
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

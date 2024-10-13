"use client";
import React, { useEffect, useState } from "react";
import { login } from "@/app/lib/action";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContextProvider";
import { setToken } from "@/app/lib/token";
import { GoogleLoginButton } from "@/components/Navbar/GoogleLoginButton";
import { useTranslation } from "@/components/useTranslation";
import Link from "next/link";
import LoginFormSkeleton from "./Skeleton/LoginFormSkeleton";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refetch } = useUser();
  const { t } = useTranslation("navbar");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查一个关键翻译项是否已加载
    if (t("loginTitle") !== "") {
      setIsLoading(false);
    }
  }, [t]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login(username, password);

      if (response.code === 200 && response.data) {
        setToken(response.data);
        await refetch();
        router.push("/");
      } else {
        console.log("cuocuocuo", response.msg);

        setError(response.msg || t("loginError"));
      }
    } catch (error) {
      setError(t("unexpectedError"));
    }
  };
  if (isLoading) {
    return (
      <div className="text-center">
        <LoginFormSkeleton />;
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">{t("loginTitle")}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {t("usernameOrEmail")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="shadow appearance-none border rounded  w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {t("password")}
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
          {t("signIn")}
        </button>
      </form>
      <div className="mt-4">
        <GoogleLoginButton />
      </div>
      <div className="mt-3 text-center">
        {t("dontHaveAccount")}{" "}
        <Link
          href="/register"
          className="text-orange-400 hover:text-orange-500"
        >
          {t("registerLink")}
        </Link>
      </div>
    </>
  );
}

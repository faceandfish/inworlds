"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterCredentials } from "../../lib/definitions";
import { register } from "../../lib/action";
import { useTranslation } from "@/components/useTranslation";
import Alert from "@/components/Main/Alert";

const Register = () => {
  const router = useRouter();
  const { t } = useTranslation("navbar");
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: "",
    email: "",
    password: "",
    rePassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // 验证用户名格式
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9@_-]+$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 6 &&
      (/^[a-zA-Z]{6,}$/.test(password) || // 纯英文字母
        /^\d{6,}$/.test(password) || // 纯数字
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password) || // 英文字母+数字
        /^(?=.*[A-Za-z])(?=.*[@])[A-Za-z@]{6,}$/.test(password) || // 英文字母+@
        /^(?=.*\d)(?=.*[@])[\d@]{6,}$/.test(password) || // 数字+@
        /^[A-Za-z\d@]{6,}$/.test(password)) // 英文字母+数字+@
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.rePassword) {
      setError(t("passwords_do_not_match"));
      setIsLoading(false);
      return;
    }

    // 验证用户名格式
    if (!validateUsername(formData.username)) {
      setError(t("username_format_error"));
      setIsLoading(false);
      return;
    }

    // 验证密码格式
    if (!validatePassword(formData.password)) {
      setError(t("password_format_error"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      if (response.code === 200) {
        setShowAlert(true);
      } else if (response.code === 701) {
        setError(t("username_already_registered"));
      } else if (response.code === 702) {
        setError(t("email_already_registered"));
      } else {
        setError(t("registration_failed"));
      }
    } catch (error) {
      setError(t("registration_error"));
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-5 md:py-10 px-4 md:px-0 bg-orange-100  ">
      <div className="mx-auto  w-full  py-10 md:w-2/4 rounded-none md:rounded-2xl  bg-white px-4  md:px-10 min-h-screen ">
        <h2 className="text-2xl text-neutral-700 font-bold mb-6 text-center">
          {t("register")}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-neutral-600 text-sm font-bold mb-2"
              htmlFor="username"
            >
              {t("username")}
            </label>
            <input
              className="shadow appearance-none border rounded  w-full py-2 px-3 text-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder={t("enter_username")}
              value={formData.username}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-neutral-400 mt-1">
              {t("username_requirements")}
            </p>
          </div>
          <div className="mb-4">
            <label
              className="block text-neutral-600 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("email")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder={t("enter_email")}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-neutral-600 text-sm font-bold mb-2"
              htmlFor="loginPwd"
            >
              {t("password")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutral-600 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder={t("enter_password")}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-neutral-400 mt-1">
              {t("password_requirements")}
            </p>
          </div>
          <div className="mb-4">
            <label
              className="block text-neutral-600 text-sm font-bold mb-2"
              htmlFor="rePassword"
            >
              {t("confirm_password")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-neutralneutral-600 leading-tight focus:outline-none focus:shadow-outline"
              id="rePassword"
              type="password"
              placeholder={t("confirm_password")}
              value={formData.rePassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="hover:bg-orange-500 bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t("registering") : t("register")}
            </button>
          </div>
          <div className="mt-3 text-center">
            {t("already_have_account")}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-500"
            >
              {" "}
              {t("login")}
            </Link>
          </div>
        </form>
      </div>
      {showAlert && (
        <Alert
          message={t("registration_success_message")}
          type="success"
          onClose={() => {
            setShowAlert(false);
          }}
          autoClose={false}
        />
      )}
    </div>
  );
};

export default Register;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterCredentials } from "../../lib/definitions";
import { register } from "../../lib/action";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: "",
    email: "",
    password: "",
    rePassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");

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
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(formData);

      if (response.code === 200) {
        setLink(response.data);
        // Registration successful
        router.push("/login");
      } else {
        // Registration failed
        setError(response.msg || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen bg-black">
      <div className="absolute left-5 hidden md:block">
        <Image
          src="/register-bg.png"
          alt="Background"
          width={900}
          height={1325}
          quality={100}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 md:top-1/2 md:right-32 md:left-auto md:transform md:-translate-y-1/2 rounded-none md:rounded-2xl z-10 bg-white px-4 py-8 md:px-10 min-h-screen md:min-h-0">
        {link ? (
          <div className="text-center">
            <h2 className="md:text-2xl text-xl font-bold mb-6">验证您的邮箱</h2>
            <p className="mb-4">请点击以下链接验证您的邮箱：</p>
            <a
              href={link}
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              验证邮箱
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded md:w-96 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="loginPwd"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="rePassword"
                >
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rePassword"
                  type="password"
                  placeholder="Confirm your password"
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
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
              <div className="mt-3 text-center">
                Already have an account?
                <Link
                  href="/login"
                  className="text-orange-400 hover:text-orange-500"
                >
                  {" "}
                  Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;

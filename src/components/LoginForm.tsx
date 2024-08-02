import { LoginCredentials } from "@/app/lib/definitions";
import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    loginAct: "",
    loginPwd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="loginAct"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username or Email
        </label>
        <input
          id="loginAct"
          name="loginAct"
          type="text"
          value={credentials.loginAct}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded  w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="loginPwd"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          id="loginPwd"
          name="loginPwd"
          type="password"
          value={credentials.loginPwd}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

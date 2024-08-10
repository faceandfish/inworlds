import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserInfo } from "../lib/action";
import { LoginRequest, ApiResponse, UserInfo } from "../lib/definitions";
import { setToken } from "./token";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await login(credentials);
      if (loginResponse.code === 200 && loginResponse.data) {
        setToken(loginResponse.data);
        console.log("loginResponse.data:", loginResponse.data);

        const userResponse = await getUserInfo(loginResponse.data);
        console.log("🚀 ~ handleLogin ~ userResponse:", userResponse);

        if (userResponse.code === 200) {
          router.push("/");
        } else {
          throw new Error("Failed to fetch user info");
        }
      } else {
        throw new Error(loginResponse.msg || "Login failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("发生了未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}

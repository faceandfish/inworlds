import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserInfo } from "../lib/action";
import { LoginCredentials, User, UserResponse } from "../lib/definitions";
import { setToken } from "./token";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await login(credentials);
      if (loginResponse.code === 200) {
        setToken(loginResponse.data);

        const userResponse = await fetch("/api/userinfo");
        const json = (await userResponse.json()) as UserResponse;
        console.log("🚀 ~ handleLogin ~ json:", json);

        if (json.code === 200) {
          router.push("/");
        } else {
          throw new Error("Failed to fetch user info");
        }
      } else {
        throw new Error(loginResponse.msg || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}

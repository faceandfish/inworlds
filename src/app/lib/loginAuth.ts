import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getUserInfo } from "../lib/action";
import { LoginCredentials, User } from "../lib/definitions";

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
        localStorage.setItem("token", loginResponse.data);
        const userResponse = await getUserInfo();
        if (userResponse.code === 200) {
          // Assuming you have a way to set the user globally
          // setUser(userResponse.data);
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

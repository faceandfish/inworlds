"use client";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContextProvider";
import { handleGoogleLogin } from "@/app/lib/action";
import { setToken } from "@/app/lib/token";
import Image from "next/image";

export const GoogleLoginButtonInner = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      handleAuthentication(session.user);
    }
  }, [status, session]);

  const handleAuthentication = async (user: any) => {
    try {
      console.log("Calling handleGoogleLogin");
      const response = await handleGoogleLogin(
        user.email as string,
        user.name as string,
        user.image as string
      );
      console.log("handleGoogleLogin response:", response);

      if (response.code === 200 && response.data) {
        console.log("Login successful, saving token");
        setToken(response.data);
        console.log("Token saved successfully");
        router.push("/"); // 重定向到主页
      } else {
        console.error("Server authentication failed:", response);
        setError("Failed to authenticate with our server. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleGoogleLogin:", error);
      setError(
        "An error occurred while processing your login. Please try again."
      );
    }
  };

  const handleGoogleLoginClick = () => {
    signIn("google");
  };

  return (
    <div>
      <button
        onClick={handleGoogleLoginClick}
        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-neutral-100 flex items-center justify-center"
      >
        <Image
          src="/google.svg"
          alt="Google"
          height={6}
          width={6}
          className="w-6 h-6 mr-2"
        />
        Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export const GoogleLoginButton = () => {
  return (
    <SessionProvider>
      <GoogleLoginButtonInner />
    </SessionProvider>
  );
};

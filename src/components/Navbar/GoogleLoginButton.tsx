"use client";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "@/app/lib/action";
import { setToken } from "@/app/lib/token";
import Image from "next/image";
import { useTranslation } from "../useTranslation";
import GoogleLogo from "../../../public/google.png";
import { useUser } from "../UserContextProvider";

export const GoogleLoginButtonInner = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("navbar");
  const { refetch } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleSession = async () => {
      if (status === "authenticated" && session?.user && !isProcessing) {
        setIsProcessing(true); // 防止重复处理
        try {
          await handleAuthentication(session.user);
        } catch (error) {
          console.error("Authentication error:", error);
          setError(t("unexpectedError"));
        }
        setIsProcessing(false);
      }
    };

    handleSession();
  }, [status, session]);

  const handleAuthentication = async (user: any) => {
    try {
      const response = await handleGoogleLogin(
        user.email as string,
        user.name as string,
        user.image as string
      );

      console.log("Server response:", response);

      if (response.code === 200 && response.data) {
        setToken(response.data);
        await refetch();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.refresh();
        await router.replace("/");
      } else {
        setError("Failed to authenticate with our server. Please try again.");
      }
    } catch (error) {
      setError(
        "An error occurred while processing your login. Please try again."
      );
    }
  };

  const handleGoogleLoginClick = () => {
    signIn("google", { redirect: false });
  };

  return (
    <div>
      <button
        onClick={handleGoogleLoginClick}
        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-neutral-100 flex items-center justify-center"
      >
        <Image
          src={GoogleLogo}
          alt="Google"
          height={128}
          width={128}
          className="w-7 h-7 mr-2"
        />
        {t("signInWithGoogle")}
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

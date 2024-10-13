"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AiOutlineLogout } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import Alert from "../Alert";

interface LogoutButtonProps {
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const { logoutUser } = useUser();
  const { t } = useTranslation("navbar");

  const handleLogout = useCallback(async () => {
    console.log("handleLogout called");
    setIsLoading(true);
    setShowAlert(true);
    setAlertType("success");
    setAlertMessage(t("loggingOut"));

    try {
      await signOut({ redirect: false });
      await logoutUser();
      setAlertMessage(t("logoutSuccess"));

      if (onClick) {
        onClick();
      }

      setTimeout(() => {
        setShowAlert(false);
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(t("logoutError"), error);
      setAlertType("error");
      setAlertMessage(t("logoutError"));
    } finally {
      setIsLoading(false);
    }
  }, [router, logoutUser, t]);

  const closeAlert = () => {
    setShowAlert(false);
    if (alertType === "success") {
      router.push("/login");
    }
  };

  return (
    <>
      <button
        className="flex items-center group/item hover:bg-gray-100 w-full px-4 py-2 rounded"
        onClick={handleLogout}
        disabled={isLoading}
      >
        <AiOutlineLogout className="text-2xl mr-5" />
        <div className="text-base mr-32">{t("logoutAccount")}</div>
        <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out ml-auto" />
      </button>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={closeAlert}
          autoClose={alertType === "success"}
        />
      )}
    </>
  );
};

export default LogoutButton;

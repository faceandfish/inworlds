"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AiOutlineLogout } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { useUser } from "../UserContextProvider";
import { useTranslation } from "../useTranslation";
import Alert from "../Main/Alert";
import { logger } from "../Main/logger";

interface LogoutButtonProps {
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const router = useRouter();
  const { logoutUser } = useUser();
  const { t, lang } = useTranslation("navbar");

  const handleLogoutClick = () => {
    setShowConfirmAlert(true);
    setAlertMessage(t("logoutConfirmMessage"));
  };

  const handleLogoutConfirm = useCallback(async () => {
    setShowConfirmAlert(false);
    setShowStatusAlert(true);
    setAlertType("success");
    setAlertMessage(t("loggingOut"));

    try {
      await signOut({
        redirect: false // 阻止 NextAuth 自动重定向
      });

      await logoutUser();

      setAlertMessage(t("logoutSuccess"));

      if (onClick) {
        onClick();
      }

      router.replace(`/${lang}/login`);
    } catch (error) {
      logger.error("logoutError", error, { context: "logoutError" });
      setAlertType("error");
      setAlertMessage(t("logoutError"));
    }
  }, [router, logoutUser, t, onClick]);

  const handleConfirmClose = () => {
    setShowConfirmAlert(false);
  };

  const handleStatusClose = () => {
    setShowStatusAlert(false);
    if (alertType === "success") {
      router.push("/login");
    }
  };

  return (
    <>
      <button
        className="flex items-center group/item hover:bg-gray-100 w-full px-4 py-2 rounded"
        onClick={handleLogoutClick}
      >
        <AiOutlineLogout className="text-2xl mr-5" />
        <div className="text-base mr-32">{t("logoutAccount")}</div>
        <FaChevronRight className="invisible group-hover/item:visible transition-opacity duration-1000 ease-in-out ml-auto" />
      </button>

      {/* 确认退出的 Alert */}
      {showConfirmAlert && (
        <Alert
          message={alertMessage}
          type="success"
          onClose={handleConfirmClose}
          autoClose={false}
          customButton={{
            text: t("confirm"),
            onClick: handleLogoutConfirm
          }}
        />
      )}

      {/* 退出状态的 Alert */}
      {showStatusAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={handleStatusClose}
          autoClose={alertType === "success"}
        />
      )}
    </>
  );
};

export default LogoutButton;

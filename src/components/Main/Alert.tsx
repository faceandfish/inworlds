"use client";
import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "../useTranslation";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  customButton?: {
    text: string;
    onClick: () => void;
  };
  autoClose?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type,
  onClose,
  customButton,
  autoClose = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation("alert");

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed px-6 md:px-0 inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative md:w-96 w-full bg-white rounded-lg shadow-xl">
        <div
          className={`p-4 ${
            type === "success" ? "bg-orange-100" : "bg-red-100"
          } rounded-t-lg`}
        >
          <h3
            className={`text-lg font-semibold ${
              type === "success" ? "text-orange-500" : "text-red-700"
            }`}
          >
            {type === "success" ? t("success") : t("error")}
          </h3>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-neutral-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="flex justify-end p-4 rounded-b-lg">
          {customButton && (
            <button
              onClick={customButton.onClick}
              className="mr-2 px-4 py-2 text-white bg-orange-400 hover:bg-orange-500 rounded"
            >
              {customButton.text}
            </button>
          )}
          <button
            onClick={handleClose}
            className={`px-4 py-2 text-white rounded ${
              type === "success"
                ? "bg-orange-400 hover:bg-orange-500"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;

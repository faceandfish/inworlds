import { useTranslation } from "@/components/useTranslation";
import React from "react";
import { FaDesktop } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const MobileStudioNotice: React.FC = () => {
  const { t } = useTranslation("studio");

  return (
    <div className="flex justify-center bg-gradient-to-b from-orange-50 to-white px-6 py-10 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-orange-600">
          {t("mobileStudio.title")}
        </h1>

        <div className="flex justify-center items-center mb-8">
          <div className="text-5xl text-blue-500 mr-4 animate-pulse">
            <MdDashboard />
          </div>
          <div className="text-4xl text-gray-400">➔</div>
          <div className="text-5xl text-orange-400 ml-4">
            <FaDesktop />
          </div>
        </div>

        <p className="text-lg mb-6 text-neutral-600">
          {t("mobileStudio.message")}
        </p>

        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-orange-400">
            {t("mobileStudio.suggestion")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileStudioNotice;

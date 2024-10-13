"use client";

import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { BookInfo } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径
import { useTranslation } from "../useTranslation";

interface AgeRatingProps {
  value: BookInfo["ageRating"];
  onChange: (newValue: BookInfo["ageRating"]) => void;
  error?: string;
}

const AgeRating: React.FC<AgeRatingProps> = ({ value, onChange, error }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as BookInfo["ageRating"]);
  };
  const { t } = useTranslation("book");

  return (
    <div className="w-full mt-10 space-y-6">
      <h2 className="text-2xl font-medium text-gray-700 ">
        {t("ageRating.title")}
      </h2>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {t("ageRating.legalNotice")}
            </p>
            <p className="text-sm text-yellow-700">
              {t("ageRating.chooseCarefully")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="under18"
            checked={value === "under18"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">
              {t("ageRating.under18")}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {t("ageRating.under18Description")}
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="allAges"
            checked={value === "allAges"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">
              {t("ageRating.allAges")}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {t("ageRating.allAgesDescription")}
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="adult"
            checked={value === "adult"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">成人内容</span>
            <p className="text-sm text-gray-500 mt-1">
              {t("ageRating.adultDescription")}
            </p>
          </div>
        </label>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>{t("ageRating.warning")}</p>
      </div>
    </div>
  );
};

export default AgeRating;

"use client";
import { useTranslation } from "@/components/useTranslation";
import React from "react";

export default function Page() {
  const { t } = useTranslation("wallet");
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {t("wallet.withdraw.title")}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t("wallet.withdraw.description")}
        </p>
        <div className="animate-pulse">
          <svg
            className="w-16 h-16 mx-auto text-orange-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          {t("wallet.withdraw.estimatedCompletion")}
        </p>
      </div>
    </div>
  );
}

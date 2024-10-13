"use client";
import React from "react";
import {
  ChartPieIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GiftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslation } from "@/components/useTranslation";

export default function AuthorAreaPage() {
  const { t } = useTranslation("authorArea");

  const reasons = [
    { icon: ChartPieIcon, text: t("whyChooseUs.reason1") },
    { icon: ClockIcon, text: t("whyChooseUs.reason2") },
    { icon: CheckCircleIcon, text: t("whyChooseUs.reason3") },
    { icon: UserGroupIcon, text: t("whyChooseUs.reason4") }
  ];

  const revenueModels = [
    { icon: CurrencyDollarIcon, key: "model1" },
    { icon: ShieldCheckIcon, key: "model2" },
    { icon: GiftIcon, key: "model3" }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-100 to-yellow-50 min-h-screen text-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="md:text-5xl text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          {t("pageTitle")}
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="md:text-3xl text-xl font-bold mb-6 text-orange-600">
            {t("whyChooseUs.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-start">
                <Icon className="h-6 w-6 mr-2 text-yellow-500" />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="md:text-3xl text-xl font-bold mb-6 text-orange-600">
            {t("revenueModel.title")}
          </h2>
          <div className="space-y-4">
            {revenueModels.map(({ icon: Icon, key }, index) => (
              <div key={index} className="flex items-center">
                <Icon className="h-8 w-8 mr-4 text-yellow-500" />
                <div>
                  <h3 className="text-xl font-semibold text-orange-500">
                    {t(`revenueModel.${key}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(`revenueModel.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/writing">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full text-xl cursor-pointer hover:from-orange-600 hover:to-yellow-600 transition duration-300 transform hover:scale-105 shadow-lg">
            {t("callToAction")}
          </div>
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="md:text-3xl text-xl font-bold mb-6 text-center text-orange-600">
          {t("faq.title")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <details key={num} className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer text-orange-500">
                {t(`faq.question${num}.question`)}
              </summary>
              <p className="mt-2 text-gray-600">
                {t(`faq.question${num}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useTranslation } from "@/components/useTranslation";
import React from "react";
import { FaEnvelope, FaQuestionCircle } from "react-icons/fa";

const HelpPage: React.FC = () => {
  const { t } = useTranslation("help");

  const faqs = [
    {
      question: t("faq.author.question"),
      answer: t("faq.author.answer")
    },
    {
      question: t("faq.earnings.question"),
      answer: t("faq.earnings.answer")
    },
    {
      question: t("faq.editWork.question"),
      answer: t("faq.editWork.answer")
    },
    {
      question: t("faq.editProfile.question"),
      answer: t("faq.editProfile.answer")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 mb-6">{t("description")}</p>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
            <div className="flex items-center">
              <FaEnvelope className="text-orange-400 mr-3" />
              <p className="text-orange-500">
                {t("contactInfo")}
                <a
                  href="mailto:sundayoffice.jp@gmail.com"
                  className="font-medium hover:underline"
                >
                  sundayoffice.jp@gmail.com
                </a>
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8">{t("contactDescription")}</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaQuestionCircle className="text-orange-400 mr-2" />
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-gray-600">
            <p>{t("additionalInfo")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

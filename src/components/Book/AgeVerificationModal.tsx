import React, { useState, useEffect } from "react";
import { UserInfo, BookInfo } from "@/app/lib/definitions";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "../useTranslation";
import Link from "next/link";

interface AgeVerificationModalProps {
  user: UserInfo;
  book: BookInfo;
  onConfirm: () => void;
  onCancel: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  user,
  book,
  onConfirm,
  onCancel
}) => {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const { t, lang } = useTranslation("book");

  useEffect(() => {
    if (user.birthDate) {
      const birthDate = new Date(user.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const isAdult = age >= 18;
      setIsAdult(isAdult);
    }
  }, [user.birthDate]);

  const renderContent = () => {
    return (
      <>
        <h2 className="text-xl font-bold mb-4 text-orange-500">
          {t("ageConfirmation")}
        </h2>
        <p className="mb-4">
          《{book.title}》{t("adultContentWarning")}
        </p>
        {isAdult === null && (
          <>
            <h3 className="text-lg font-semibold text-orange-500 mb-2">
              {t("unableToVerifyAge")}
            </h3>
            <p>{t("verifyAgeMessage")}</p>
            <p className="mt-4 text-sm text-neutral-500">
              {t("setBirthdayMessage")}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                {t("close")}
              </button>
              <Link href={`/${lang}/user/${user.id}/setting`}>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
                  {t("goToSettings")}
                </button>
              </Link>
            </div>
          </>
        )}
        {isAdult === false && (
          <>
            <h3 className="text-lg font-semibold text-red-500 mb-2">
              {t("ageRestriction")}
            </h3>
            <p>{t("ageRestrictionMessage")}</p>
            <p className="mt-4 text-sm text-neutral-500">
              {t("updateBirthdayMessage")}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                {t("goBack")}
              </button>
              <Link href={`/${lang}/user/${user.id}/setting`}>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
                  {t("goToSettings")}
                </button>
              </Link>
            </div>
          </>
        )}
        {isAdult === true && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded"
            >
              {t("confirmAndContinue")}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 px-6 md:px-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default AgeVerificationModal;

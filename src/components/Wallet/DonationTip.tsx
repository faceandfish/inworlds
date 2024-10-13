import React from "react";
import { HiGift } from "react-icons/hi2";
import { useTranslation } from "../useTranslation";

export const DonationTip: React.FC = () => {
  const { t } = useTranslation("wallet");
  return (
    <div className="bg-orange-100 p-4 rounded-lg shadow">
      <h3 className="font-bold flex items-center text-orange-800">
        <HiGift className="mr-2 text-orange-400 text-xl" />
        {t("wallet.donationTip.title")}
      </h3>
      <p className="mt-2 text-sm text-orange-400">
        {t("wallet.donationTip.content")}
      </p>
    </div>
  );
};

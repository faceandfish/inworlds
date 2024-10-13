import React from "react";
import { HiCurrencyDollar } from "react-icons/hi2";
import { useTranslation } from "../useTranslation";

interface BalanceDisplayProps {
  balance: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  const { t } = useTranslation("wallet");
  return (
    <div className="bg-orange-100 p-4 rounded-lg mb-4 shadow">
      <p className="flex items-center text-orange-500">
        <HiCurrencyDollar className="mr-2 text-orange-400 text-xl" />
        {t("wallet.balance.current")} {balance} {t("wallet.balance.currency")}
      </p>
    </div>
  );
};

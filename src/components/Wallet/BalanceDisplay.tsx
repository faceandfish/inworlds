import React from "react";
import { HiCurrencyDollar } from "react-icons/hi2";

interface BalanceDisplayProps {
  balance: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => (
  <div className="bg-orange-100 p-4 rounded-lg mb-4 shadow">
    <p className="flex items-center text-orange-500">
      <HiCurrencyDollar className="mr-2 text-orange-400 text-xl" />
      当前余额: {balance} 墨币
    </p>
  </div>
);

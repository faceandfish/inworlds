import React from "react";
import { PurchaseOption } from "@/app/lib/definitions";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "../useTranslation";

interface PurchaseOptionsProps {
  onPurchase: (option: PurchaseOption) => void;
  isConfirmingPayment: boolean;
}
const options: PurchaseOption[] = [
  { id: 1, coins: 1, price: 0.01 },
  { id: 2, coins: 500, price: 5 },
  { id: 3, coins: 1000, price: 10 },
  { id: 4, coins: 2000, price: 20 }
];

export const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  onPurchase,
  isConfirmingPayment
}) => {
  const { t } = useTranslation("wallet");
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {options.map((option) => (
          <div key={option.id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-bold text-lg text-neutral-700">
              {option.coins} {t("wallet.balance.currency")}
            </p>
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-1 text-yellow-400" />
              <p className="text-neutral-400">{option.price} USD</p>
            </div>
            <button
              onClick={() => onPurchase(option)}
              disabled={isConfirmingPayment}
              className="mt-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition duration-300 disabled:bg-orange-200"
            >
              {isConfirmingPayment
                ? t("wallet.purchaseOptions.processing")
                : t("wallet.purchaseOptions.buy")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

import { PurchaseOption } from "@/app/lib/definitions";
import React from "react";

interface PurchaseOptionsProps {
  options: PurchaseOption[];
  onPurchase: (option: PurchaseOption) => void;
}

export const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  options,
  onPurchase
}) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    {options.map((option) => (
      <div key={option.id} className="bg-white p-4 rounded-lg shadow">
        <p className="font-bold text-lg text-neutral-700">
          {option.coins} 墨币
        </p>
        <p className="text-neutral-600">￥{option.price}</p>
        <button
          onClick={() => onPurchase(option)}
          className="mt-2 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition duration-300"
        >
          购买
        </button>
      </div>
    ))}
  </div>
);

"use client";
import React, { useState } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { PurchaseOptions } from "./PurchaseOptions";
import { HistoryTable } from "./HistoryTable";
import { DonationTip } from "./DonationTip";
import {
  PurchaseOption,
  PurchaseHistory,
  DonationHistory
} from "@/app/lib/definitions";
import {
  mockPurchaseOptions,
  mockPurchaseHistory,
  mockDonationHistory,
  mockBalance
} from "./mockData";
import { useUserInfo } from "../useUserInfo";

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState(mockBalance);
  const [purchaseHistory, setPurchaseHistory] =
    useState<PurchaseHistory[]>(mockPurchaseHistory);
  const [donationHistory] = useState<DonationHistory[]>(mockDonationHistory);
  const { user } = useUserInfo();

  const handlePurchase = (option: PurchaseOption) => {
    setBalance(balance + option.coins);
    setPurchaseHistory([
      {
        id: purchaseHistory.length + 1,
        coins: option.coins,
        amountPaid: option.price,
        date: new Date().toISOString().split("T")[0],
        userId: user!.id
      },
      ...purchaseHistory
    ]);
    alert(`成功购买 ${option.coins} 金币!`);
  };

  return (
    <div className="container mx-auto px-20 py-5">
      <h1 className="text-2xl font-bold mb-4 text-neutral-600">购买墨币</h1>
      <div className="flex flex-col gap-10 md:flex-row md:space-x-4">
        <div className="md:w-2/3">
          <BalanceDisplay balance={balance} />
          <PurchaseOptions
            options={mockPurchaseOptions}
            onPurchase={handlePurchase}
          />
        </div>
        <div className="md:w-1/3">
          <HistoryTable
            title="购买历史"
            icon="cart"
            data={purchaseHistory}
            type="purchase"
          />
          <HistoryTable
            title="打赏历史"
            icon="gift"
            data={donationHistory}
            type="donation"
          />
          <DonationTip />
        </div>
      </div>
    </div>
  );
};

export default Wallet;

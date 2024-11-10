"use client";
import { useTranslation } from "@/components/useTranslation";
import { useUser } from "@/components/UserContextProvider";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BalanceCard } from "@/components/Withdraw/BalanceCard";
import { AmountInput } from "@/components/Withdraw/AmountInput";
import { BankCardList } from "@/components/Withdraw/BankCardList";
import { WithdrawNotice } from "@/components/Withdraw/WithdrawNotice";
import { AddBankCardRequest, BankCard } from "@/app/lib/definitions";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import InternationalBankForm from "@/components/Withdraw/InternationalBankForm";

const EXCHANGE_RATE = 0.01;

export default function WithdrawPage() {
  const { t } = useTranslation("wallet");
  const { user } = useUser();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState<BankCard[]>([]);
  const [newCard, setNewCard] = useState<
    AddBankCardRequest & {
      country: string;
      swiftCode: string;
      bankAddress: string;
    }
  >({
    bankName: "",
    cardNumber: "",
    holderName: "",
    isDefault: false,
    country: "JP",
    swiftCode: "",
    bankAddress: ""
  });

  // 金额计算
  const availableUSD = useMemo(() => {
    if (!user?.totalIncome) return 0;
    return Number((user.totalIncome * EXCHANGE_RATE).toFixed(2));
  }, [user?.totalIncome]);

  const inkTokenAmount = useMemo(() => {
    if (!amount) return 0;
    return Number((Number(amount) / EXCHANGE_RATE).toFixed(2));
  }, [amount]);

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 金额验证
    if (!amount || Number(amount) <= 0) {
      setError(t("wallet.withdraw.errors.invalidAmount"));
      return;
    }

    // 验证选择的银行卡或新卡信息
    if (!showNewCardForm && !selectedCard) {
      setError(t("wallet.withdraw.errors.selectCard"));
      return;
    }

    if (showNewCardForm) {
      // 新卡验证
      if (!newCard.bankName || !newCard.cardNumber || !newCard.holderName) {
        setError(t("wallet.withdraw.errors.fillAllFields"));
        return;
      }

      // 国际转账验证
      if (newCard.country !== "JP") {
        if (!newCard.swiftCode) {
          setError(t("wallet.withdraw.errors.swiftCodeRequired"));
          return;
        }
        if (!newCard.bankAddress) {
          setError(t("wallet.withdraw.errors.bankAddressRequired"));
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      if (showNewCardForm) {
        // TODO: 调用添加银行卡 API
        const savedCard: BankCard = {
          id: Date.now().toString(), // 临时ID，实际应由后端生成
          userId: user?.id || 0,
          bankName: newCard.bankName,
          cardNumber: newCard.cardNumber,
          holderName: newCard.holderName,
          isDefault: newCard.isDefault,
          country: newCard.country,
          swiftCode: newCard.swiftCode,
          bankAddress: newCard.bankAddress,
          createAt: new Date().toISOString(),
          lastUsed: new Date().toISOString()
        };

        setSavedCards((prev) => [...prev, savedCard]);
      }

      // TODO: 调用提现 API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 成功后跳转
      router.push("/success");
    } catch (err) {
      setError(t("wallet.withdraw.errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* 标题部分 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("wallet.withdraw.title")}
            </h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <p>{t("wallet.withdraw.description")}</p>
              <span className="mx-2">•</span>
              <p>
                {t("wallet.withdraw.exchangeRate")}: 1 USD = {1 / EXCHANGE_RATE}{" "}
                {t("wallet.withdraw.inkTokens")}
              </p>
            </div>
          </div>

          {/* 主卡片内容 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {/* 余额卡片 */}
            <div className="p-6">
              <BalanceCard
                totalIncome={user?.totalIncome || 0}
                availableUSD={availableUSD}
              />
            </div>

            {/* 提现表单 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* 金额输入 */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">
                  {t("wallet.withdraw.amountSection")}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <AmountInput
                    amount={amount}
                    inkAmount={inkTokenAmount}
                    onChange={setAmount}
                    maxInkAmount={user?.totalIncome || 0}
                  />
                </div>
              </div>

              {/* 支付方式 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium text-gray-900">
                    {t("wallet.withdraw.paymentMethod")}
                  </h3>
                  {savedCards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCardForm(!showNewCardForm);
                        if (!showNewCardForm) setSelectedCard("");
                      }}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      {showNewCardForm
                        ? t("wallet.withdraw.useExistingCard")
                        : t("wallet.withdraw.addNewCard")}
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg">
                  {!showNewCardForm && savedCards.length > 0 ? (
                    <BankCardList
                      cards={savedCards}
                      selectedCard={selectedCard}
                      onSelectCard={setSelectedCard}
                    />
                  ) : (
                    <div className="p-4">
                      <InternationalBankForm
                        card={newCard}
                        onChange={setNewCard}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* 提交按钮 */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !amount || Number(amount) <= 0}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting && (
                    <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  )}
                  <span>
                    {isSubmitting
                      ? t("wallet.withdraw.processing")
                      : t("wallet.withdraw.submit")}
                  </span>
                </button>
              </div>
            </form>

            {/* 提现说明 */}
            <div className="p-6 bg-gray-50 rounded-b-xl">
              <WithdrawNotice />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

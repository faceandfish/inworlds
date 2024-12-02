"use client";
import { useTranslation } from "@/components/useTranslation";
import React, { useState, useMemo, useEffect } from "react";
import { BalanceCard } from "@/components/Withdraw/BalanceCard";
import { AmountInput } from "@/components/Withdraw/AmountInput";
import { BankCardList } from "@/components/Withdraw/BankCardList";
import { WithdrawNotice } from "@/components/Withdraw/WithdrawNotice";
import { AddBankCardRequest, BankCard } from "@/app/lib/definitions";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import InternationalBankForm from "@/components/Withdraw/InternationalBankForm";
import {
  addBankCard,
  getBankCards,
  getUserTotalIncome,
  submitWithdrawRequest
} from "@/app/lib/action";
import Alert from "../Main/Alert";
import { WithdrawHistory } from "./WithdrawHistory";
import WithdrawSkeleton from "./WithdrawSkeleton";
import { logger } from "@/components/Main/logger";

const EXCHANGE_RATE = 0.01;

export default function Withdraw() {
  const { t } = useTranslation("wallet");
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cardError, setCardError] = useState("");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState<BankCard[]>([]);
  const [newCard, setNewCard] = useState<AddBankCardRequest>({
    bankName: "",
    cardNumber: "",
    holderName: "",
    isDefault: false,
    country: "JP",
    swiftCode: "",
    bankAddress: ""
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取银行卡
        const cardsResponse = await getBankCards();
        if (cardsResponse.code === 200 && "data" in cardsResponse) {
          setSavedCards(cardsResponse.data.dataList || []);
          const defaultCard = cardsResponse.data.dataList?.find(
            (card) => card.isDefault
          );
          if (defaultCard) {
            setSelectedCard(defaultCard.id);
          }
        } else {
          logger.error("Invalid bank cards response", {
            response: cardsResponse,
            context: "Withdraw.fetchData"
          });
        }

        // 获取总收入
        const incomeResponse = await getUserTotalIncome();
        if (incomeResponse.code === 200 && "data" in incomeResponse) {
          setTotalIncome(incomeResponse.data);
        } else {
          logger.error("Invalid income response", {
            response: incomeResponse,
            context: "Withdraw.fetchData"
          });
        }

        setIsLoading(false);
      } catch (err) {
        logger.error("Failed to fetch initial data", {
          error: err,
          context: "Withdraw.fetchData"
        });
        setCardError(t("wallet.withdraw.errors.fetchIncomeFailed"));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // 金额计算
  const availableUSD = useMemo(() => {
    if (!totalIncome) return 0;
    return Number((totalIncome * EXCHANGE_RATE).toFixed(2));
  }, [totalIncome]);

  const inkTokenAmount = useMemo(() => {
    if (!amount) return 0;
    return Number((Number(amount) / EXCHANGE_RATE).toFixed(2));
  }, [amount]);

  // 处理保存新卡
  const handleSaveNewCard = async () => {
    // 验证新卡信息
    if (!newCard.bankName || !newCard.cardNumber || !newCard.holderName) {
      setCardError(t("wallet.withdraw.errors.fillAllFields"));
      return;
    }

    // 国际转账验证
    if (newCard.country !== "JP") {
      if (!newCard.swiftCode) {
        setCardError(t("wallet.withdraw.errors.swiftCodeRequired"));
        return;
      }
      if (!newCard.bankAddress) {
        setCardError(t("wallet.withdraw.errors.bankAddressRequired"));
        return;
      }
    }

    setIsSavingCard(true);
    setCardError("");

    try {
      const cardResponse = await addBankCard(newCard);
      if (cardResponse.code === 200 && "data" in cardResponse) {
        const savedCard = cardResponse.data;
        setSavedCards((prev) => [...prev, savedCard]);
        setSelectedCard(savedCard.id);
        setShowNewCardForm(false);
        setNewCard({
          bankName: "",
          cardNumber: "",
          holderName: "",
          isDefault: false,
          country: "JP",
          swiftCode: "",
          bankAddress: ""
        });
      } else {
        logger.error("Failed to save bank card", {
          response: cardResponse,
          context: "Withdraw.handleSaveNewCard"
        });
        throw new Error(cardResponse.msg || "Failed to save bank card");
      }
    } catch (err) {
      logger.error("Save card error", {
        error: err,
        context: "Withdraw.handleSaveNewCard",
        cardData: { ...newCard, cardNumber: "***" } // 隐藏敏感信息
      });
      setCardError(
        err instanceof Error
          ? err.message
          : t("wallet.withdraw.errors.saveCardFailed")
      );
    } finally {
      setIsSavingCard(false);
    }
  };

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!amount || Number(amount) <= 0) {
      setSubmitError(t("wallet.withdraw.errors.invalidAmount"));
      return;
    }

    if (!selectedCard) {
      setSubmitError(t("wallet.withdraw.errors.selectCard"));
      return;
    }

    setIsSubmitting(true);

    try {
      const withdrawRequest = {
        amount: Number(amount),
        inkAmount: inkTokenAmount,
        bankCardId: selectedCard
      };

      const response = await submitWithdrawRequest(withdrawRequest);

      if (response.code === 200 && "data" in response) {
        setShowSuccessAlert(true);
        setAmount("");
      } else {
        logger.error("Withdraw request failed", {
          response,
          request: withdrawRequest,
          context: "Withdraw.handleSubmit"
        });

        switch (response.code) {
          case 4001:
            setSubmitError(t("wallet.withdraw.errors.amountTooSmall"));
            break;
          case 402:
            setSubmitError(t("wallet.withdraw.errors.insufficientBalance"));
            break;
          case 405:
            setSubmitError(t("wallet.withdraw.errors.pendingWithdraw"));
            break;
          default:
            setSubmitError(
              response.msg || t("wallet.withdraw.errors.submitFailed")
            );
        }
      }
    } catch (err) {
      logger.error("Submit withdraw error", {
        error: err,
        amount,
        inkAmount: inkTokenAmount,
        context: "Withdraw.handleSubmit"
      });
      setSubmitError(t("wallet.withdraw.errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加刷新银行卡列表的函数
  const refreshBankCards = async () => {
    try {
      const response = await getBankCards();
      if (response.code === 200 && "data" in response) {
        setSavedCards(response.data.dataList || []);
        setCardError("");
      } else {
        logger.error("Failed to refresh bank cards", {
          response,
          context: "Withdraw.refreshBankCards"
        });
      }
    } catch (err) {
      logger.error("Refresh bank cards error", {
        error: err,
        context: "Withdraw.refreshBankCards"
      });
    }
  };

  if (isLoading) {
    return <WithdrawSkeleton />;
  }

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
                totalIncome={totalIncome}
                availableUSD={availableUSD}
              />
            </div>

            {/* 金额输入部分 - 放在表单外 */}
            <div className="p-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                {t("wallet.withdraw.amountSection")}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <AmountInput
                  amount={amount}
                  inkAmount={inkTokenAmount}
                  onChange={setAmount}
                  maxInkAmount={totalIncome}
                />
              </div>
            </div>

            {/* 银行卡部分 - 放在表单外 */}
            <div className="p-6">
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
                    onCardDeleted={refreshBankCards}
                  />
                ) : (
                  <div className="p-4">
                    <InternationalBankForm
                      card={newCard}
                      onChange={setNewCard}
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveNewCard}
                        disabled={isSavingCard}
                        className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        {isSavingCard && (
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                        )}
                        <span>
                          {isSavingCard
                            ? t("wallet.withdraw.savingCard")
                            : t("wallet.withdraw.saveCard")}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 提交表单部分 - 只包含提交按钮 */}
            <form onSubmit={handleSubmit} className="p-6">
              {submitError && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-4">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}
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
            </form>

            <div className="mt-8">
              <WithdrawHistory />
            </div>

            {/* 提现说明 */}
            <div className="p-6 bg-gray-50 rounded-b-xl">
              <WithdrawNotice />
            </div>
          </div>
        </div>
      </div>

      {showSuccessAlert && (
        <Alert
          type="success"
          message={t("wallet.withdraw.submitSuccess")}
          onClose={() => setShowSuccessAlert(false)}
          autoClose={true}
        />
      )}
    </div>
  );
}

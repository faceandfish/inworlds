import React, { useState } from "react";
import { tipAuthor } from "@/app/lib/action";
import { useTranslation } from "../useTranslation";
import { useUser } from "../UserContextProvider";

interface TipButtonProps {
  authorId: number;
  bookId?: number;
  chapterId?: number;
  onTipComplete?: (success: boolean) => void;
  className?: string;
  onError?: (message: string) => void; // 添加这行
  onSuccess?: (message: string) => void;
}

interface TipAmountButtonProps {
  coins: number | string;
  onClick: (amount: number) => void;
  isSelected: boolean;
}

const TipAmountButton: React.FC<TipAmountButtonProps> = ({
  coins,
  onClick,
  isSelected
}) => {
  const { t } = useTranslation("book");
  return (
    <button
      onClick={() => onClick(Number(coins))}
      className={` text-neutral-500 flex-shrink-0 px-4 py-2 rounded transition duration-300 ease-in-out ${
        isSelected
          ? "bg-orange-400 text-white"
          : "bg-white border border-neutral-500 hover:bg-neutral-200"
      }`}
    >
      {coins} {t("coins")}
    </button>
  );
};

const TipButton: React.FC<TipButtonProps> = ({
  authorId,
  bookId,
  chapterId,
  onTipComplete,
  onError, // 添加这个
  onSuccess, // 添加这个
  className = ""
}) => {
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [customCoins, setCustomCoins] = useState<string>("");
  const [selectedCoins, setSelectedCoins] = useState<number>(0);
  const { t } = useTranslation("book");
  const { user } = useUser();

  const handleSelectAmount = (coins: number) => {
    setSelectedCoins(coins);
  };

  const handleConfirmTip = async () => {
    try {
      if (!user) {
        onError?.("loginRequired");
        setShowTipDialog(false);
        return;
      }

      const response = await tipAuthor(authorId, selectedCoins);

      switch (response.code) {
        case 200:
          // 打赏成功
          onSuccess?.(
            t("tipSuccessMessage", {
              coins: response.data.coins,
              newBalance: response.data.newBalance
            })
          );
          setShowTipDialog(false);
          setCustomCoins("");
          setSelectedCoins(0);
          break;
        case 602:
          onError?.("insufficientBalance");
          setShowTipDialog(false);
          break;

        default:
          onError?.(t("tipError"));

          setShowTipDialog(false);
      }
    } catch (error) {
      onError?.(t("tipError"));
      setShowTipDialog(false);
      setCustomCoins(""); // 添加这行
      setSelectedCoins(0); // 添加这行
    }
  };

  const tipAmounts = [10, 50, 100];

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomCoins(value);
    }
  };

  const isCustomAmountValid = customCoins !== "" && Number(customCoins) > 0;

  const handleTipClick = () => {
    if (!user) {
      onError?.("loginRequired");
      return;
    }
    setShowTipDialog(true);
  };

  return (
    <>
      <button
        onClick={handleTipClick}
        className={`px-5 py-2 rounded text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out ${className}`}
      >
        {t("reward")}
      </button>
      {showTipDialog && (
        <div className="fixed px-6 md:px-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">{t("selectTipAmount")}</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {tipAmounts.map((amount) => (
                <TipAmountButton
                  key={amount}
                  coins={amount}
                  onClick={() => handleSelectAmount(amount)}
                  isSelected={selectedCoins === amount}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-4  mb-4">
              <input
                type="text"
                value={customCoins}
                onChange={handleCustomAmountChange}
                placeholder={t("enterCustomAmount")}
                className="border rounded px-3 py-2 w-full "
              />
              <TipAmountButton
                coins={customCoins || t("custom")}
                onClick={() => handleSelectAmount(Number(customCoins))}
                isSelected={
                  isCustomAmountValid && selectedCoins === Number(customCoins)
                }
              />
            </div>
            <div className="flex gap-5">
              <button
                onClick={() => {
                  setShowTipDialog(false);
                  setCustomCoins("");
                  setSelectedCoins(0);
                }}
                className="text-white bg-neutral-400 px-3 py-2 rounded hover:bg-neutral-500 transition duration-300 ease-in-out"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirmTip}
                disabled={selectedCoins === null}
                className={`text-white px-3 py-2 rounded transition duration-300 ease-in-out ${
                  selectedCoins === 0
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500"
                }`}
              >
                {t("confirmPay")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TipButton;

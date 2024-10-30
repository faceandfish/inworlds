import React, { useState, useCallback } from "react";
import { tipAuthor, tipChapter } from "@/app/lib/action";
import { useTranslation } from "../useTranslation";
import { useUser } from "../UserContextProvider";
import { ApiResponse, TipResponse } from "@/app/lib/definitions";
import Alert from "./Alert";

interface TipButtonProps {
  authorId?: number;
  bookId?: number;
  chapterId?: number;
  className?: string;
}

interface TipAmountButtonProps {
  amount: number;
  onClick: (amount: number) => void;
  isSelected: boolean;
}

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

// Separate TipAmountButton component with memoization
const TipAmountButton: React.FC<TipAmountButtonProps> = React.memo(
  ({ amount, onClick, isSelected }) => {
    const { t } = useTranslation("book");

    return (
      <button
        onClick={() => onClick(amount)}
        className={`text-neutral-500 flex-shrink-0 px-4 py-2 rounded transition duration-300 ease-in-out ${
          isSelected
            ? "bg-orange-400 text-white"
            : "bg-white border border-neutral-500 hover:bg-neutral-200"
        }`}
      >
        {amount} {t("coins")}
      </button>
    );
  }
);

TipAmountButton.displayName = "TipAmountButton";

const TipButton: React.FC<TipButtonProps> = ({
  authorId,
  bookId,
  chapterId,
  className = ""
}) => {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success"
  });

  // Hooks
  const { t } = useTranslation("book");
  const { user } = useUser();

  // Constants
  const PREDEFINED_AMOUNTS = [10, 50, 100];

  // Alert handlers
  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({
      show: true,
      message,
      type
    });
  };

  const handleCloseAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, show: false }));
  }, []);

  // Dialog handlers
  const handleOpenDialog = useCallback(() => {
    if (!user) {
      showAlert(t("loginRequired"), "error");
      return;
    }
    setIsDialogOpen(true);
  }, [user, t]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedAmount(0);
    setCustomAmount("");
    setIsProcessing(false);
  }, []);

  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
  }, []);

  const handleCustomAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setCustomAmount(value);
        if (value) {
          setSelectedAmount(Number(value));
        } else {
          setSelectedAmount(0);
        }
      }
    },
    []
  );

  const handleConfirmTip = useCallback(async () => {
    if (!user || selectedAmount <= 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      let response: ApiResponse<TipResponse> | undefined;

      if (bookId && chapterId) {
        response = await tipChapter(selectedAmount, bookId, chapterId);
      } else if (authorId) {
        response = await tipAuthor(authorId, selectedAmount);
      }

      if (!response) {
        throw new Error("No response from server");
      }

      switch (response.code) {
        case 200:
          handleCloseDialog();
          showAlert(
            t("tipSuccessMessage", {
              coins: response.data.coins,
              newBalance: response.data.newBalance
            }),
            "success"
          );
          break;
        case 602:
          showAlert(t("insufficientBalance"), "error");
          break;
        default:
          showAlert(t("tipError"), "error");
      }
    } catch (error) {
      console.error("Tip error:", error);
      showAlert(t("tipError"), "error");
    } finally {
      setIsProcessing(false);
    }
  }, [user, selectedAmount, bookId, chapterId, authorId, t, handleCloseDialog]);

  return (
    <>
      <button
        onClick={handleOpenDialog}
        className={`px-5 py-2 rounded text-white bg-orange-400 hover:bg-orange-500 transition duration-300 ease-in-out ${className}`}
        disabled={isProcessing}
      >
        {t("reward")}
      </button>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDialog();
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {t("selectTipAmount")}
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              {PREDEFINED_AMOUNTS.map((amount) => (
                <TipAmountButton
                  key={amount}
                  amount={amount}
                  onClick={handleAmountSelect}
                  isSelected={selectedAmount === amount}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder={t("enterCustomAmount")}
                className="border rounded px-3 py-2 flex-1"
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                disabled={isProcessing}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleConfirmTip}
                disabled={selectedAmount <= 0 || isProcessing}
                className={`px-4 py-2 rounded text-white transition-colors ${
                  selectedAmount <= 0 || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500"
                }`}
              >
                {isProcessing ? t("processing") : t("confirmPay")}
              </button>
            </div>
          </div>
        </div>
      )}

      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={handleCloseAlert}
          autoClose={true}
        />
      )}
    </>
  );
};

export default React.memo(TipButton);

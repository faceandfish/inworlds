// PaidChapterContent.tsx
"use client";
import React, { useState } from "react";
import { ChapterInfo, BookInfo } from "@/app/lib/definitions";
import Alert from "../Main/Alert";
import { useRouter } from "next/navigation";
import { payForChapter } from "@/app/lib/action";
import { useUser } from "../UserContextProvider";
import { usePurchasedChapters } from "../PurchasedChaptersProvider.tsx";
import { useTranslation } from "../useTranslation";

interface PaidChapterContentProps {
  chapter: ChapterInfo;
  book: BookInfo;
  isPurchased: boolean;
  onPurchaseSuccess: () => void;
}

const PaidChapterContent: React.FC<PaidChapterContentProps> = ({
  chapter,
  book,
  isPurchased,
  onPurchaseSuccess
}) => {
  const { t } = useTranslation("book");
  const { user } = useUser();
  const router = useRouter();
  const {
    addPurchasedChapter,
    loading: purchaseLoading,
    error: purchaseError,
    clearError
  } = usePurchasedChapters();

  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showInsufficientBalanceAlert, setShowInsufficientBalanceAlert] =
    useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 处理购买功能的错误显示
  React.useEffect(() => {
    if (purchaseError) {
      setAlertMessage(purchaseError);
      setShowPaymentAlert(true);
      clearError();
    }
  }, [purchaseError, clearError]);

  const handleBuyCoins = () => {
    if (user && user.id) {
      router.push(`/user/${user.id}/wallet`);
    } else {
      setShowLoginAlert(true);
      setShowInsufficientBalanceAlert(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
    setShowLoginAlert(false);
  };

  const handleChapterPayment = async () => {
    try {
      const response = await payForChapter(book.id, chapter.id);

      switch (response.code) {
        case 200:
        case 601:
          setAlertMessage(
            response.code === 200 ? t("purchaseSuccess") : t("alreadyPurchased")
          );
          addPurchasedChapter(book.id, chapter.id);
          onPurchaseSuccess();
          setShowPaymentAlert(true);
          break;
        case 602:
          setShowInsufficientBalanceAlert(true);
          break;
        default:
          throw new Error(response.msg || "Failed to pay for chapter");
      }
    } catch (error) {
      console.error("Error paying for chapter:", error);
      setAlertMessage(t("purchaseError"));
      setShowPaymentAlert(true);
    }
  };

  if (!chapter.isPaid || isPurchased) {
    return null;
  }

  return (
    <>
      <div className="w-full text-center border bg-orange-100 shadow-md py-10">
        <p className="text-lg text-neutral-600 mb-4">
          {t("paidChapter", { price: chapter.price })}
        </p>
        <button
          onClick={handleChapterPayment}
          disabled={purchaseLoading}
          className={`${
            purchaseLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-400 hover:bg-orange-500"
          } text-white px-6 py-2 rounded-full transition duration-300`}
        >
          {purchaseLoading ? t("processing") : t("payAndRead")}
        </button>
      </div>

      {showPaymentAlert && (
        <Alert
          message={alertMessage}
          type={
            alertMessage === t("purchaseSuccess") ||
            alertMessage === t("alreadyPurchased")
              ? "success"
              : "error"
          }
          onClose={() => setShowPaymentAlert(false)}
          autoClose={true}
        />
      )}

      {showInsufficientBalanceAlert && (
        <Alert
          message={t("insufficientBalance")}
          type="error"
          onClose={() => setShowInsufficientBalanceAlert(false)}
          customButton={{
            text: t("buyCoins"),
            onClick: handleBuyCoins
          }}
          autoClose={false}
        />
      )}

      {showLoginAlert && (
        <Alert
          message={t("loginRequired")}
          type="error"
          onClose={() => setShowLoginAlert(false)}
          customButton={{
            text: t("goToLogin"),
            onClick: handleLogin
          }}
          autoClose={false}
        />
      )}
    </>
  );
};

export default PaidChapterContent;

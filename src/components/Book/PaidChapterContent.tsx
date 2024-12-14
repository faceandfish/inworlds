// PaidChapterContent.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
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
  children?: React.ReactNode;
}

const PaidChapterContent: React.FC<PaidChapterContentProps> = React.memo(
  ({ chapter, book, isPurchased, onPurchaseSuccess, children }) => {
    const { t } = useTranslation("book");
    const { user } = useUser();
    const router = useRouter();
    const {
      addPurchasedChapter,
      error: purchaseError,
      clearError
    } = usePurchasedChapters();

    const [showPaymentAlert, setShowPaymentAlert] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<number | null>(null);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showInsufficientBalanceAlert, setShowInsufficientBalanceAlert] =
      useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const isAuthor = useMemo(
      () => user?.id === book.authorId,
      [user?.id, book.authorId]
    );

    useEffect(() => {
      if (purchaseError) {
        setAlertMessage(purchaseError);
        setShowPaymentAlert(true);
        clearError();
      }
    }, [purchaseError, clearError]);

    const handleBuyCoins = () => {
      if (user?.id) {
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
      if (paymentLoading) return;
      setPaymentLoading(true);
      setShowPaymentAlert(false);
      setShowInsufficientBalanceAlert(false);

      try {
        const response = await payForChapter(book.id, chapter.id);

        setPaymentStatus(response.code);

        if ("data" in response) {
          switch (response.code) {
            case 200:
              if (response.data) {
                setAlertMessage(
                  t("purchaseSuccessDetail", {
                    coins: response.data.coinsPaid,
                    newBalance: response.data.newBalance
                  })
                );
                addPurchasedChapter(book.id, chapter.id);
                onPurchaseSuccess();
                setShowPaymentAlert(true);
              } else {
                setAlertMessage(t("purchaseError"));
                setShowPaymentAlert(true);
              }
              break;
            case 601:
              setAlertMessage(t("alreadyPurchased"));
              addPurchasedChapter(book.id, chapter.id);
              onPurchaseSuccess();
              setShowPaymentAlert(true);
              break;
            case 602:
              setShowInsufficientBalanceAlert(true);
              break;
            default:
              setAlertMessage(response.msg || t("purchaseError"));
              setShowPaymentAlert(true);
          }
        }
      } catch (err) {
        setPaymentStatus(null);
        setAlertMessage(t("purchaseError"));
        setShowPaymentAlert(true);
      } finally {
        setPaymentLoading(false);
      }
    };

    const alertElements = (
      <>
        {showPaymentAlert && (
          <Alert
            message={alertMessage}
            type={
              paymentStatus === 200 || paymentStatus === 601
                ? "success"
                : "error"
            }
            onClose={() => {
              setShowPaymentAlert(false);
              setPaymentStatus(null);
            }}
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

    if (!chapter.isPaid || isPurchased || isAuthor) {
      return <>{children}</>;
    }

    return (
      <>
        <div className="w-full text-center border bg-orange-100 shadow-md py-10">
          <p className="text-lg text-neutral-600 mb-4">
            {t("paidChapter", { price: chapter.price })}
          </p>
          <button
            onClick={handleChapterPayment}
            disabled={paymentLoading}
            className={`${
              paymentLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500"
            } text-white px-6 py-2 rounded-full transition duration-300`}
          >
            {paymentLoading ? t("processing") : t("payAndRead")}
          </button>
        </div>
        {alertElements}
      </>
    );
  }
);

export default PaidChapterContent;

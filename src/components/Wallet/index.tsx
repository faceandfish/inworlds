"use client";
import React, { useState, useEffect } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { PurchaseOptions } from "./PurchaseOptions";
import { DonationTip } from "./DonationTip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PurchaseOption,
  PurchaseHistory,
  DonationHistory,
  ConfirmPayPalOrderRequest,
  ApiResponse,
  PurchasedChapterInfo,
  PaginatedData
} from "@/app/lib/definitions";

import { useUser } from "../UserContextProvider";
import {
  confirmPayPalOrder,
  createPayPalOrder,
  getBookPurchasedChapters,
  getDonationHistory,
  getPurchaseHistory,
  getUserBalance
} from "@/app/lib/action";
import Alert from "../Alert";
import { useTranslation } from "../useTranslation";
import WalletSkeleton from "./WalletSkeleton";
import { PurchasedChaptersCard } from "./PurchasedChaptersCard";
import { DonationHistoryCard } from "./DonationHistoryCard";
import { PurchaseHistoryCard } from "./PurchaseHistoryCard";

const Wallet: React.FC = () => {
  const { t } = useTranslation("wallet");
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState<number | null>(null);
  const { user } = useUser();
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPurchase, setCurrentPurchase] = useState<PurchaseOption | null>(
    null
  );
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(false);
  const [internalOrderId, setInternalOrderId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentWindowOpened, setPaymentWindowOpened] =
    useState<boolean>(false);
  const searchParams = useSearchParams();

  const [purchaseHistory, setPurchaseHistory] =
    useState<PaginatedData<PurchaseHistory> | null>(null);
  const [donationHistory, setDonationHistory] =
    useState<PaginatedData<DonationHistory> | null>(null);

  const [purchasedChapters, setPurchasedChapters] =
    useState<PaginatedData<PurchasedChapterInfo> | null>(null);

  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const [
          balanceResponse,
          purchaseResponse,
          donationResponse,
          chaptersResponse
        ] = await Promise.all([
          getUserBalance(),
          getPurchaseHistory(1, 5),
          getDonationHistory(1, 5),
          getBookPurchasedChapters(1, 5)
        ]);
        setBalance(balanceResponse.data.availableBalance);
        setPurchaseHistory(purchaseResponse.data);
        setDonationHistory(donationResponse.data);
        setPurchasedChapters(chaptersResponse.data);
        const errors = [];
        if (balanceResponse.code !== 200) errors.push("获取用户余额失败");
        if (purchaseResponse.code !== 200) errors.push("获取购买历史失败");
        if (donationResponse.code !== 200) errors.push("获取打赏历史失败");
        if (chaptersResponse.code !== 200) errors.push("获取已购买章节失败");

        if (errors.length > 0) {
          const errorMessage = errors.join(", ");
          console.error("数据获取失败:", errorMessage);
          setHistoryError(
            `部分数据获取失败：${errorMessage}。请检查控制台以获取详细信息。`
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setHistoryError("获取数据时发生错误，请稍后重试。");
      } finally {
        setHistoryLoading(false);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handlePaymentCompletion = async () => {
      const paymentStatus = searchParams.get("paymentStatus");
      const orderId = searchParams.get("orderId");
      if (paymentStatus === "completed" && orderId) {
        setIsLoading(true);
        setInternalOrderId(orderId);
        await handleConfirmPayment();
        // 移除了 router.replace(newPath)
      }
    };

    handlePaymentCompletion();
  }, [searchParams]);

  const fetchUserBalance = async () => {
    try {
      const response = await getUserBalance();
      if (response.code === 200) {
        setBalance(response.data.availableBalance);
      } else {
        console.error("Failed to get user balance:", response.msg);
      }
    } catch (error) {
      console.error("Error while fetching user balance:", error);
    }
  };

  const handlePurchase = (option: PurchaseOption) => {
    setIsLoading(true);
    setAlert({
      message: t("wallet.alerts.orderCreating"),
      type: "success"
    });
    createOrder(option);
  };

  const createOrder = async (option: PurchaseOption) => {
    try {
      const orderResponse = await createPayPalOrder({
        amount: option.price.toString(),
        currency: "USD",
        description: t("wallet.purchaseOptions.coins", { coins: option.coins })
      });

      if (orderResponse.code === 200 && orderResponse.data) {
        setPaymentUrl(orderResponse.data.paymentUrl);
        setIsLoading(false);
        setAlert({
          message: t("wallet.alerts.paymentConfirmation", {
            coins: option.coins,
            price: option.price
          }),
          type: "success"
        });
      } else {
        setAlert({
          message: t("wallet.alerts.orderCreationFailed"),
          type: "error"
        });
        resetPurchaseState();
      }
    } catch (error) {
      setAlert({
        message: t("wallet.alerts.orderCreationError"),
        type: "error"
      });
      resetPurchaseState();
    }
  };

  const handlePurchaseHistoryPageChange = async (page: number) => {
    try {
      const response = await getPurchaseHistory(page, 5);
      setPurchaseHistory(response.data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const handleDonationHistoryPageChange = async (page: number) => {
    try {
      const response = await getDonationHistory(page, 5);
      setDonationHistory(response.data);
    } catch (error) {
      console.error("Error fetching donation history:", error);
    }
  };

  const handlePurchasedChaptersPageChange = async (page: number) => {
    try {
      const response = await getBookPurchasedChapters(page, 5);
      setPurchasedChapters(response.data);
    } catch (error) {
      console.error("Error fetching purchased chapters:", error);
    }
  };

  const handleOpenPaymentWindow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      setPaymentWindowOpened(true);
      setAlert({
        message: t("wallet.alerts.paymentWindowOpened"),
        type: "success"
      });
    }
  };

  const handleConfirmPayment = async () => {
    if (internalOrderId === null) {
      console.error("No order ID available for confirmation");
      return;
    }
    setIsLoading(true);
    try {
      const orderData: ConfirmPayPalOrderRequest = { orderId: internalOrderId };
      const response = await confirmPayPalOrder(orderData);
      if (response.code === 200) {
        setIsPaymentConfirmed(true);
        // 更新余额
        await fetchUserBalance();
        setAlert({
          message: t("wallet.alerts.purchaseSuccess"),
          type: "success"
        });
      } else {
        setAlert({
          message: t("wallet.alerts.purchaseFailed"),
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPurchaseState = () => {
    setCurrentPurchase(null);
    setInternalOrderId(null);
    setPaymentUrl(null);
    setPaymentWindowOpened(false);
    setIsLoading(false);
  };

  const handleAlertClose = () => {
    setAlert(null);
    resetPurchaseState();
  };

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className=" mx-auto px-4 md:px-20 py-10">
      <div className="flex flex-col gap-6 md:gap-10 md:flex-row md:space-x-4">
        <div className="w-full md:w-1/2">
          <h1 className="sm:text-2xl text-xl font-bold mb-4 text-neutral-600">
            {t("wallet.title")}
          </h1>
          <BalanceDisplay balance={balance ?? 0} />
          <PurchaseOptions
            onPurchase={handlePurchase}
            isConfirmingPayment={isLoading || paymentWindowOpened}
          />
          <DonationTip />
        </div>
        <div className="w-full md:w-1/2 ">
          {historyLoading ? (
            <p>Loading histories...</p>
          ) : historyError ? (
            <p>Error: {historyError}</p>
          ) : (
            <>
              <PurchasedChaptersCard
                purchasedChapters={purchasedChapters!}
                onPageChange={handlePurchasedChaptersPageChange}
              />
              <PurchaseHistoryCard
                purchaseHistory={purchaseHistory!}
                onPageChange={handlePurchaseHistoryPageChange}
              />
              <DonationHistoryCard
                donationHistory={donationHistory!}
                onPageChange={handleDonationHistoryPageChange}
              />
            </>
          )}
        </div>
      </div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
          customButton={
            isLoading
              ? undefined
              : paymentUrl
              ? {
                  text: t("wallet.buttons.proceedToPayment"),
                  onClick: handleOpenPaymentWindow
                }
              : undefined
          }
          autoClose={false}
        />
      )}
    </div>
  );
};

export default Wallet;

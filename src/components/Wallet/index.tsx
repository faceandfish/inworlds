"use client";
import React, { useState, useEffect } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { PurchaseOptions } from "./PurchaseOptions";
import { DonationTip } from "./DonationTip";
import { useSearchParams } from "next/navigation";
import {
  PurchaseOption,
  PurchaseHistory,
  DonationHistory,
  ConfirmPayPalOrderRequest,
  PurchasedChapterInfo,
  PaginatedData
} from "@/app/lib/definitions";

import {
  confirmPayPalOrder,
  createPayPalOrder,
  getBookPurchasedChapters,
  getDonationHistory,
  getPurchaseHistory,
  getUserBalance
} from "@/app/lib/action";
import Alert from "../Main/Alert";
import { useTranslation } from "../useTranslation";
import WalletSkeleton from "./WalletSkeleton";
import { PurchasedChaptersCard } from "./PurchasedChaptersCard";
import { DonationHistoryCard } from "./DonationHistoryCard";
import { PurchaseHistoryCard } from "./PurchaseHistoryCard";
import { logger } from "@/components/Main/logger";

const Wallet: React.FC = () => {
  const { t } = useTranslation("wallet");
  const [balance, setBalance] = useState<number | null>(null);
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

        const errors = [];

        if (balanceResponse.code === 200 && "data" in balanceResponse) {
          setBalance(balanceResponse.data.availableBalance);
        } else {
          logger.error("Invalid balance response", {
            response: balanceResponse,
            context: "Wallet.fetchInitialData"
          });
        }

        if (purchaseResponse.code === 200 && "data" in purchaseResponse) {
          setPurchaseHistory(purchaseResponse.data);
        } else {
          errors.push("获取购买历史失败");
          logger.error("Invalid purchase history response", {
            response: purchaseResponse,
            context: "Wallet.fetchInitialData"
          });
        }

        if (donationResponse.code === 200 && "data" in donationResponse) {
          setDonationHistory(donationResponse.data);
        } else {
          errors.push("获取打赏历史失败");
          logger.error("Invalid donation history response", {
            response: donationResponse,
            context: "Wallet.fetchInitialData"
          });
        }

        if (chaptersResponse.code === 200 && "data" in chaptersResponse) {
          setPurchasedChapters(chaptersResponse.data);
        } else {
          logger.error("Invalid purchased chapters response", {
            response: chaptersResponse,
            context: "Wallet.fetchInitialData"
          });
        }

        if (errors.length > 0) {
          const errorMessage = errors.join(", ");
          logger.error("Multiple fetch failures", {
            errors: errorMessage,
            context: "Wallet.fetchInitialData"
          });
        }
      } catch (error) {
        logger.error("Failed to fetch initial data", {
          error,
          context: "Wallet.fetchInitialData"
        });
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
      if (response.code === 200 && "data" in response) {
        setBalance(response.data.availableBalance);
      } else {
        logger.error("Failed to get user balance", {
          response,
          context: "Wallet.fetchUserBalance"
        });
      }
    } catch (error) {
      logger.error("Error while fetching user balance", {
        error,
        context: "Wallet.fetchUserBalance"
      });
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

      if (orderResponse.code === 200 && "data" in orderResponse) {
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
      if (response.code === 200 && "data" in response) {
        setPurchaseHistory(response.data);
      } else {
        logger.error("Invalid purchase history response", {
          response,
          context: "Wallet.handlePurchaseHistoryPageChange"
        });
      }
    } catch (error) {
      logger.error("Failed to fetch purchase history", {
        error,
        page,
        context: "Wallet.handlePurchaseHistoryPageChange"
      });
    }
  };

  const handleDonationHistoryPageChange = async (page: number) => {
    try {
      const response = await getDonationHistory(page, 5);
      if (response.code === 200 && "data" in response) {
        setDonationHistory(response.data);
      } else {
        logger.error("Invalid donation history response", {
          response,
          context: "Wallet.handleDonationHistoryPageChange"
        });
      }
    } catch (error) {
      logger.error("Failed to fetch donation history", {
        error,
        page,
        context: "Wallet.handleDonationHistoryPageChange"
      });
    }
  };

  const handlePurchasedChaptersPageChange = async (page: number) => {
    try {
      const response = await getBookPurchasedChapters(page, 5);
      if (response.code === 200 && "data" in response) {
        setPurchasedChapters(response.data);
      } else {
        logger.error("Invalid purchased chapters response", {
          response,
          context: "Wallet.handlePurchasedChaptersPageChange"
        });
      }
    } catch (error) {
      logger.error("Failed to fetch purchased chapters", {
        error,
        page,
        context: "Wallet.handlePurchasedChaptersPageChange"
      });
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
      logger.error("No order ID available for confirmation", {
        context: "Wallet.handleConfirmPayment"
      });
      return;
    }
    setIsLoading(true);
    try {
      const orderData: ConfirmPayPalOrderRequest = { orderId: internalOrderId };
      const response = await confirmPayPalOrder(orderData);
      if (response.code === 200 && "data" in response) {
        setIsPaymentConfirmed(true);
        await fetchUserBalance();
        setAlert({
          message: t("wallet.alerts.purchaseSuccess"),
          type: "success"
        });
      } else {
        logger.error("Payment confirmation failed", {
          response,
          orderId: internalOrderId,
          context: "Wallet.handleConfirmPayment"
        });
        setAlert({
          message: t("wallet.alerts.purchaseFailed"),
          type: "error"
        });
      }
    } catch (error) {
      logger.error("Error during payment confirmation", {
        error,
        orderId: internalOrderId,
        context: "Wallet.handleConfirmPayment"
      });
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
              <PurchaseHistoryCard
                purchaseHistory={purchaseHistory!}
                onPageChange={handlePurchaseHistoryPageChange}
              />
              <PurchasedChaptersCard
                purchasedChapters={purchasedChapters!}
                onPageChange={handlePurchasedChaptersPageChange}
              />

              {donationHistory && ( // 添加空值检查
                <DonationHistoryCard
                  donationHistory={donationHistory} // 移除 ! 操作符
                  onPageChange={handleDonationHistoryPageChange}
                />
              )}
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

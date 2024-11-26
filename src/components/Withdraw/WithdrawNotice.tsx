import Link from "next/link";
import { useTranslation } from "../useTranslation";

export const WithdrawNotice: React.FC = () => {
  const { t } = useTranslation("wallet");

  return (
    <div className="mt-6 text-sm text-gray-500">
      <h3 className="font-medium mb-2">{t("wallet.withdraw.notice")}</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          {t("wallet.withdraw.minAmount")}: $10.00
          <p className="ml-5 mt-1 text-xs">
            {t("wallet.withdraw.minAmountNote")}
          </p>
        </li>
        <li>
          {t("wallet.withdraw.processTime")}: 7-14{" "}
          {t("wallet.withdraw.businessDays")}
          <p className="ml-5 mt-1 text-xs">
            {t("wallet.withdraw.processTimeNote")}
          </p>
        </li>
        <li className="flex flex-col">
          <div className="flex items-start">
            <span>{t("wallet.withdraw.fee")}: </span>
            <Link
              href="https://www.paypal.com/us/digital-wallet/paypal-consumer-fees#TransfersOutOfPayPal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 ml-1 underline"
            >
              {t("wallet.withdraw.feeLink")}
            </Link>
          </div>
          <div className="ml-5 mt-1 text-xs space-y-2">
            <p>{t("wallet.withdraw.feeNote")}</p>
            <p>{t("wallet.withdraw.feeDeductionNote")}</p>
            <div className="mt-2 bg-gray-50 p-2 rounded">
              <p className="font-medium mb-1">
                {t("wallet.withdraw.feeExample")}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  {t("wallet.withdraw.feeExampleTotal", { amount: "1000" })}
                </li>
                <li>
                  {t("wallet.withdraw.feeExampleFee", {
                    rate: "1.75",
                    fee: "17.50"
                  })}
                </li>
                <li>
                  {t("wallet.withdraw.feeExampleFinal", { final: "982.50" })}
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

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
        <li className="flex items-start">
          <span>{t("wallet.withdraw.fee")}: </span>
          <Link
            href="https://www.paypal.com/withdraw/limits"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 ml-1 underline"
          >
            {t("wallet.withdraw.feeLink")}
          </Link>
          <p className="ml-5 mt-1 text-xs">{t("wallet.withdraw.feeNote")}</p>
        </li>
      </ul>
    </div>
  );
};

import { useTranslation } from "../useTranslation";

export const WithdrawNotice: React.FC = () => {
  const { t } = useTranslation("wallet");

  return (
    <div className="mt-6 text-sm text-gray-500">
      <h3 className="font-medium mb-2">{t("wallet.withdraw.notice")}</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>{t("wallet.withdraw.minAmount")}: $10.00</li>
        <li>
          {t("wallet.withdraw.processTime")}: 1-3{" "}
          {t("wallet.withdraw.businessDays")}
        </li>
        <li>{t("wallet.withdraw.fee")}: 2%</li>
      </ul>
    </div>
  );
};

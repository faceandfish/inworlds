import { UserInfo } from "@/app/lib/definitions";
import { useTranslation } from "@/components/useTranslation";

interface BalanceCardProps {
  totalIncome: UserInfo["totalIncome"];
  availableUSD: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalIncome,
  availableUSD
}) => {
  const { t } = useTranslation("wallet");

  return (
    <div className="bg-orange-50 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">{t("wallet.withdraw.available")}:</span>
        <span className="text-xl font-semibold text-orange-600">
          {totalIncome || 0} {t("wallet.withdraw.inkTokens")}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {t("wallet.withdraw.equivalentUSD")}:
        </span>
        <span className="text-gray-700">${availableUSD} USD</span>
      </div>
    </div>
  );
};

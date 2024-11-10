import { WithdrawRequest } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface AmountInputProps {
  amount: string;
  inkAmount: WithdrawRequest["inkAmount"]; // 使用 WithdrawRequest 接口的字段
  onChange: (value: string) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  inkAmount,
  onChange
}) => {
  const { t } = useTranslation("wallet");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("wallet.withdraw.amountLabel")} (USD)
      </label>
      <input
        type="text"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
            onChange(value);
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
        placeholder="0.00"
      />
      {amount && (
        <p className="text-sm text-gray-500">
          ≈ {inkAmount} {t("wallet.withdraw.inkTokens")}
        </p>
      )}
    </div>
  );
};

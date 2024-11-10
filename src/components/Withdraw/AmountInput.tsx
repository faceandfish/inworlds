import { WithdrawRequest } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface AmountInputProps {
  amount: string;
  maxInkAmount: number;
  inkAmount: WithdrawRequest["inkAmount"]; // 使用 WithdrawRequest 接口的字段
  onChange: (value: string) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  maxInkAmount,
  amount,
  inkAmount,
  onChange
}) => {
  const { t } = useTranslation("wallet");

  // 计算最大可输入的美元金额（根据墨币汇率换算）
  const maxUsdAmount = (maxInkAmount / 100).toFixed(2); // 假设汇率是 1美元 = 100墨币

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
          // 验证输入值是否为有效的金额格式，且不超过最大可提现金额
          if (
            (/^\d*\.?\d{0,2}$/.test(value) || value === "") &&
            (value === "" || Number(value) <= Number(maxUsdAmount))
          ) {
            onChange(value);
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none"
        placeholder="0.00"
        // 添加 max 属性限制最大值
        max={maxUsdAmount}
      />
      {amount && (
        <p className="text-sm text-gray-500">
          ≈ {inkAmount} {t("wallet.withdraw.inkTokens")}
          <span className="ml-2">
            ({t("wallet.withdraw.available")}: {maxInkAmount}{" "}
            {t("wallet.withdraw.inkTokens")})
          </span>
        </p>
      )}
      {/* 添加最大可提现金额提示 */}
      <p className="text-sm text-gray-500">
        {t("wallet.withdraw.maxWithdraw")}: ${maxUsdAmount}
      </p>
    </div>
  );
};

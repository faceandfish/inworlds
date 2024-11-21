import React from "react";
import { useTranslation } from "../useTranslation";

const COUNTRIES = [
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "SG", name: "Singapore" }
];

interface BankCard {
  bankName: string;
  cardNumber: string;
  holderName: string;
  isDefault: boolean;
  country: string;
  // 国际账户字段
  swiftCode?: string;
  bankAddress?: string;
  // 日本国内账户字段
  branchCode?: string;
  branchName?: string;
  accountType?: "ordinary" | "current"; // 普通账户 or 当座账户
}

interface InternationalBankFormProps {
  card: BankCard;
  onChange: (card: BankCard) => void;
}

const InternationalBankForm: React.FC<InternationalBankFormProps> = ({
  card,
  onChange
}) => {
  const { t } = useTranslation("wallet");

  const isJapan = card.country === "JP";

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    const isNewJapan = newCountry === "JP";

    onChange({
      ...card,
      country: newCountry,
      // 切换国家时清空对应字段
      swiftCode: isNewJapan ? undefined : card.swiftCode,
      bankAddress: isNewJapan ? undefined : card.bankAddress,
      branchCode: isNewJapan ? card.branchCode : undefined,
      branchName: isNewJapan ? card.branchName : undefined,
      accountType: isNewJapan ? card.accountType || "ordinary" : undefined
    });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">{t("wallet.withdraw.newCardInfo")}</h3>
      <div className="space-y-4">
        {/* 国家选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("wallet.withdraw.selectCountry")}
          </label>
          <select
            value={card.country}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* 银行名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("wallet.withdraw.bankName")}
          </label>
          <input
            type="text"
            value={card.bankName}
            onChange={(e) => onChange({ ...card, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* 日本国内银行特有字段 */}
        {isJapan && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("wallet.withdraw.branchName")}
              </label>
              <input
                type="text"
                value={card.branchName}
                onChange={(e) =>
                  onChange({ ...card, branchName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder={t("wallet.withdraw.branchNamePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("wallet.withdraw.branchCode")}
              </label>
              <input
                type="text"
                value={card.branchCode}
                onChange={(e) =>
                  onChange({ ...card, branchCode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="XXX"
                maxLength={3}
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("wallet.withdraw.branchCodeHelp")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("wallet.withdraw.accountType")}
              </label>
              <select
                value={card.accountType}
                onChange={(e) =>
                  onChange({
                    ...card,
                    accountType: e.target.value as "ordinary" | "current"
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="ordinary">
                  {t("wallet.withdraw.accountTypes.ordinary")}
                </option>
                <option value="current">
                  {t("wallet.withdraw.accountTypes.current")}
                </option>
              </select>
            </div>
          </>
        )}

        {/* 国际银行特有字段 */}
        {!isJapan && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("wallet.withdraw.swiftCode")}
              </label>
              <input
                type="text"
                value={card.swiftCode}
                onChange={(e) =>
                  onChange({ ...card, swiftCode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="XXXXXX XX XXX"
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("wallet.withdraw.swiftCodeHelp")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("wallet.withdraw.bankAddress")}
              </label>
              <input
                type="text"
                value={card.bankAddress}
                onChange={(e) =>
                  onChange({ ...card, bankAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </>
        )}

        {/* 账号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("wallet.withdraw.cardNumber")}
          </label>
          <input
            type="text"
            value={card.cardNumber}
            onChange={(e) => onChange({ ...card, cardNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* 账户持有人姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("wallet.withdraw.holderName")}
          </label>
          <input
            type="text"
            value={card.holderName}
            onChange={(e) => onChange({ ...card, holderName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* 设为默认 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="setDefault"
            checked={card.isDefault}
            onChange={(e) => onChange({ ...card, isDefault: e.target.checked })}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="setDefault" className="ml-2 text-sm text-gray-700">
            {t("wallet.withdraw.setAsDefault")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default InternationalBankForm;

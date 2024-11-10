import React from "react";
import { useTranslation } from "../useTranslation";

// 国家列表
const COUNTRIES = [
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "SG", name: "Singapore" }
  // 可以添加更多国家
];

interface InternationalBankFormProps {
  card: {
    bankName: string;
    cardNumber: string;
    holderName: string;
    isDefault: boolean;
    swiftCode?: string;
    bankAddress?: string;
    country: string;
  };
  onChange: (card: any) => void;
}

const InternationalBankForm: React.FC<InternationalBankFormProps> = ({
  card,
  onChange
}) => {
  const { t } = useTranslation("wallet");

  const isInternational = card.country !== "JP";

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    onChange({
      ...card,
      country: newCountry,
      // 如果切换回日本，清空国际转账相关字段
      swiftCode: newCountry === "JP" ? "" : card.swiftCode,
      bankAddress: newCountry === "JP" ? "" : card.bankAddress
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

        {isInternational && (
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

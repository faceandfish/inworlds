import { BankCard } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface BankCardListProps {
  cards: BankCard[];
  selectedCard: string;
  onSelectCard: (id: string) => void;
  onSetDefault?: (id: string) => void; // 添加设为默认的回调
  onDelete?: (id: string) => void;
}

export const BankCardList: React.FC<BankCardListProps> = ({
  cards,
  selectedCard,
  onSelectCard
}) => {
  const { t } = useTranslation("wallet");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("wallet.withdraw.selectCard")}
      </label>
      <div className="space-y-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedCard === card.id
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-200"
            }`}
            onClick={() => onSelectCard(card.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{card.bankName}</p>
                <p className="text-sm text-gray-500">
                  {card.cardNumber} - {card.holderName}
                </p>
              </div>
              {card.isDefault && (
                <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded">
                  {t("wallet.withdraw.default")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

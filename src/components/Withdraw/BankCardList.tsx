import { BankCard } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import { useState } from "react";
import { deleteBankCard } from "@/app/lib/action";
import { TrashIcon } from "@heroicons/react/24/outline";
import Alert from "../Main/Alert";

interface BankCardListProps {
  cards: BankCard[];
  selectedCard: string;
  onSelectCard: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onCardDeleted?: () => void;
}

export const BankCardList: React.FC<BankCardListProps> = ({
  cards,
  selectedCard,
  onSelectCard,
  onCardDeleted
}) => {
  const { t } = useTranslation("wallet");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showResultAlert, setShowResultAlert] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState<"success" | "error">("success");

  const handleDelete = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardToDelete(cardId);
    setShowConfirmAlert(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    setIsDeleting(true);
    setShowConfirmAlert(false);

    try {
      const response = await deleteBankCard(cardToDelete);
      if (response.code === 200) {
        if (selectedCard === cardToDelete) {
          onSelectCard("");
        }
        onCardDeleted?.();
        setResultType("success");
        setResultMessage(t("wallet.withdraw.deleteSuccess"));
      } else {
        setResultType("error");
        setResultMessage(
          response.msg || t("wallet.withdraw.errors.deleteFailed")
        );
      }
    } catch (err) {
      console.error("Delete card error:", err);
      setResultType("error");
      setResultMessage(t("wallet.withdraw.errors.deleteFailed"));
    } finally {
      setIsDeleting(false);
      setShowResultAlert(true);
      setCardToDelete(null);
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className={`relative p-4 border rounded-lg cursor-pointer transition-colors
              ${
                selectedCard === card.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{card.bankName}</div>
                <div className="text-sm text-gray-500">
                  {card.cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
                </div>
                <div className="text-sm text-gray-500">{card.holderName}</div>
              </div>
              <button
                onClick={(e) => handleDelete(card.id, e)}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title={t("wallet.withdraw.deleteCard")}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            {card.isDefault && (
              <span className="absolute top-2 right-2 text-xs text-orange-500">
                {t("wallet.withdraw.defaultCard")}
              </span>
            )}
          </div>
        ))}
      </div>

      {showConfirmAlert && (
        <Alert
          type="error"
          message={t("wallet.withdraw.confirmDeleteCard")}
          onClose={() => setShowConfirmAlert(false)}
          autoClose={false}
          customButton={{
            text: t("wallet.withdraw.confirmDelete"),
            onClick: confirmDelete
          }}
        />
      )}

      {showResultAlert && (
        <Alert
          type={resultType}
          message={resultMessage}
          onClose={() => setShowResultAlert(false)}
          autoClose={true}
        />
      )}
    </div>
  );
};

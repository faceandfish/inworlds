import React, { useState } from "react";
import { BookInfo } from "@/app/lib/definitions";
import BookStatusSelector from "../WritingPage/BookStatusSelector";
import CategorySelect from "../WritingPage/CategorySelect";
import Alert from "../Alert";
import { useTranslation } from "../useTranslation";

interface StatusAndCategoryUpdateProps {
  book: BookInfo;
  onUpdate: (
    updatedBook: Partial<Pick<BookInfo, "status" | "category">>
  ) => Promise<boolean>;
}

const StatusAndCategoryUpdate: React.FC<StatusAndCategoryUpdateProps> = ({
  book,
  onUpdate
}) => {
  const { t } = useTranslation("bookedit");
  const [status, setStatus] = useState<BookInfo["status"]>(book.status);
  const [category, setCategory] = useState<BookInfo["category"]>(book.category);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleUpdate = async () => {
    try {
      const success = await onUpdate({ status, category });
      if (success) {
        setAlert({
          message: t("statusAndCategory.updateSuccess"),
          type: "success"
        });
      } else {
        setAlert({ message: t("statusAndCategory.updateFail"), type: "error" });
      }
    } catch (error) {
      setAlert({ message: t("statusAndCategory.updateError"), type: "error" });
    }
  };

  return (
    <div className="space-y-10">
      <BookStatusSelector status={status} onStatusChange={setStatus} />
      <CategorySelect value={category} onChange={setCategory} />
      <button
        onClick={handleUpdate}
        className="mt-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {t("statusAndCategory.saveChanges")}
      </button>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default StatusAndCategoryUpdate;

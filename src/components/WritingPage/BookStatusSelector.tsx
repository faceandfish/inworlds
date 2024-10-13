import React from "react";
import { BookInfo } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";

interface BookStatusSelectorProps {
  status: BookInfo["status"];
  onStatusChange: (status: BookInfo["status"]) => void;
  error?: string;
}

const BookStatusSelector: React.FC<BookStatusSelectorProps> = ({
  status,
  onStatusChange
}) => {
  const { t } = useTranslation("book");
  return (
    <div className="flex flex-col space-y-6 ">
      <label className="text-2xl font-medium text-gray-700">
        {t("bookStatus.title")}
      </label>
      <p className="text-sm bg-yellow-50 border-l-4 border-yellow-400  p-2  text-yellow-700">
        {t("bookStatus.tip")}
      </p>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-orange-600"
            name="status"
            value="ongoing"
            checked={status === "ongoing"}
            onChange={() => onStatusChange("ongoing")}
          />
          <span className="ml-2">{t("bookStatus.ongoing")}</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-orange-600"
            name="status"
            value="completed"
            checked={status === "completed"}
            onChange={() => onStatusChange("completed")}
          />
          <span className="ml-2">{t("bookStatus.completed")}</span>
        </label>
      </div>
    </div>
  );
};

export default BookStatusSelector;

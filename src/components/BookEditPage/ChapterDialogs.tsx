// ChapterDialogs.tsx
import React from "react";
import { XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { ChapterInfo } from "@/app/lib/definitions";
import AuthorNote from "../WritingPage/AuthorNote";

interface DialogProps {
  t: (key: string) => string;
  onClose: () => void;
}

interface StatusDialogProps extends DialogProps {
  isOpen: boolean;
  selectedChapter: ChapterInfo | null;
  newStatus: "draft" | "published" | "scheduled";
  newDate: string;
  minDateTime: string;
  handleStatusChange: (status: "draft" | "published" | "scheduled") => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmUpdate: () => void;
  formatDateForDisplay: (date: string) => string;
}

interface AuthorNoteDialogProps extends DialogProps {
  isOpen: boolean;
  currentAuthorNote: string;
  handleAuthorNoteChange: (note: string) => void;
  handleSaveAuthorNote: () => void;
}

interface PricingDialogProps extends DialogProps {
  isOpen: boolean;
  isPaid: boolean;
  price: number;
  setIsPaid: (paid: boolean) => void;
  setPrice: (price: number) => void;
  handlePricingConfirm: () => void;
}

export const StatusDialog: React.FC<StatusDialogProps> = ({
  isOpen,
  t,
  onClose,
  newStatus,
  newDate,
  minDateTime,
  handleStatusChange,
  handleDateChange,
  handleConfirmUpdate,
  formatDateForDisplay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-600">
            {t("chapterList.updateStatus")}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <select
            value={newStatus}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as "draft" | "published" | "scheduled"
              )
            }
            className="w-full border rounded p-2 text-neutral-600 focus:outline-none"
          >
            <option value="draft">{t("chapterList.saveDraft")}</option>
            <option value="published">{t("chapterList.publishChapter")}</option>
            <option value="scheduled">
              {t("chapterList.schedulePublish")}
            </option>
          </select>
        </div>

        {newStatus === "scheduled" && (
          <div className="mb-4 relative">
            <input
              type="datetime-local"
              value={newDate ? newDate.slice(0, 16).replace(" ", "T") : ""}
              min={minDateTime}
              onChange={handleDateChange}
              className="w-full border rounded p-2 pl-8"
            />
            <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-2 top-2.5" />
          </div>
        )}
        {newStatus === "scheduled" && newDate && (
          <div className="mb-4 bg-gray-100 p-3 rounded-md">
            <p className="text-sm text-gray-600 whitespace-nowrap">
              发布时间：{formatDateForDisplay(newDate)}
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmUpdate}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
          >
            确认更新
          </button>
        </div>
      </div>
    </div>
  );
};

export const AuthorNoteDialog: React.FC<AuthorNoteDialogProps> = ({
  isOpen,
  onClose,
  currentAuthorNote,
  handleAuthorNoteChange,
  handleSaveAuthorNote
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <div className="mb-4">
          <AuthorNote
            authorNote={currentAuthorNote}
            onAuthorNoteChange={handleAuthorNoteChange}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            取消
          </button>
          <button
            onClick={handleSaveAuthorNote}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
          >
            保存留言
          </button>
        </div>
      </div>
    </div>
  );
};

export const PricingDialog: React.FC<PricingDialogProps> = ({
  isOpen,
  t,
  onClose,
  isPaid,
  price,
  setIsPaid,
  setPrice,
  handlePricingConfirm
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字
    if (value === "" || /^\d+$/.test(value)) {
      setPrice(value === "" ? 0 : parseInt(value, 10));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-600">
            {t("chapterList.pricingSetup")}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={!isPaid}
              onChange={() => setIsPaid(false)}
              className="form-radio"
            />
            <span>{t("chapterList.free")}</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              checked={isPaid}
              onChange={() => setIsPaid(true)}
              className="form-radio"
            />
            <span>{t("chapterList.pricingPaid")}</span>
          </label>
        </div>
        {isPaid && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("chapterList.priceLabel")}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={price || ""}
              onChange={handlePriceChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder={t("chapterList.pricePlaceholder")}
            />
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handlePricingConfirm}
            className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
          >
            {t("chapterList.confirmSetting")}
          </button>
        </div>
      </div>
    </div>
  );
};

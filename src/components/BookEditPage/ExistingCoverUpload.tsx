import React, { useState, useRef } from "react";
import { BookInfo, FileUploadData } from "@/app/lib/definitions";
import Alert from "../Main/Alert";
import { useTranslation } from "../useTranslation";

interface ExistingCoverUploadProps {
  currentCoverUrl: string;
  onCoverChange: (file: File, previewUrl: string) => void;
  onSubmit: () => Promise<boolean>; // 修改为返回 Promise<boolean>
}

const ExistingCoverUpload: React.FC<ExistingCoverUploadProps> = ({
  currentCoverUrl,
  onCoverChange,
  onSubmit
}) => {
  const { t } = useTranslation("bookedit");
  const [previewUrl, setPreviewUrl] = useState<string>(currentCoverUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      onCoverChange(file, newPreviewUrl);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      const success = await onSubmit();
      if (success) {
        setAlert({ message: t("coverUpload.updateSuccess"), type: "success" });
      } else {
        setAlert({ message: t("coverUpload.updateFail"), type: "error" });
      }
    } catch (error) {
      setAlert({ message: t("coverUpload.updateError"), type: "error" });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-start gap-10">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-80 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Book cover"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleEditClick}
            className="mt-4 px-4 py-2 bg-neutral-100  text-neutral-600 rounded hover:bg-neutral-300 focus:outline-none"
          >
            {t("coverUpload.changePhoto")}
          </button>
        </div>
        <div className=" px-10 h-56 py-3 leading-snug rounded-lg text-sm text-neutral-500">
          <h3 className="font-bold text-lg mb-2 text-neutral-600">
            {t("coverUpload.uploadGuide")}
          </h3>
          <ul className="space-y-1">
            <li>
              <span className="font-semibold">
                {t("coverUpload.recommendedSize")}
              </span>
              400 x 600 pixels
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.sizeRange")}
              </span>
              300 x 450 to 800 x 1200 pixels
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.maxFileSizeLabel")}
              </span>
              2 MB
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.recommendedFormatLabel")}
              </span>
              JPEG/JPG, PNG
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.aspectRatioLabel")}
              </span>
              2:3
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.layoutLabel")}
              </span>
              {t("coverUpload.layoutTipDetail")}
            </li>
          </ul>
          <p className="mt-2 text-xs text-neutral-500">
            {t("coverUpload.guidelineNoteDetail")}
          </p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={handleSubmit}
        className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {t("coverUpload.saveNewCover")}
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

export default ExistingCoverUpload;

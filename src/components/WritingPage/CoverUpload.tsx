"use client";
import React, { useRef, useCallback, useState } from "react";
import { BookInfo, FileUploadData } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径
import { useTranslation } from "../useTranslation";

interface CoverUploadProps {
  coverImage: FileUploadData["coverImage"];
  coverImageUrl: BookInfo["coverImageUrl"];
  onCoverChange: (file: File, url: string) => void;
}

const CoverUpload: React.FC<CoverUploadProps> = ({
  coverImage,
  coverImageUrl,
  onCoverChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("book");

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          setError(t("coverUpload.fileSizeError"));
          return;
        }
        setError(null);
        const newUrl = URL.createObjectURL(file);
        onCoverChange(file, newUrl);
      }
    },
    [onCoverChange]
  );

  return (
    <div className="space-y-4">
      <label
        htmlFor="cover-image"
        className="block text-2xl font-medium text-neutral-600"
      >
        {t("coverUpload.title")}
      </label>
      <div className="flex gap-10 ">
        <div>
          <div className="relative w-44 h-56 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
            {coverImage ? (
              <img
                src={
                  coverImageUrl ||
                  (coverImage instanceof File
                    ? URL.createObjectURL(coverImage)
                    : "")
                }
                alt="Book cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  {t("coverUpload.selectFile")}
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              id="cover-image"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {coverImage && (
            <button
              onClick={handleEditClick}
              className="mt-2 w-44 py-2 px-4 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              {t("coverUpload.editImage")}
            </button>
          )}
        </div>
        <div className="bg-gray-50 px-10 h-56 py-3 leading-snug rounded-lg shadow-md text-sm text-neutral-500">
          <h3 className="font-bold text-lg mb-2 text-neutral-600">
            {t("coverUpload.guideTitle")}
          </h3>
          <ul className="space-y-1">
            <li>
              <span className="font-semibold">
                {t("coverUpload.recommendedSize")}
              </span>{" "}
              400 x 600 pixels
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.sizeRange")}
              </span>{" "}
              300 x 450 to 800 x 1200 pixels
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.maxFileSize")}
              </span>{" "}
              2 MB
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.recommendedFormat")}
              </span>{" "}
              JPEG/JPG, PNG
            </li>
            <li>
              <span className="font-semibold">
                {t("coverUpload.aspectRatio")}
              </span>{" "}
              Maintain a 2:3 aspect ratio
            </li>
            <li>
              <span className="font-semibold">{t("coverUpload.layout")}</span>{" "}
              Place important visual elements in the center of the image
            </li>
          </ul>
          <p className="mt-2 text-xs text-neutral-500">
            {t("coverUpload.guideNote")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverUpload;

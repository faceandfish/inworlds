"use client";
import React, { useRef, useCallback, useState } from "react";
import { BookInfo, FileUploadData } from "@/app/lib/definitions";
import { useTranslation } from "../useTranslation";
import Image, { StaticImageData } from "next/image";
import cover1 from "../../../public/cover-1.jpg";
import cover2 from "../../../public/cover-2.jpg";
import cover3 from "../../../public/cover-3.jpg";
import cover4 from "../../../public/cover-4.jpg";

interface CoverUploadProps {
  coverImage: FileUploadData["coverImage"];
  coverImageUrl: BookInfo["coverImageUrl"];
  onCoverChange: (file: File | null, url: string) => void;
  bookTitle: string;
}

const defaultCovers: { src: StaticImageData; name: string }[] = [
  { src: cover1, name: "cover1.jpg" },
  { src: cover2, name: "cover2.jpg" },
  { src: cover3, name: "cover3.jpg" },
  { src: cover4, name: "cover4.jpg" }
];

const CoverUpload: React.FC<CoverUploadProps> = ({
  coverImage,
  coverImageUrl,
  onCoverChange,
  bookTitle
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDefaultCover, setSelectedDefaultCover] =
    useState<StaticImageData | null>(null);
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
        setSelectedDefaultCover(null);
        const newUrl = URL.createObjectURL(file);
        onCoverChange(file, newUrl);
      }
    },
    [onCoverChange, t]
  );

  const handleDefaultCoverSelect = (cover: {
    src: StaticImageData;
    name: string;
  }) => {
    setSelectedDefaultCover(cover.src);
    onCoverChange(null, cover.name);
  };

  const currentCoverUrl =
    selectedDefaultCover?.src ||
    (coverImageUrl &&
      defaultCovers.find((c) => c.name === coverImageUrl)?.src) ||
    coverImageUrl ||
    (coverImage instanceof File ? URL.createObjectURL(coverImage) : "");

  return (
    <div className="space-y-4">
      <label
        htmlFor="cover-image"
        className="block text-2xl font-medium text-neutral-600"
      >
        {t("coverUpload.title")}
      </label>
      <div className="flex flex-col md:flex-row gap-10">
        <div>
          <div className="relative w-44 h-56 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
            {currentCoverUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentCoverUrl}
                  alt="Book cover preview"
                  width={400}
                  height={600}
                  objectFit="cover"
                />
                <div className="absolute inset-x-0 top-1/3 transform -translate-y-1/2 flex items-center justify-center">
                  <p className="text-white text-center font-bold px-2 py-1 break-words  bg-black bg-opacity-50 rounded">
                    {bookTitle}
                  </p>
                </div>
              </div>
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

          {currentCoverUrl && (
            <button
              onClick={handleEditClick}
              className="mt-2 w-44 py-2 px-4 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              {t("coverUpload.editImage")}
            </button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row  gap-8">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2 text-neutral-600">
              {t("coverUpload.defaultCovers")}
            </h3>
            <div className="grid grid-cols-2 w-full gap-4">
              {defaultCovers.map((cover, index) => (
                <button
                  key={index}
                  onClick={() => handleDefaultCoverSelect(cover)}
                  className=" w-full aspect-[2/3] h-24 border-2 border-gray-300 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Image
                    src={cover.src}
                    width={400}
                    height={600}
                    objectFit="cover"
                    alt="Default cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md text-sm text-neutral-500">
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
            <p className="mt-2 text-xs">{t("coverUpload.guideNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverUpload;

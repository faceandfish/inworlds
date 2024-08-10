import React, { useRef, useCallback } from "react";
import { BookInfo } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径

interface CoverUploadProps {
  coverImage: BookInfo["coverImage"];
  coverImageUrl: BookInfo["coverImageUrl"];
  onCoverChange: (file: File | null, url: string | null) => void;
  error?: string;
}

const CoverUpload: React.FC<CoverUploadProps> = ({
  coverImage,
  coverImageUrl,
  onCoverChange,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
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
        className="block text-2xl font-medium text-gray-700"
      >
        封面图片
      </label>
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
              选择文件
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
      </div>
      {coverImage && (
        <button
          onClick={handleEditClick}
          className="mt-2 w-44 py-2 px-4 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
        >
          修改图片
        </button>
      )}
    </div>
  );
};

export default CoverUpload;

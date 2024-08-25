"use client";
import React, { useRef, useCallback, useState } from "react";
import { BookInfo, FileUploadData } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径

interface CoverUploadProps {
  coverImage: FileUploadData["coverImage"];
  coverImageUrl: BookInfo["coverImageUrl"];
  onCoverChange: (file: File | null, url: string | null) => void;
}

const CoverUpload: React.FC<CoverUploadProps> = ({
  coverImage,
  coverImageUrl,
  onCoverChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          setError(
            "文件大小不能超过 2 MB。请选择一个较小的文件或压缩当前文件。"
          );
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
        封面图片
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
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
        <div className="bg-gray-50 px-10 h-56 py-3 leading-snug rounded-lg shadow-md text-sm text-neutral-500">
          <h3 className="font-bold text-lg mb-2 text-neutral-600">
            书籍封面上传指南
          </h3>
          <ul className="space-y-1">
            <li>
              <span className="font-semibold">推荐尺寸：</span>400 x 600 像素
            </li>
            <li>
              <span className="font-semibold">尺寸范围：</span>300 x 450 至 800
              x 1200 像素
            </li>
            <li>
              <span className="font-semibold">最大文件大小：</span>2 MB
            </li>
            <li>
              <span className="font-semibold">推荐格式：</span>JPEG/JPG, PNG
            </li>
            <li>
              <span className="font-semibold">比例：</span>保持 2:3 的宽高比
            </li>
            <li>
              <span className="font-semibold">布局：</span>
              重要视觉元素请置于图片中心
            </li>
          </ul>
          <p className="mt-2 text-xs text-neutral-500">
            遵循这些指南将帮助您的书籍封面在我们的平台上获得最佳展示效果。
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverUpload;

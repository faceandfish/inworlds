"use client";
import { BookInfo } from "@/app/lib/definitions";

import React, { useState, ChangeEvent, useRef } from "react";

const BookCoverUploadForm: React.FC = () => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bookInfo, setBookInfo] = useState<
    Omit<BookInfo, "onSaveDraft" | "onPublish" | "updateSectionContent">
  >({
    id: 0, // 或者使用一个适当的初始 ID
    title: "",
    description: "",
    category: "female-story",
    ageRating: "under18",
    coverImage: null,
    content: "",
    wordCount: 0,
    lastSaved: new Date().toISOString(),
  });
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setBookInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setCoverImage(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", bookInfo);
    // Add your API call here to upload the image and other book info
  };

  return (
    <form onSubmit={handleSubmit} className="px-20">
      <div className=" flex flex-wrap items-start">
        <div className="space-y-4 w-1/2">
          <label
            htmlFor="cover-image"
            className="block text-2xl font-medium text-gray-700"
          >
            封面圖片
          </label>
          <div className="relative w-44 h-56 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
            {coverImage ? (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Book cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  選擇文件
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
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                已选择文件: {coverImage.name}
              </p>
            </div>
          )}
          {coverImage && (
            <button
              onClick={handleEditClick}
              className="mt-2 w-44 py-2 px-4 border border-orange-500 text-orange-500 rounded-md shadow-sm text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              修改图片
            </button>
          )}
        </div>
        <div className="space-y-5 w-1/2 ">
          <label
            htmlFor="book-category"
            className="block text-2xl font-medium text-gray-700 mb-1"
          >
            書籍頻道分類
          </label>
          <select
            id="book-category"
            name="category"
            value={bookInfo.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 ease-in-out"
          >
            <option value="female-story">女性故事</option>
            <option value="male-story">男性故事</option>
            <option value="children-story">兒童故事</option>
            <option value="literature-story">文學故事</option>
            <option value="biography">自傳紀實</option>
          </select>
        </div>

        <div className="w-full mt-16">
          <p className="block text-2xl font-medium text-gray-700 mb-2">
            作品分级
          </p>
          <p className="text-sm text-gray-600 pb-3 border-b border-b-gray-200">
            根据法律要求，无论你身在何处，都必须遵守《儿童在线隐私保护法》(COPPA)
            和/或其他法律。你必须指明自己的视频是否为面向儿童的内容。
          </p>
          <div className="space-y-5 mt-5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="ageRating"
                value="under18"
                checked={bookInfo.ageRating === "under18"}
                onChange={handleInputChange}
                className="custom-radio"
              />
              <span className="text-xl text-gray-700">
                是，内容是面向儿童的（未成年）
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="ageRating"
                value="allAges"
                checked={bookInfo.ageRating === "allAges"}
                onChange={handleInputChange}
                className="custom-radio"
              />
              <span className="text-xl text-gray-700">
                是，内容是面向全年龄的（不含18R内容）
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="ageRating"
                value="adult"
                checked={bookInfo.ageRating === "adult"}
                onChange={handleInputChange}
                className="custom-radio"
              />
              <span className="text-xl text-gray-700">
                是，内容是面向成人的（含有血腥，暴力，色情等内容）
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookCoverUploadForm;

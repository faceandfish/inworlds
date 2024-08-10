"use client";

import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { BookInfo } from "@/app/lib/definitions"; // 假设这是你的 definitions 文件的路径

interface AgeRatingProps {
  value: BookInfo["ageRating"];
  onChange: (newValue: BookInfo["ageRating"]) => void;
  error?: string;
}

const AgeRating: React.FC<AgeRatingProps> = ({ value, onChange, error }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as BookInfo["ageRating"]);
  };

  return (
    <div className="w-full mt-10 space-y-6">
      <h2 className="text-2xl font-medium text-gray-700 ">内容分级</h2>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              法律提醒：内容创作者有责任根据国际标准和当地法规对其作品进行适当的年龄分级。
            </p>
            <p className="text-sm text-yellow-700">
              请仔细选择适合您作品的分级类别
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="under18"
            checked={value === "under18"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">
              青少年读物
            </span>
            <p className="text-sm text-gray-500 mt-1">
              适合18岁以下读者。内容应该是积极向上、富有教育意义的，不包含暴力、性或其他成人主题。符合国际儿童内容保护标准，如COPPA（儿童在线隐私保护法）。
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="allAges"
            checked={value === "allAges"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">
              全年龄读物
            </span>
            <p className="text-sm text-gray-500 mt-1">
              适合所有年龄段的读者。可能包含一些轻微的暴力、短暂的粗口或轻微的性暗示，但不会有详细或密集的呈现。相当于电影分级中的PG或PG-13级别。遵守公众内容的一般指导原则。
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="ageRating"
            value="adult"
            checked={value === "adult"}
            onChange={handleInputChange}
            className="mt-1"
          />
          <div>
            <span className="text-lg font-medium text-gray-700">成人内容</span>
            <p className="text-sm text-gray-500 mt-1">
              仅适合成年读者（18岁以上）。可能包含明确的暴力描写、性内容、粗俗语言或争议性主题。必须遵守成人内容的法律标准，包括日本的《青少年安全网络环境营造法》。此类内容需要特别的警告和访问限制。
            </p>
          </div>
        </label>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>
          请注意：选择不当的内容分级可能导致您的作品被下架或账号被处罚。如果您不确定应该选择哪个分级，请选择较高的分级类别。
        </p>
      </div>
    </div>
  );
};

export default AgeRating;

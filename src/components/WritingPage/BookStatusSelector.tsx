import React from "react";
import { BookInfo } from "@/app/lib/definitions";

interface BookStatusSelectorProps {
  status: BookInfo["status"];
  onStatusChange: (status: BookInfo["status"]) => void;
  error?: string;
}

const BookStatusSelector: React.FC<BookStatusSelectorProps> = ({
  status,
  onStatusChange,
  error
}) => {
  return (
    <div className="flex flex-col space-y-6 ">
      <label className="text-2xl font-medium text-gray-700">作品状态</label>
      <p className="text-sm bg-yellow-50 border-l-4 border-yellow-400  p-2  text-yellow-700">
        提示：连载中，表示作品正在创作过程中，可以持续更新；已完结，表示作品已经完成，不再更新内容。
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
          <span className="ml-2">连载中</span>
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
          <span className="ml-2">已完结</span>
        </label>
      </div>
    </div>
  );
};

export default BookStatusSelector;

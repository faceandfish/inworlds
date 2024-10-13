import React from "react";

const ChapterEditSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto bg-white px-20 py-20 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-64 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default ChapterEditSkeleton;

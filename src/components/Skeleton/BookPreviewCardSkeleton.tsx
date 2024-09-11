// BookPreviewCardSkeleton.tsx
import React from "react";

const SingleCardSkeleton = () => (
  <div className="w-80 h-48 flex bg-gray-100 rounded">
    <div className="w-36 h-46 bg-gray-200 animate-pulse"></div>
    <div className="flex flex-col justify-around flex-1 p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    </div>
  </div>
);

const BookPreviewCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
    {[...Array(9)].map((_, index) => (
      <SingleCardSkeleton key={index} />
    ))}
  </div>
);

export default BookPreviewCardSkeleton;

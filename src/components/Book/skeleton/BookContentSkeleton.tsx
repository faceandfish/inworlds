import React from "react";

const BookContentSkeleton = () => (
  <div className="mt-6 md:mt-10">
    {/* Tabs skeleton */}
    <div className="flex gap-2 md:gap-4 border-b border-gray-200">
      <div className="h-8 w-20 md:w-24 bg-gray-200 rounded"></div>
      <div className="h-8 w-20 md:w-24 bg-gray-200 rounded"></div>
    </div>

    {/* Content skeleton */}
    <div className="mt-4 md:mt-5">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="h-12 md:h-16 w-full bg-gray-200 rounded mb-3 md:mb-4"
        ></div>
      ))}
    </div>
  </div>
);

export default BookContentSkeleton;

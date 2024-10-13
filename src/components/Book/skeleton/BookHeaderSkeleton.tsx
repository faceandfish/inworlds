import React from "react";

const BookHeaderSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between mt-6 md:mt-10 w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        {/* Book cover skeleton */}
        <div className="w-32 h-40 md:w-44 md:h-56 bg-gray-200 rounded-xl mx-auto md:mx-0"></div>

        {/* Book info skeleton */}
        <div className="flex flex-col justify-around mt-4 md:mt-0">
          <div className="h-6 md:h-8 w-48 md:w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 md:w-40 bg-gray-200 rounded mt-2 md:mt-0"></div>
          <div className="h-4 w-40 md:w-56 bg-gray-200 rounded mt-2 md:mt-0"></div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="h-8 md:h-10 w-20 md:w-24 bg-gray-200 rounded"></div>
            <div className="h-8 md:h-10 w-20 md:w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* AuthorInfo skeleton */}
      <div className="w-full md:w-80 md:border-l border-gray-100 flex flex-col items-center justify-around mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-28 md:w-32 bg-gray-200 rounded mt-4 md:mt-0"></div>
        <div className="h-4 w-40 md:w-48 bg-gray-200 rounded mt-2 md:mt-0"></div>
        <div className="h-8 w-36 md:w-40 bg-gray-200 rounded mt-4 md:mt-0"></div>
      </div>
    </div>
  );
};

export default BookHeaderSkeleton;

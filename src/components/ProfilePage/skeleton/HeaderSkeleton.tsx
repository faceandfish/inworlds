import React from "react";

const HeaderSkeleton: React.FC = () => {
  return (
    <div className="max-w-full mx-auto animate-pulse">
      <div className="bg-white border border-b-gray-200 overflow-hidden">
        <div className="relative h-48 bg-gray-200">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="rounded-full w-40 h-40 bg-gray-300 border-4 border-white shadow-md"></div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-4 md:px-8 text-center">
          <div className="h-8 bg-gray-300 w-48 mx-auto mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 max-w-md mx-auto mb-6 rounded"></div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="h-8 w-16 bg-gray-300 mb-1 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="text-center">
              <div className="h-8 w-16 bg-gray-300 mb-1 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="text-center">
              <div className="h-8 w-16 bg-gray-300 mb-1 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="mt-4 h-10 w-24 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;

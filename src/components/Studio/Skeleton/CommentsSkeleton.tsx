import React from "react";

const ITEMS_PER_PAGE = 10;

const CommentsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <ul className="divide-y divide-gray-200">
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
          <li key={index} className="flex py-5">
            <div className="w-2/3 flex">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="flex space-x-10 mt-4">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
            <div className="w-1/3 flex items-center gap-10">
              <div className="w-16 h-20 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </li>
        ))}
      </ul>
      <div className="my-20 flex justify-center">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
      </div>
    </div>
  );
};

export default CommentsSkeleton;

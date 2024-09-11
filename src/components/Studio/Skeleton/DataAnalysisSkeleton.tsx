import React from "react";

const DataAnalysisSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen w-full mx-auto px-10 animate-pulse">
      <div className="bg-white py-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-7 bg-gray-100 h-10 mb-4"></div>
        <ul className="h-64">
          {[...Array(5)].map((_, index) => (
            <li
              key={index}
              className="grid grid-cols-7 py-3 px-3 border-b border-gray-100"
            >
              <div className="col-span-3 h-6 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded mx-auto w-1/2"></div>
              <div className="col-span-1 h-6 bg-gray-200 rounded mx-auto w-1/2"></div>
              <div className="col-span-2 h-6 bg-gray-200 rounded mx-auto w-3/4"></div>
            </li>
          ))}
        </ul>
        <div className="pt-10 flex justify-center">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      <div className="bg-white py-10 mt-10">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-10"></div>
        <div className="grid grid-cols-2 gap-6 px-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisSkeleton;

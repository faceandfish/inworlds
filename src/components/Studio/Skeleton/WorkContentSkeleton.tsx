import React from "react";

const WorkContentSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-10 animate-pulse">
      {/* Tabs Skeleton */}
      <ul className="flex text-lg border-b">
        {["已发布内容", "正在连载中", "已完结", "草稿箱"].map(
          (tabName, index) => (
            <li
              key={index}
              className={`px-6 py-3 ${
                index === 0 ? "border-b-2 border-gray-200" : ""
              }`}
            >
              <div
                className="h-6 bg-gray-200 rounded"
                style={{ width: `${tabName.length * 16}px` }}
              ></div>
            </li>
          )
        )}
      </ul>

      <div className="mt-6">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-8 text-neutral-600 bg-neutral-50 font-semibold">
          <div className="p-3 col-span-3">
            <div className="h-6 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="p-3 text-center col-span-1">
            <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="p-3 text-center col-span-2">
            <div className="h-6 w-24 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="p-3 text-center col-span-2">
            <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>

        {/* Book List Skeleton */}
        <ul>
          {[1, 2, 3, 4, 5].map((index) => (
            <li
              key={index}
              className="grid grid-cols-8 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150"
            >
              <div className="col-span-6 grid grid-cols-6 items-center py-3 px-3">
                <div className="col-span-3 font-medium">
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="col-span-1 text-center mx-5">
                  <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="col-span-2 text-center space-x-10">
                <div className="h-4 w-8 bg-gray-200 rounded-full inline-block"></div>
                <div className="h-4 w-8 bg-gray-200 rounded-full inline-block"></div>
                <div className="h-4 w-8 bg-gray-200 rounded-full inline-block"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-10 w-24 bg-gray-200 rounded mt-6"></div>
    </div>
  );
};

export default WorkContentSkeleton;

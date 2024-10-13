import React from "react";

const AuthorInfoSkeleton = () => (
  <div className="hidden md:flex w-full md:w-80 md:border-l border-gray-100  flex-col items-center justify-around py-4 md:py-0">
    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full"></div>
    <div className="h-4 w-28 md:w-32 bg-gray-200 rounded mt-4 md:mt-0"></div>
    <div className="h-4 w-40 md:w-48 bg-gray-200 rounded mt-2 md:mt-0"></div>
    <div className="h-8 w-36 md:w-40 bg-gray-200 rounded mt-4 md:mt-0"></div>
  </div>
);

export default AuthorInfoSkeleton;

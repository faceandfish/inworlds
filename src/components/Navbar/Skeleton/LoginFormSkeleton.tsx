import React from "react";

const LoginFormSkeleton: React.FC = () => (
  <div className="animate-pulse w-full md:w-90 ">
    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
    <div className="space-y-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
    <div className="mt-3 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
  </div>
);

export default LoginFormSkeleton;

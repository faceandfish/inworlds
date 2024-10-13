import React from "react";

const UserMenuSkeleton: React.FC = () => (
  <div className="flex justify-center items-center gap-4 md:gap-10 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-full hidden md:block"></div>
    <div className="w-8 h-8 bg-gray-200 rounded-full hidden md:block"></div>
    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
  </div>
);

export default UserMenuSkeleton;

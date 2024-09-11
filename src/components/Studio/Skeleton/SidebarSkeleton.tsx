import React from "react";

const SidebarSkeleton: React.FC = () => {
  return (
    <nav className="w-64 bg-white pt-10 animate-pulse">
      <div className="mb-5 flex gap-5 flex-col items-center">
        <div className="rounded-full bg-gray-200 w-24 h-24" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
      <ul className="space-y-2 ml-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 px-6 py-3 cursor-pointer"
          >
            <div className="rounded-full bg-gray-200 w-6 h-6" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarSkeleton;

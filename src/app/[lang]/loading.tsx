import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center md:bg-gradient-to-r md:from-orange-100 md:to-orange-200 z-50">
      <div className="w-32 h-32 rounded-full bg-orange-500 animate-pulse flex items-center justify-center">
        <span className="text-white text-xl font-bold">loading</span>
      </div>
    </div>
  );
}

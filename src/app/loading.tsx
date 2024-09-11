import React from "react";

const GlobalLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 z-50">
      <div className="relative">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin`}
            style={{
              animationDuration: `${1 + index * 0.2}s`,
              animationDirection: index % 2 === 0 ? "normal" : "reverse",
              width: `${100 + index * 30}px`,
              height: `${100 + index * 30}px`
            }}
          ></div>
        ))}
        <div className="w-32 h-32 rounded-full bg-orange-500 animate-pulse flex items-center justify-center">
          <span className="text-white text-xl font-bold">加载中</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;

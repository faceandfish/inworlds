import React from "react";

const WalletSkeleton: React.FC = () => {
  return (
    <div className="mx-auto px-4 md:px-20 py-10 animate-pulse">
      <div className="flex flex-col gap-6 md:gap-10 md:flex-row md:space-x-4">
        <div className="w-full md:w-1/2">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

          {/* Balance Display */}
          <div className="bg-orange-100 p-4 rounded-lg mb-4 shadow">
            <div className="h-6 bg-orange-200 rounded w-3/4"></div>
          </div>

          {/* Purchase Options */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-orange-200 rounded w-full"></div>
                </div>
              ))}
            </div>

            {/* Donation Tip */}
            <div className="bg-orange-100 p-4 rounded-lg shadow">
              <div className="h-6 bg-orange-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-orange-200 rounded w-full"></div>
              <div className="h-4 bg-orange-200 rounded w-3/4 mt-2"></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          {/* History Tables */}
          {[1, 2].map((i) => (
            <div key={i} className="mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-10 bg-orange-100"></div>
                <div className="max-h-[400px] overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="h-12 bg-white border-t border-orange-100"
                    ></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-100 border-t border-orange-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSkeleton;

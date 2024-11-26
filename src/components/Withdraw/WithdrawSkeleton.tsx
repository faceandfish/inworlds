import React from "react";

const WithdrawSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Title Skeleton */}
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="mt-2 h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Main Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {/* Balance Card Skeleton */}
            <div className="p-6">
              <div className="h-24 bg-gray-100 rounded-lg animate-pulse">
                <div className="p-4">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Amount Input Skeleton */}
            <div className="p-6">
              <div className="h-4 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Bank Card Section Skeleton */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="p-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Notice Section Skeleton */}
            <div className="p-6 bg-gray-50">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSkeleton;

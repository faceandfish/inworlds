import React from "react";

const BookDescriptionSkeleton = () => (
  <div className="w-full h-24 md:h-32 my-8 md:my-16">
    <div className="h-5 md:h-6 w-32 md:w-40 bg-gray-200 rounded mb-2"></div>
    <div className="h-3 md:h-4 w-full bg-gray-200 rounded mt-2"></div>
    <div className="h-3 md:h-4 w-3/4 bg-gray-200 rounded mt-2"></div>
  </div>
);

export default BookDescriptionSkeleton;

const WorksSectionSkeleton: React.FC = () => {
  return (
    <div className="pt-6 md:pt-10 px-4 md:px-20 flex flex-col md:flex-row bg-neutral-50 gap-6 md:gap-10 animate-pulse">
      <div className="w-full md:w-2/3">
        {/* Ongoing Books Skeleton */}
        <div className="mb-6 md:mb-10 p-4 md:p-5 bg-white shadow rounded-xl">
          <div className="h-6 w-32 bg-gray-300 mb-4 rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 mb-8 rounded"></div>
          ))}
        </div>
      </div>
      {/* SponsorList Skeleton */}
      <div className="hidden md:block w-full md:w-1/3">
        <div className="bg-white shadow p-4 md:p-5 rounded-xl">
          <div className="h-6 w-32 bg-gray-300 mb-4 rounded"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorksSectionSkeleton;

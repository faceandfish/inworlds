// TitleSkeleton.tsx
export const TitleSkeleton = () => {
  return <div className="hidden md:block h-8 w-48 bg-gray-200 rounded" />;
};

// SidebarSkeleton.tsx
export const SidebarSkeleton = () => {
  return (
    <div className="bg-orange-50 p-4 h-full md:fixed md:top-16 md:w-64">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
};

// MessagesSkeleton.tsx 保持原样
export const MessagesSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg"
        >
          <div className="w-20 h-20 bg-gray-200 rounded" />
          <div className="flex-grow">
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

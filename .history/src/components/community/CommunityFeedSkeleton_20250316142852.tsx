export default function CommunityFeedSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-12 bg-gray-200 rounded animate-pulse mb-8"></div>

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="bg-gray-100 rounded-lg p-6 h-64 animate-pulse"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between mt-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
import React from "react";

const PageSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-white animate-pulse">

      {/* Navbar Skeleton */}
      <div className="h-16 w-full bg-gray-200 shadow-sm"></div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div className="h-10 w-40 bg-gray-300 rounded"></div>
        </div>

        <div className="w-full lg:w-1/2 h-64 lg:h-80 bg-gray-300 rounded-xl"></div>
      </div>

      {/* Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 space-y-6 py-10">
        <div className="h-6 w-1/3 bg-gray-300 rounded mx-auto"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

    </div>
  );
};

export default PageSkeleton;
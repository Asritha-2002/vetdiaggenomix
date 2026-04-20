const SpecialServicesSkeleton = () => {
  return (
    <div className="w-full py-8 px-4 animate-pulse">
      
      {/* Heading */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-8 w-48 bg-gray-300 rounded"></div>
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
      </div>

      <div className="h-6 w-72 bg-gray-300 mx-auto mb-8 rounded"></div>

      {/* Cards Skeleton */}
      <div className="max-w-8xl mx-auto flex flex-wrap justify-center gap-6">
        {[1,2,3,4,5,6].map((item) => (
          <div
            key={item}
            className="w-[300px] bg-white rounded-xl shadow-md p-4"
          >
            {/* Image */}
            <div className="w-full h-[180px] bg-gray-300 rounded-lg mb-4"></div>

            {/* Title */}
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>

            {/* Description lines */}
            <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SpecialServicesSkeleton
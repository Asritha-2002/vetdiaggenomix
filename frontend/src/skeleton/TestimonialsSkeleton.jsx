const TestimonialsSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg animate-pulse">

      {/* USER */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>

        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
          <div className="h-2 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* REVIEW TEXT */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>

      {/* STARS */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
};


export default TestimonialsSkeleton;
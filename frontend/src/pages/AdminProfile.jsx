import { FaExclamationTriangle } from "react-icons/fa";

const AdminProfile = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] relative">
     

      {/* Center Content */}
      <div className="text-center z-10">
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Unable to Load Dashboard
        </h2>

        <p className="text-gray-500 mb-6">
          Failed to fetch dashboard statistics
        </p>

        <button
          className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
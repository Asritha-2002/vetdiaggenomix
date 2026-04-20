import { FaBars, FaSignOutAlt, FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <>
      {/* ✅ HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 shadow border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* Mobile Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
            >
              <FaBars className="text-sm" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
              <FaSearch className="text-gray-400 mr-3 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                disabled
                className="bg-transparent outline-none text-gray-700 placeholder-gray-400 w-64"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* 👤 Profile (NO background wrapper like yours) */}
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
              
              {/* Icon instead of "A" */}
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>

              <div className="hidden sm:block">
                <p className="font-semibold text-gray-700 text-sm">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            {/* 🚪 Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center 
                         hover:bg-white/70 transition-colors border border-gray-300"
            >
              <FaSignOutAlt className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* ✅ LOGOUT MODAL (same as before - already good UI) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 
                          bg-white/80 backdrop-blur-xl animate-scaleIn">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <FaSignOutAlt className="text-white text-lg" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Logout Confirmation
                </h2>
                <p className="text-sm text-gray-500">
                  Please confirm your action
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-gray-600">
              Are you sure you want to logout from your admin account?
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-200">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl text-white font-medium 
                           bg-gradient-to-r from-blue-500 to-purple-600 
                           hover:from-blue-600 hover:to-purple-700 
                           transition-all transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
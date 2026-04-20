import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingCart, Calendar, Mail, Package, CalendarCheck } from "lucide-react";

export default function UserDetailModal({ user, open, onClose }) {
  if (!open || !user) return null;
  const navigate = useNavigate();
 
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 
                              rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 
                         flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Package className="w-4 h-4" />
                Total Orders
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {user.orderCount || 0}
              </p>
            </div>
             <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Calendar className="w-4 h-4" />
                Total Appointment
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {user.appointmentCount || 0}
              </p>
            </div>

            {/* <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Calendar className="w-4 h-4" />
                Join Date
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div> */}

          </div>

          {/* Status */}
          {/* <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <span className="text-gray-500 font-medium">Status</span>
            <span
              className={`font-semibold ${
                user.isActive ? "text-green-600" : "text-red-500"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div> */}

          {/* Button */}
         {user.orderCount > 0 && (
  <button
    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 
               hover:from-indigo-600 hover:to-purple-700
               text-white py-3 rounded-2xl font-semibold 
               flex items-center justify-center gap-2 
               transition-all shadow-md shadow-indigo-100 cursor-pointer"
  >
    <ShoppingCart className="w-4 h-4" />
    View Orders
  </button>
)}

{user.appointmentCount > 0 && (
  <button
  onClick={() => navigate(`/admin/appointments?userId=${user._id}`)}
    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 
               hover:from-indigo-600 hover:to-purple-700
               text-white py-3 rounded-2xl font-semibold 
               flex items-center justify-center gap-2 
               transition-all shadow-md shadow-indigo-100 cursor-pointer"
  >
    <CalendarCheck className="w-4 h-4" />
    View Appontments
  </button>
)}

        </div>

      </div>
    </div>
  );
}
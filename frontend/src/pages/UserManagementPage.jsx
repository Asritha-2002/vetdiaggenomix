import React, { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { FaUsers, FaExclamationTriangle } from "react-icons/fa";
import StatsCard from "../components/users/StarsCard";
import UserSearchBar from "../components/users/UserSearchBar";
import {  ShoppingCart, Eye } from "lucide-react";
import UserDetailModal from "../components/users/UserDetailModal";
import {CalendarCheck } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // 🔥 Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      const normalized = data.map((u) => ({
  ...u,
  orderCount: Number(u.orderCount) || 0,
  appointmentCount: Number(u.appointmentCount) || 0
}));
      setUsers(normalized);
    //console.log(normalized);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const [search, setSearch] = useState("");
const [filter, setFilter] = useState("");

const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    !filter ||
    (filter === "active" && user.isActive) ||
    (filter === "inactive" && !user.isActive);

  const isNotAdmin = !user.isAdmin;

  return matchesSearch && matchesStatus && isNotAdmin;
});

  // ✅ Stats
 const normalUsers = users.filter((u) => !u.isAdmin);

const totalUsers = normalUsers.length;

const activeUsers = normalUsers.filter((u) => u.isActive).length;
  const withOrders = users.filter((u) => u.orderCount > 0).length;
  const withAppointments = users.reduce(
  (sum, u) => sum + (Number(u.appointmentCount) || 0),
  0
);

  const [selectedUser, setSelectedUser] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const handleViewDetails = (user) => {
  setSelectedUser(user);
  setModalOpen(true);
};

  // =============================
  // ⏳ LOADING UI
  // =============================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // =============================
  // ❌ ERROR UI
  // =============================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Users
          </h2>

          <p className="text-gray-500 mb-6">{error}</p>

          <button
            onClick={fetchUsers}
            className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =============================
  // ✅ SUCCESS UI
  // =============================
  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="w-full px-6 py-4 space-y-8">

        {/* Header Section */}
        <div className="rounded-3xl p-8 bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FaUsers className="text-white text-2xl" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage registered users and their activities
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              <StatsCard
                value={totalUsers}
                label="Total Users"
                gradient="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-700"
              />
              <StatsCard
                value={activeUsers}
                label="Active Users"
                gradient="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-700"
              />
              <StatsCard
                value={withOrders}
                label="With Orders"
                gradient="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-purple-700"
              />
              <StatsCard
  value={withAppointments}
  label="Appointments"
  gradient="bg-gradient-to-br from-indigo-50 to-teal-100 border border-indigo-200 text-indigo-700"
/>
            </div>
          </div>
        </div>
        <div>
            <UserSearchBar
  search={search}
  setSearch={setSearch}
  filter={filter}
  setFilter={setFilter}
  onExport={() => console.log("Export clicked")}
/>
        </div>

{/* Users List */}
<div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.25 }}
  className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/30 shadow-sm overflow-hidden"
>
  <div className="p-6">

    {filteredUsers.length === 0 ? (
      <div className="text-center py-16">
        
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          No users found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter
        </p>
      </div>
    ) : (
      
      <div className="grid grid-cols-1 grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">

        {filteredUsers.map((user, index) => (
          <div
            key={user._id}
            className="bg-white/70 backdrop-blur-md border border-white/40 
                       rounded-2xl p-5 shadow-sm hover:shadow-md 
                       transition-all duration-300 hover:-translate-y-1"
          >

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                              flex items-center justify-center text-white font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Orders</span>
                <span className="font-semibold text-indigo-600">
                  {user.orderCount || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Appointments</span>
                <span className="font-semibold text-indigo-600">
                  {user.appointmentCount || 0}
                </span>
              </div>

              <div className="flex justify-between text-sm">
  <span className="text-gray-400">Joined</span>
  <span className="font-semibold">
    {new Date(user.createdAt).toLocaleDateString()}
  </span>
</div>
            </div>

            {/* Button */}
            <div className="flex items-center gap-2">
  <button
    onClick={() => handleViewDetails(user)}
    className={`bg-indigo-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer ${
      user.orderCount > 0 ? "px-4 flex-1" : "w-full"
    }`}
  >
    <Eye className="w-4 h-4" />
    View Details
  </button>

  {user.orderCount > 0 && (
    <button
      className="bg-indigo-500 text-white p-2 rounded-xl flex items-center justify-center"
    >
      <ShoppingCart className="w-6 h-6" />
    </button>
  )}
  {user.appointmentCount > 0 && (
  <button
    className="bg-indigo-500 text-white p-2 rounded-xl flex items-center justify-center"
  >
    <CalendarCheck className="w-6 h-6" />
  </button>
)}
</div>

          </div>
        ))}

      </div>
    )}

  </div>
  
</div>
<UserDetailModal
  user={selectedUser}
  open={modalOpen}
  onClose={() => setModalOpen(false)}
/>

      </div>
    </div>
  );
}
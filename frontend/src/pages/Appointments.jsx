import React, { useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";
import AppointmentDetailDrawer from "../components/appointments/AppointmentDetailDrawer";
import AppointmentStatsCards from "../components/appointments/AppointmentStatsCards";
import AppointmentFilters from "../components/appointments/AppointmentFilters";
import AppointmentTable from "../components/appointments/AppointmentTable";
import OrderPagination from "../components/appointments/OrderPagination";
import { Calendar } from "lucide-react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
const userIdFromURL = queryParams.get("userId");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH APPOINTMENTS =================
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.log("Error fetching appointments:", err);
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= VIEW DETAILS =================
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedUser(appointment.user || null);

    if (appointment.review) {
      setReviews([appointment.review]);
    } else {
      setReviews([]);
    }
  };

  const closeDrawer = () => {
    setSelectedAppointment(null);
    setSelectedUser(null);
    setReviews([]);
  };

  // ================= FILTER STATES =================
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

 const filteredAppointments = appointments.filter((appt) => {
  const matchesSearch =
    appt.name.toLowerCase().includes(search.toLowerCase()) ||
    appt.email.toLowerCase().includes(search.toLowerCase()) ||
    appt.service.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || appt.status === statusFilter;

  const matchesLocation =
    locationFilter === "all" || appt.location === locationFilter;

  const matchesUser =
    !userIdFromURL || appt.userId === userIdFromURL;

  return matchesSearch && matchesStatus && matchesLocation && matchesUser;
});

  const locations = [...new Set(appointments.map((a) => a.location))];

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, locationFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex
  );
useEffect(() => {
  if (userIdFromURL && appointments.length > 0) {
    const userAppointments = appointments.filter(
      (appt) => appt.userId === userIdFromURL
    );

    if (userAppointments.length > 0) {
      // open first appointment (or latest)
      handleViewAppointment(userAppointments[0]);
    }
  }
}, [userIdFromURL, appointments]);
  // ================= LOADING UI =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR UI =================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
            <FaExclamationTriangle className="text-red-500 text-3xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unable to Load Appointments
          </h2>

          <p className="text-gray-500 mb-6">{error}</p>

          <button
            onClick={fetchAppointments}
            className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-background font-inter">

      {/* HEADER */}
      <div className="shadow-lg bg-white rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Appointments
              </h1>
              <p className="text-sm text-gray-500">
                Manage and monitor all scheduled appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* STATS */}
        <AppointmentStatsCards appointments={filteredAppointments} />

        {/* FILTERS */}
        <AppointmentFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          locations={locations}
        />

        {/* SHOWING + ITEMS PER PAGE */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredAppointments.length === 0 ? 0 : startIndex + 1}
            </span>
            –
            <span className="font-semibold text-gray-800">
              {Math.min(endIndex, filteredAppointments.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {filteredAppointments.length}
            </span>{" "}
            appointments
          </p>

          <select
  value={itemsPerPage}
  onChange={(e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }}
  className="shadow-md bg-white focus:outline-none rounded-lg px-3 py-1 text-sm border border-gray-200 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 cursor-pointer transition appearance-none"
  style={{
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M5 7l5 5 5-5H5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
    backgroundSize: "16px",
    paddingRight: "28px"
  }}
>
  <option value={5} className="bg-white text-gray-700">
    Show 5
  </option>
  <option value={10} className="bg-white text-gray-700">
    Show 10
  </option>
  <option value={20} className="bg-white text-gray-700">
    Show 20
  </option>
</select>
        </div>

        {/* TABLE */}
        <AppointmentTable
          appointments={paginatedAppointments}
          onView={handleViewAppointment}
        />

        {/* PAGINATION */}
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={filteredAppointments.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* DRAWER */}
      <AppointmentDetailDrawer
        appointment={selectedAppointment}
        user={selectedUser}
        reviews={reviews}
        onClose={closeDrawer}
      />
    </div>
  );
}
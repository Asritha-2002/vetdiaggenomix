import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Ticket, X } from "lucide-react";
import VoucherForm from "../components/vouchers/VoucherForm";
import VoucherStatsCards from "../components/vouchers/VoucherStatsCards";
import VoucherFilters from "../components/vouchers/VoucherFilters";
import VoucherTable from "../components/vouchers/VoucherTable";
import OrderPagination from "../components/appointments/OrderPagination";
import DeleteConfirmDialog from "../components/vouchers/DeleteConfirmDialog";
import axios from "axios";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

/* ================= SIMPLE BUTTON ================= */
function Button({ label, icon: Icon, variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md transition px-4 py-2 h-10";

  const styles = {
    default: "bg-purple-500 text-white hover:bg-purple-600 shadow cursor-pointer",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer",
  };

  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function Voucher() {
  const [openForm, setOpenForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH VOUCHERS ================= */
 const fetchVouchers = async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await axios.get(`${BASE_URL}/vouchers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setVouchers(res.data);
  } catch (error) {
    console.error(error);
    setError("Failed to fetch vouchers");
    toast.error("Failed to fetch vouchers");
  } finally {
    setLoading(false);
  }
};

  /* ================= LOAD ON PAGE ================= */
  useEffect(() => {
    fetchVouchers();
  }, []);

  // ===== HANDLERS =====
  const handleAdd = () => {
    setEditingVoucher(null);
    setOpenForm(true);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  /* ================= SAVE HANDLER ================= */
  const handleSave = (savedVoucher) => {
    // Option 1 (Best): re-fetch from backend
    fetchVouchers();

    // Option 2 (faster UI)
    // setVouchers((prev) => [savedVoucher, ...prev]);

    setOpenForm(false);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [typeFilter, setTypeFilter] = useState("all");
const [sort, setSort] = useState("newest");

const filteredVouchers = React.useMemo(() => {
  let result = [...vouchers];
  const now = new Date();

  // 🔍 Search
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (v) =>
        v.code?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
    );
  }

  // 📊 Status filter
  if (statusFilter !== "all") {
    result = result.filter((v) => {
      if (statusFilter === "active") {
        return v.isActive && (!v.expiryDate || new Date(v.expiryDate) > now);
      }
      if (statusFilter === "expired") {
        return v.expiryDate && new Date(v.expiryDate) < now;
      }
      if (statusFilter === "disabled") {
        return !v.isActive;
      }
      return true;
    });
  }

  // 🎯 Type filter
  if (typeFilter !== "all") {
    result = result.filter((v) => v.type === typeFilter);
  }

  // 🔃 Sorting
  result.sort((a, b) => {
    switch (sort) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "expiry-soon":
  return (new Date(a.expiryDate || Infinity)) - (new Date(b.expiryDate || Infinity));
      case "most-used":
        return (b.usedCount || 0) - (a.usedCount || 0);
      default:
        return 0;
    }
  });

  return result;
}, [vouchers, search, statusFilter, typeFilter, sort]);

const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter, typeFilter, sort]);
const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;

const paginatedVouchers = filteredVouchers.slice(
  startIndex,
  startIndex + itemsPerPage
);

const handleToggle = async (voucher) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(
      `${BASE_URL}/vouchers/${voucher._id}`,
      {
        isActive: !voucher.isActive, // 🔥 toggle
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(
      `Voucher ${voucher.isActive ? "disabled" : "enabled"}`
    );

    // ✅ Update UI instantly
    setVouchers((prev) =>
      prev.map((v) =>
        v._id === voucher._id ? res.data : v
      )
    );

  } catch (error) {
    console.error(error);
    toast.error("Failed to update voucher");
  }
};

const [deleteOpen, setDeleteOpen] = useState(false);
const [selectedVoucher, setSelectedVoucher] = useState(null);

const handleDeleteClick = (voucher) => {
  setSelectedVoucher(voucher);
  setDeleteOpen(true);
};
const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `${BASE_URL}/vouchers/${selectedVoucher._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Voucher deleted");

    setVouchers((prev) =>
      prev.filter((v) => v._id !== selectedVoucher._id)
    );

    setDeleteOpen(false);
    setSelectedVoucher(null);

  } catch (error) {
    toast.error("Delete failed");
  }
};

 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading vouchers...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="text-red-500 text-3xl" />
            </div>
  
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Unable to Load Vouchers
            </h2>
  
            <p className="text-gray-500 mb-6">{error}</p>
  
            <button
              onClick={fetchVouchers}
              className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Ticket className="w-5 h-5 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Vouchers Management
            </h1>
            <p className="text-sm text-gray-500">
              Create and manage discount vouchers and promotions
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* <Button
            variant="outline"
            icon={Download}
            label="Export"
            onClick={handleExport}
          /> */}

          <Button
            icon={Plus}
            label="Add Voucher"
            onClick={handleAdd}
          />
        </div>
      </motion.div>

      {/* ================= STATS ================= */}
      <VoucherStatsCards vouchers={vouchers} />
      {/* ================= FILTERS ================= */}
<VoucherFilters
  search={search}
  onSearchChange={setSearch}
  statusFilter={statusFilter}
  onStatusChange={setStatusFilter}
  typeFilter={typeFilter}
  onTypeChange={setTypeFilter}
  sort={sort}
  onSortChange={setSort}
  
/>
<VoucherTable
  vouchers={paginatedVouchers}
  totalFiltered={filteredVouchers.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onEdit={(voucher) => {
    setEditingVoucher(voucher);
    setOpenForm(true);
  }}
  onToggle={handleToggle}
   onDelete={(voucher) => handleDeleteClick(voucher)}
/>

<div className="mt-4">
  <OrderPagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalOrders={filteredVouchers.length}
    onPageChange={(page) => setCurrentPage(page)}
  />
</div>
<DeleteConfirmDialog
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onConfirm={confirmDelete}
  voucherCode={selectedVoucher?.code}
/>

      {/* ================= MODAL ================= */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="p-6">
              <VoucherForm
                voucher={editingVoucher}
                onSave={handleSave}
                onCancel={handleClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
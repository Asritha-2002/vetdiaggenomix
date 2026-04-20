import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, Settings } from "lucide-react";
import axios from "axios";

import ShopStatsCards from "../components/adminShop/ShopStatsCards.jsx";
import ShopActionsBar from "../components/adminShop/ShopActionBar.jsx";
import ShopDetailModal from "../components/adminShop/ShopDetailModal.jsx";
import ShopCategoryGroup from "../components/adminShop/ShopCategoryGroup.jsx";
import toast from "react-hot-toast"

const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export default function ShopDetails() {
 const [changeEnabled, setChangeEnabled] = useState(() => {
  return localStorage.getItem("shopDetailsChangeEnabled") === "true";
});



  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= TOGGLE ================= */
 const toggleChangeEnabled = () => {
  const newValue = !changeEnabled;

//   console.log("CLICKED TOGGLE");

  setChangeEnabled(newValue);

  localStorage.setItem("shopDetailsChangeEnabled", "true"); // FORCE TEST

//   console.log("STORED:", localStorage.getItem("shopDetailsChangeEnabled"));
};

  /* ================= FETCH DATA ================= */
  const getCharges = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/charges`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Get Charges Error:", error);
      throw error;
    }
  };

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const data = await getCharges();
      setDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  /* ================= GROUP DATA ================= */
  const groupedData = useMemo(() => {
    return details.reduce(
      (acc, item) => {
        const key = item.chargeType || "other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      { gst: [], delivery: [] }
    );
  }, [details]);

  /* ================= FILTER ================= */
  const filteredGroups = Object.keys(groupedData).reduce((acc, key) => {
    let data = groupedData[key];

    if (searchTerm) {
      data = data.filter((d) =>
        JSON.stringify(d).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "ALL") {
      if (categoryFilter.toLowerCase() !== key) {
        data = [];
      }
    }

    acc[key] = data;
    return acc;
  }, {});

  /* ================= HANDLERS ================= */
  const handleAddClick = () => {
    setEditingDetail(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingDetail(item);
    setModalOpen(true);
  };

  const handleSave = async () => {
    await fetchCharges(); // 🔥 refresh from backend
    setModalOpen(false);
  };

 const handleDelete = async (item) => {
  try {
    await axios.delete(`${BASE_URL}/charges/${item._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // ✅ success toast
    toast.success("Charge deleted successfully");

    await fetchCharges(); // refresh UI
  } catch (err) {
    console.error(err);

    // ❌ error toast
    toast.error(
      err?.response?.data?.message || "Failed to delete charge"
    );
  }
};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/60 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-border/50"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Shop Details
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage store charges & settings
                </p>
              </div>
            </div>

            {/* TOGGLE */}
            <div className="flex items-center gap-4">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Edit Mode</span>

              <button
                onClick={toggleChangeEnabled}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  changeEnabled ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition ${
                    changeEnabled ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6">
            <ShopStatsCards details={details} />
          </div>
        </motion.div>

        {/* ================= ACTION BAR ================= */}
        <ShopActionsBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          changeEnabled={changeEnabled}
          onAddClick={handleAddClick}
        />

        {/* ================= LIST ================= */}
        <div className="space-y-8 border border-gray-300 bg-[#f8f8fa] px-8 py-5 rounded-lg">

          <ShopCategoryGroup
            category="gst"
            details={filteredGroups.gst}
            changeEnabled={changeEnabled}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ShopCategoryGroup
            category="delivery"
            details={filteredGroups.delivery}
            changeEnabled={changeEnabled}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </div>

      {/* ================= MODAL ================= */}
      <ShopDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        detail={editingDetail}
        onSave={handleSave}
      />
    </div>
  );
}
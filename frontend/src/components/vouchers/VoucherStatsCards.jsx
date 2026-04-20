import React from "react";
import { motion } from "framer-motion";
import {
  Tags,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

/* ================= CONFIG ================= */
const statsConfig = [
  {
    key: "total",
    label: "Total Vouchers",
    icon: Tags,
    gradient: "from-purple-500 to-purple-600",
    glow: "bg-purple-500",
  },
  {
    key: "active",
    label: "Active",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600",
    glow: "bg-emerald-500",
  },
  {
    key: "expired",
    label: "Expired",
    icon: Clock,
    gradient: "from-orange-500 to-orange-600",
    glow: "bg-orange-500",
  },
  {
    key: "totalUses",
    label: "Total Uses",
    icon: TrendingUp,
    gradient: "from-blue-500 to-blue-600",
    glow: "bg-blue-500",
  },
];

/* ================= COMPONENT ================= */
export default function VoucherStatsCards({ vouchers = [] }) {
  const now = new Date();

  /* ================= NORMALIZE DATA ================= */
  const normalized = vouchers.map((v) => ({
    isActive: v.isActive ?? v.is_active ?? false,
    expiryDate: v.expiryDate ?? v.expiry_date ?? null,
    usedCount: v.usedCount ?? v.used_count ?? 0,
  }));

  /* ================= CALCULATIONS ================= */
  const counts = {
    total: normalized.length,

    active: normalized.filter((v) => {
      if (!v.expiryDate) return v.isActive;
      return v.isActive && new Date(v.expiryDate) > now;
    }).length,

    expired: normalized.filter((v) => {
      if (!v.expiryDate) return false;
      return new Date(v.expiryDate) < now;
    }).length,

    totalUses: normalized.reduce(
      (sum, v) => sum + (Number(v.usedCount) || 0),
      0
    ),
  };

  /* ================= UI ================= */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mx-3">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: "easeOut",
            }}
            className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Glow */}
            <div
              className={`absolute top-0 right-0 w-28 h-28 ${stat.glow} opacity-[0.06] rounded-full translate-x-10 -translate-y-10`}
            />

            {/* Content */}
            <div className="relative z-10">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${stat.gradient}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <p className="text-gray-500 text-sm font-medium">
                {stat.label}
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {(counts[stat.key] || 0).toLocaleString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
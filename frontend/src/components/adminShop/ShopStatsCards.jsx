import React from "react";
import { motion } from "framer-motion";
import { Store, Calculator, Truck, Percent } from "lucide-react";

export default function ShopStatsCards({ details = [] }) {
  /* ================= COUNTS ================= */
  const total = details.length;

  const deliveryCount = details.filter(
    (d) => d.chargeType === "delivery"
  ).length;

  const gstCount = details.filter(
    (d) => d.chargeType === "gst"
  ).length;

  /* ================= GST TOTAL % ================= */
  const gstTotal = details
    .filter((d) => d.chargeType === "gst")
    .reduce((acc, item) => {
      const sgst =
        item.subCharges?.find((s) => s.name === "SGST")?.value || 0;
      const cgst =
        item.subCharges?.find((s) => s.name === "CGST")?.value || 0;

      return acc + sgst + cgst;
    }, 0);

  const stats = [
    {
      key: "total",
      label: "Total Charges",
      icon: Store,
      gradient: "from-indigo-500 to-purple-600",
      value: total,
    },
    {
      key: "gst",
      label: "GST Entries",
      icon: Percent,
      gradient: "from-emerald-500 to-green-600",
      value: gstCount,
    },
    {
      key: "delivery",
      label: "Delivery Charges",
      icon: Truck,
      gradient: "from-blue-500 to-cyan-600",
      value: deliveryCount,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative group rounded-2xl border border-white/10 bg-white/70 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Glow */}
            <div
              className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full group-hover:opacity-20 transition`}
            />

            {/* Icon */}
            <div
              className={`w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Value */}
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h2>

              <p className="text-sm text-gray-500 font-medium mt-1">
                {stat.label}
              </p>

              {/* extra info for GST */}
              {stat.key === "gst" && (
                <p className="text-xs text-gray-400 mt-1">
                  Total Tax: {gstTotal}%
                </p>
              )}
            </div>

            {/* Bottom line */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.gradient} opacity-40`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
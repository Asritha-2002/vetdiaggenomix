import React from "react";
import {
  Package,
  Layers,
  AlertTriangle,
  IndianRupee,
  Tags,
} from "lucide-react";
import { motion } from "framer-motion";

// simple currency formatter (no external import)
const formatCurrency = (num) => {
  return "₹" + num.toLocaleString("en-IN");
};

const stats = [
  {
    key: "total",
    label: "Total Products",
    icon: Package,
    gradient: "from-emerald-500 to-emerald-600",
    bg: "from-emerald-500/10 to-emerald-600/10",
  },
  {
    key: "stock",
    label: "Total Stock",
    icon: Layers,
    gradient: "from-purple-500 to-purple-600",
    bg: "from-purple-500/10 to-purple-600/10",
  },
  {
    key: "lowStock",
    label: "Low Stock",
    icon: AlertTriangle,
    gradient: "from-orange-500 to-orange-600",
    bg: "from-orange-500/10 to-orange-600/10",
  },
  {
    key: "value",
    label: "Inventory Value",
    icon: IndianRupee,
    gradient: "from-green-500 to-green-600",
    bg: "from-green-500/10 to-green-600/10",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Tags,
    gradient: "from-blue-500 to-blue-600",
    bg: "from-blue-500/10 to-blue-600/10",
  },
];

export default function StatsCards({ products = [] }) {
  // ✅ calculations based on your schema

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + (p.stock || 0),
    0
  );

  const lowStock = products.filter((p) => (p.stock || 0) < 5);

  const totalValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * (p.stock || 0),
    0
  );

  const uniqueCategories = [
    ...new Set(products.map((p) => p.category)),
  ];

  const values = {
    total: totalProducts.toLocaleString(),
    stock: totalStock.toLocaleString(),
    lowStock: lowStock.length.toLocaleString(),
    value: formatCurrency(totalValue),
    categories: uniqueCategories.length.toLocaleString(),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 lg:p-6 relative overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* background blob */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bg} rounded-full translate-x-8 -translate-y-8`}
            />

            <div className="relative z-10">
              {/* icon */}
              <div
                className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* label */}
              <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </h3>

              {/* value */}
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                {values[stat.key]}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
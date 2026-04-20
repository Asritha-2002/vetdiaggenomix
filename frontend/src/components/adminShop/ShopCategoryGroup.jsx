import React from "react";
import { Calculator, Truck } from "lucide-react";
import ShopDetailCard from "./ShopDetailCard";

/* ================= CATEGORY CONFIG (CLEANED) ================= */
const categoryConfig = {
  gst: {
    label: "GST Charges (%)",
    icon: Calculator,
    gradient: "from-purple-500 to-violet-600",
  },
  delivery: {
    label: "Delivery Charges",
    icon: Truck,
    gradient: "from-blue-500 to-cyan-600",
  },
};

export default function ShopCategoryGroup({
  category,
  details,
  changeEnabled,
  onEdit,
  onDelete,
}) {
  const config = categoryConfig[category] || {
    label: category,
    icon: Calculator,
    gradient: "from-gray-400 to-gray-500",
  };

  const Icon = config.icon;

  if (!details || details.length === 0) return null;

  return (
    <div className="space-y-4 ">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">

        <div
          className={`w-9 h-9 bg-gradient-to-r ${config.gradient} rounded-xl flex items-center justify-center text-white`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <h2 className="text-lg font-bold text-foreground">
          {config.label}
        </h2>

        <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
          {details.length} item{details.length !== 1 ? "s" : ""}
        </span>

      </div>

      {/* ================= CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {details.map((detail, i) => (
          <ShopDetailCard
            key={detail._id || i}
            detail={detail}
            index={i}
            changeEnabled={changeEnabled}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

      </div>

    </div>
  );
}
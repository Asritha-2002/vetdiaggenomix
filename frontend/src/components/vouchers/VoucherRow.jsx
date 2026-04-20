import React from "react";
import { motion } from "framer-motion";
import { Pencil, Pause, Play, Trash2, Ticket } from "lucide-react";
import { format } from "date-fns";

/* ================= INLINE BADGE ================= */
function Badge({ children, className = "" }) {
  return (
    <div
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </div>
  );
}

/* ================= INLINE BUTTON ================= */
function Button({
  children,
  className = "",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md transition ${className}`}
    >
      {children}
    </button>
  );
}

/* ================= HELPERS ================= */
function getVoucherStatus(voucher) {
  if (!voucher.isActive) return "disabled";
  if (voucher.expiryDate && new Date(voucher.expiryDate) < new Date())
    return "expired";
  if (voucher.maxUses && voucher.usedCount >= voucher.maxUses)
    return "exhausted";
  return "active";
}

function formatValue(voucher) {
  if (voucher.type === "percentage") {
    return `${voucher.value}% off${
      voucher.maxDiscount ? ` (Max: ₹${voucher.maxDiscount})` : ""
    }`;
  }
  if (voucher.type === "fixed") return `₹${voucher.value} off`;
  if (voucher.type === "complimentary")
    return `${voucher.complimentaryConfig?.quantity || 1}x Free Items`;
  return String(voucher.value);
}

function getDaysRemaining(expiryDate) {
  const days = Math.ceil(
    (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `${days} days left`;
}

/* ================= STYLES ================= */
const statusStyles = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  disabled: "bg-gray-100 text-gray-600 border-gray-200",
  exhausted: "bg-orange-100 text-orange-700 border-orange-200",
};

const typeStyles = {
  percentage: "bg-blue-100 text-blue-700",
  fixed: "bg-emerald-100 text-emerald-700",
  complimentary: "bg-purple-100 text-purple-700",
};

/* ================= COMPONENT ================= */
export default function VoucherRow({
  voucher,
  index,
  onEdit,
  onToggle,
  onDelete,
}) {
  const status = getVoucherStatus(voucher);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="hover:bg-gray-50 transition-colors group"
    >
      {/* CODE */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {voucher.code}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {voucher.description || "No description"}
            </p>
          </div>
        </div>
      </td>

      {/* TYPE */}
      <td className="py-4 px-5">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            typeStyles[voucher.type] || "bg-gray-100 text-gray-700"
          }`}
        >
          {voucher.type}
        </span>
      </td>

      {/* VALUE */}
      <td className="py-4 px-5">
        <p className="text-sm font-medium">
          {formatValue(voucher)}
        </p>

        {voucher.minPurchase > 0 && (
          <p className="text-xs text-gray-500">
            Min: ₹{voucher.minPurchase}
          </p>
        )}
      </td>

      {/* STATUS */}
      <td className="py-4 px-5">
        <Badge className={`border ${statusStyles[status]}`}>
          {status}
        </Badge>
      </td>

      {/* MAX USES */}
      <td className="py-4 px-5">
        <p className="text-sm font-medium">
          {voucher.usedCount || 0}
        </p>
      </td>

      {/* EXPIRY */}
      <td className="py-4 px-5">
        <p className="text-sm">
          {voucher.expiryDate
            ? format(new Date(voucher.expiryDate), "MMM d, yyyy")
            : "—"}
        </p>

        <p className="text-xs text-gray-500">
          {voucher.expiryDate
            ? getDaysRemaining(voucher.expiryDate)
            : ""}
        </p>
      </td>

      {/* ACTIONS */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          
          {/* EDIT */}
          <Button
            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
            onClick={() => onEdit(voucher)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>

          {/* TOGGLE */}
          <Button
            className={`w-8 h-8 rounded-lg ${
              voucher.isActive
                ? "bg-red-50 hover:bg-red-100 text-red-600"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
            }`}
            onClick={() => onToggle(voucher)}
          >
            {voucher.isActive ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </Button>

          {/* DELETE */}
          <Button
            className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
            onClick={() => onDelete(voucher)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>

        </div>
      </td>
    </motion.tr>
  );
}
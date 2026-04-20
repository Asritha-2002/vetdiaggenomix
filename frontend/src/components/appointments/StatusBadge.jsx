import React from "react";
import { CheckCircle2, XCircle, CalendarCheck } from "lucide-react";

const statusStyles = {
  booked: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: CalendarCheck,
  },
  completed: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: XCircle,
  },
};

export default function StatusBadge({ status = "booked" }) {
  const style = statusStyles[status] || statusStyles.booked;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text}`}
    >
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
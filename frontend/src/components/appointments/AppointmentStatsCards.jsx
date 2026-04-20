import React from "react";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AppointmentStatsCards({ appointments = [] }) {
  // 🔢 stats based on your real schema
  const total = appointments.length;

  const booked = appointments.filter(
    (a) => a.status === "booked"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "cancelled"
  ).length;

  const stats = [
    {
      label: "Total Appointments",
      value: total,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Booked",
      value: booked,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition"
          >
            {/* Left content */}
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {item.value}
              </p>
            </div>

            {/* Icon */}
            <div className={`p-3 rounded-lg ${item.color} text-white`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
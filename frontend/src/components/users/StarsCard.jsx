import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ value, label, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`${gradient} rounded-2xl p-4 border`}
    >
      <div className="text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </div>
    </motion.div>
  );
}
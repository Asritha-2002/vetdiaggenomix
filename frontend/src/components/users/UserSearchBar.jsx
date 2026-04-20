import React from "react";
import { FaSearch, FaDownload } from "react-icons/fa";

export default function UserSearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  onExport
}) {
  return (
    <div className="rounded-3xl p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* 🔍 Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 🎯 Filter + Export */}
        <div className="flex items-center gap-4">

          {/* Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* Export Button */}
          {/* <button
            onClick={onExport}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:scale-105 transition"
          >
            <FaDownload />
            Export
          </button> */}
        </div>
      </div>
    </div>
  );
}
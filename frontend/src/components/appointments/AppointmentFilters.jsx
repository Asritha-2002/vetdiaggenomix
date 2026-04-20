import React, { useState } from "react";
import { Search, X, ChevronDown, Check, Filter } from "lucide-react";

export default function AppointmentFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  locations = [],
}) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Booked", value: "booked" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || locationFilter !== "all";

  const clearAll = () => {
    setSearch("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  return (
    <div className="bg-[#ffffff] shadow-sm border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      
      {/* SEARCH */}
      <div className="flex items-center bg-[#f6f7f9] border border-gray-100 rounded-xl px-4 py-2 flex-1">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search name, email, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm bg-transparent text-gray-700"
        />
      </div>

      {/* CUSTOM STATUS DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center justify-between min-w-[160px] h-11 px-4 bg-[#f6f7f9] border border-gray-100 rounded-xl text-sm text-gray-700 transition-all hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-[#1e293b]">
              {statusOptions.find(opt => opt.value === statusFilter)?.label}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
        </button>

        {isStatusOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
            
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-1.5 animate-in fade-in zoom-in duration-150">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                      isActive 
                        ? "bg-[#f0fdf9] text-[#14532d] font-medium" 
                        : "text-[#475569] hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                    {isActive && <Check className="w-4 h-4 text-[#059669]" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* LOCATION SELECT (Kept simple for functionality, but matching border/bg) */}
      <select
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        className="h-11 px-4 bg-[#f6f7f9] border border-gray-100 rounded-xl text-sm text-[#1e293b] font-medium outline-none min-w-[160px]"
      >
        <option value="all">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {/* CLEAR BUTTON */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
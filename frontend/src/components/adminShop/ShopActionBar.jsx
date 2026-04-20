import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X, ChevronDown, Check } from "lucide-react";

/* ================= INPUT ================= */
const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={
        "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 " +
        className
      }
    />
  );
});
Input.displayName = "Input";

/* ================= BUTTON ================= */
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 h-11 text-sm font-medium transition bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95 " +
        className
      }
    >
      {children}
    </button>
  );
}

/* ================= MAIN ================= */

export default function ShopActionsBar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  changeEnabled,
  onAddClick,
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  /* ================= CLEAN CATEGORIES ================= */
  const categories = [
    { label: "All Charges", value: "ALL" },
    { label: "GST Charges", value: "gst" },
    { label: "Delivery Charges", value: "delivery" },
  ];

  const selectedLabel =
    categories.find((c) => c.value === categoryFilter)?.label ||
    "All Charges";

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = (val) => {
    setLocalSearch(val);
    onSearchChange(val);
  };

  const clearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-gray-200">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* ================= SEARCH ================= */}
        <div className="relative flex-1 max-w-md">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <Input
            placeholder="Search charges..."
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />

          {localSearch && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-black" />
            </button>
          )}

        </div>

        {/* ================= FILTER + ACTION ================= */}
        <div className="flex items-center gap-3">

          {/* ================= CUSTOM DROPDOWN ================= */}
          <div className="relative" ref={dropdownRef}>

            <button
              onClick={() => setOpen(!open)}
              className="w-44 h-11 flex items-center justify-between px-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm"
            >
              {selectedLabel}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {open && (
              <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => {
                      onCategoryChange(cat.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {cat.label}

                    {categoryFilter === cat.value && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* ================= ADD BUTTON ================= */}
          {changeEnabled && (
            <Button onClick={onAddClick}>
              <Plus className="w-4 h-4" />
              Add Charge
            </Button>
          )}

        </div>

      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Home, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../context/CheckoutContext";

const AddressCard = ({ addresses = [], onAddNew, onEdit, onDelete, onSetDefault, onSelect }) => {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const { setSelectedAddress } = useCheckout();

  // ✅ Set default selected when addresses load
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedId(addresses[0]._id);
    } else {
      setSelectedId(null);
    }
  }, [addresses]);

  return (
    <div className="flex flex-col justify-between h-full w-full max-w-md">

      {/* TOP CONTENT */}
      <div>
        {addresses.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="relative mb-6">
              <Home size={64} strokeWidth={1} className="text-gray-800" />
              <div className="absolute -bottom-1 -right-4 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                <div className="bg-gray-50 rounded-full p-1">
                  <MapPin size={24} className="text-gray-800" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1 text-gray-900">
              No Saved Address
            </h3>
            <p className="text-gray-500 text-sm">
              Please add a new address
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ADDRESS LIST */}
            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">
                  Saved Address
                </h2>
              </div>

              {addresses.map((addr, index) => (
                <div key={addr._id}>
                  <div
                    onClick={() => {
  setSelectedId(addr._id);
  onSelect&&onSelect(addr); // ✅ VERY IMPORTANT
}}
                    className="p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition"
                  >
                    {/* RADIO */}
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedId === addr._id
                            ? "border-black"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedId === addr._id && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 text-[13px] leading-relaxed">
                      <p className="font-bold text-gray-900">
                        {addr.fullName}
                        {addr.isDefault && (
  <span className="text-red-600 ml-1">(Default)</span>
)}
                      </p>

                      <p className="text-gray-600 mt-1 text-xs">
                        {addr.addressLine1}, {addr.addressLine2}
                        <br />
                        {addr.city}, {addr.state}
                        <br />
                        {addr.pincode}
                      </p>

                      <p className="mt-1 text-sm text-gray-900">
                        +91 {addr.mobileNumber}
                      </p>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button
                          onClick={(e) => {
    e.stopPropagation();
    onEdit(addr); // ✅ send selected address to parent
  }}
                          className="px-4 py-1.5 border border-gray-400 rounded-full text-xs hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                             onDelete(addr._id);
                          }}
                          className="px-4 py-1.5 border border-gray-400 rounded-full text-xs hover:bg-gray-100"
                        >
                          Remove
                        </button>

                        {index !== 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetDefault(addr._id);
                            }}
                            className="px-4 py-1.5 border border-gray-400 rounded-full text-xs hover:bg-gray-100"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  {index < addresses.length - 1 && (
                    <hr className="mx-4 border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ SHOW ONLY WHEN ADDRESSES EXIST */}
        {addresses.length > 0 && (
          <div
            onClick={onAddNew}
            className="mt-4 bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-gray-400 transition"
          >
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
            <span className="text-sm font-bold text-gray-900">
              Add New Address
            </span>
          </div>
        )}
      </div>

      {/* CONTINUE BUTTON */}
     <button
  onClick={() => {
  const selected = addresses.find(
    (addr) => addr._id === selectedId
  );

  console.log("Selected address:", selected);

  if (!selected) return; // ✅ safety guard

  // context
  setSelectedAddress(selected);

  // localStorage
  localStorage.setItem(
    "selectedAddress",
    JSON.stringify(selected)
  );

  navigate("/checkout/summary");
}}
  disabled={!selectedId}
  className={`mt-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
    selectedId
      ? "bg-[#b50b0b] text-white hover:bg-red-800"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
>
  Continue
</button>
    </div>
  );
};

export default AddressCard;
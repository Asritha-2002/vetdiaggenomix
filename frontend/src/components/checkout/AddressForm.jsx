import React from "react";
import { Home, Building2 } from "lucide-react";

const AddressForm = ({
  formData,
  handleInputChange,
  addressType,
  setAddressType,
  onSave,
  onCancel,
  mode = "add", // ✅ NEW (add | edit)
  hasAddresses = false,
  disabled=false,
}) => {
  return (
    <div className="flex-1 border border-[#b50b0b] rounded-xl px-8 py-4 bg-white">
      
      {/* ✅ Dynamic Title */}
      <h2 className="text-[15px] font-bold mb-2 text-gray-900">
        {mode === "edit" ? "Edit Address" : "Add New Address"}
      </h2>

      <hr className="mb-6 border-gray-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        
        <Input
          label="Full Name*"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter Full Name"
          disabled={disabled} 
        />

        {/* Mobile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-bold text-gray-900">
            Mobile Number*
          </label>
          <div className="flex gap-2">
            <div 
            className={`flex items-center gap-2 border border-gray-300 rounded-md px-3 bg-white
        ${disabled 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
          : "bg-white border-gray-300 focus:ring-1 focus:ring-red-400"}
      `}>
              <img src="https://flagcdn.com/in.svg" className="w-5" />
              <span className="text-[10px]">▼</span>
            </div>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`border rounded-md px-3 py-2.5 text-sm transition-all
        ${disabled 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
          : "bg-white border-gray-300 focus:ring-1 focus:ring-red-400"}
      `}
              placeholder="Enter Mobile Number"
              disabled={disabled} 
            />
          </div>
        </div>

        <Input
          label="Address Line 1*"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleInputChange}
          placeholder="House no., Flat no."
          disabled={disabled} 
        />

        <Input
          label="Cpuntry"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleInputChange}
          placeholder="Area, Colony"
          disabled={disabled} 
        />

        <Input
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          placeholder="Enter Landmark"
          disabled={disabled} 
        />

        <Input
          label="Pincode*"
          name="pincode"
          value={formData.pincode}
          onChange={handleInputChange}
          placeholder="Enter Pincode"
          disabled={disabled} 
        />

        <Input
          label="City*"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Enter City"
          disabled={disabled} 
        />

        <Input
          label="State*"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Enter State"
          disabled={disabled} 
        />
      </div>

      {/* Address Type */}
      <div className="flex gap-3 mt-8">
        <ToggleBtn
          active={addressType === "Home"}
          onClick={() => setAddressType("Home")}
          icon={<Home size={16} />}
          text="Home"
          disabled={disabled} 
        />
        <ToggleBtn
          active={addressType === "Office"}
          onClick={() => setAddressType("Office")}
          icon={<Building2 size={16} />}
          text="Office"
          disabled={disabled} 
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-8 mt-12 mb-2">
        <button
  onClick={onSave}
  disabled={disabled}
  className={`px-14 py-3 rounded-xl font-bold text-sm transition-all
    ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#b50b0b] text-white hover:bg-red-800"
    }
  `}
>
  {mode === "edit" ? "Update" : "Save"}
</button>

        {/* ✅ Show Cancel ONLY when editing OR when addresses exist */}
        {(mode === "edit" || hasAddresses) && (
          <button
  onClick={onCancel}
  disabled={disabled}
  className={`px-14 py-3 rounded-xl font-bold text-sm transition-all
    ${
      disabled
        ? "border border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
        : "border border-red-600 text-red-600 bg-white hover:bg-red-50"
    }
  `}
>
  Cancel
</button>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, placeholder, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12px] font-bold">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className={`border rounded-md px-3 py-2.5 text-sm transition-all
        ${disabled 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
          : "bg-white border-gray-300 focus:ring-1 focus:ring-red-400"}
      `}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const ToggleBtn = ({ active, onClick, icon, text, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-6 py-2 rounded-full border text-xs font-bold transition
      ${active
        ? "bg-[#ffecec] border-red-200 text-[#b50b0b]"
        : "border-gray-300 text-gray-700"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
    `}
  >
    {icon} {text}
  </button>
);

export default AddressForm;
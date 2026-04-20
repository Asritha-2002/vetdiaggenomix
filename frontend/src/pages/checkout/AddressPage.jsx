// pages/checkout/AddressPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/checkout/Stepper";
import AddressCard from "../../components/checkout/AddressCard";
import AddressForm from "../../components/checkout/AddressForm";
import Navbar from "../Navbar";
import Footer from "../Footer";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddressPage = () => {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addressType, setAddressType] = useState("Home");
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const initialState = {
    fullName: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  };

  const [formData, setFormData] = useState(initialState);

  // ✅ FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/checkout-addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ✅ MAIN LOGIC (IMPORTANT)
  useEffect(() => {
    if (addresses.length > 0) {
      // 👉 EDIT MODE (default first address)
      setSelectedAddress(addresses[0]);
      setFormData(addresses[0]);
      setAddressType(addresses[0].type || "Home");
      setIsEditMode(true);
      setShowForm(true);
    } else {
      // 👉 ADD MODE
      setFormData(initialState);
      setAddressType("Home");
      setIsEditMode(false);
      setShowForm(true);
    }
  }, [addresses]);

  // ✅ INPUT CHANGE
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ SAVE ADDRESS (ADD + UPDATE)
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    let res;

    if (isEditMode && selectedAddress) {
      // ✏️ UPDATE
      res = await axios.put(
        `${BASE_URL}/checkout-addresses/${selectedAddress._id}`,
        { ...formData, type: addressType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Address updated!");
    } else {
      // ➕ ADD
      res = await axios.post(
        `${BASE_URL}/checkout-addresses`,
        { ...formData, type: addressType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Address added!");
    }

    setAddresses(res.data);
    setShowForm(false);

  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};
const handleSetDefault = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${BASE_URL}/checkout-addresses/default/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setAddresses(res.data);

    toast.success("Default address updated!");
  } catch (err) {
    toast.error("Failed to update default address");
  }
};

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading...</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-white pb-24 mt-18 lg:mt-24">
        
        {/* TOP BAR */}
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between border border-gray-300 rounded">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <Stepper />

          <div className="w-12"></div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: ADDRESS CARD */}
          <div className="w-full lg:w-[320px]">
            <AddressCard
  addresses={addresses}

 onAddNew={() => {
  setFormData(initialState);
  setAddressType("Home");

  setIsEditMode(false);
  setIsFormDisabled(false); // ✅ allow typing
  setShowForm(true);
}}

 onEdit={(addr) => {
  setSelectedAddress(addr);
  setFormData(addr);
  setAddressType(addr.type || "Home");

  setIsEditMode(true);       // ✅ editing
  setIsFormDisabled(false);  // 🔓 enable form
  setShowForm(true);
}}
onSelect={(addr) => {
  setSelectedAddress(addr);
  setFormData(addr);
  setAddressType(addr.type || "Home");

  setIsEditMode(false);     // ❌ not editing
  setIsFormDisabled(true);  // 🔒 disable form
  setShowForm(true);
}}

  onDelete={async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${BASE_URL}/checkout-addresses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddresses(res.data);
      toast.success("Address deleted successfully!");

    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  }}
  onSetDefault={handleSetDefault}
/>
          </div>

          {/* RIGHT: FORM */}
          {showForm && (
            <AddressForm
  formData={formData}
  handleInputChange={handleInputChange}
  addressType={addressType}
  setAddressType={setAddressType}
  onSave={handleSave}
  onCancel={() => setShowForm(false)}
  mode={isEditMode ? "edit" : "add"}   // ✅ FIX
  hasAddresses={addresses.length > 0}  // optional but useful
   disabled={isFormDisabled} 
/>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddressPage;
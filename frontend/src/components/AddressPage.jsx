import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Home, Building2, MapPin } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressType, setAddressType] = useState('Home');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        // For testing empty state, we keep addresses as []
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pb-24">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button className="flex items-center text-sm font-semibold gap-1 hover:text-black">
          <ChevronLeft size={20} /> Back
        </button>
        
        {/* Step Progress Bar */}
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-[#b50b0b] text-white text-xs flex items-center justify-center font-bold">1</div>
            <span className="text-[11px] font-bold">Address</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-300 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-7 h-7 rounded-full border border-gray-400 text-gray-500 text-xs flex items-center justify-center font-bold">2</div>
            <span className="text-[11px] font-medium">Order Summary</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-300 mx-2 -mt-4"></div>
          <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-7 h-7 rounded-full border border-gray-400 text-gray-500 text-xs flex items-center justify-center font-bold">3</div>
            <span className="text-[11px] font-medium">Payment</span>
          </div>
        </div>
        <div className="w-12"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Side: Empty State Card */}
        <div className="w-full lg:w-[320px]">
          {addresses.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center h-[320px]">
              <div className="relative mb-6">
                <Home size={64} strokeWidth={1} className="text-gray-800" />
                <div className="absolute -bottom-1 -right-4 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                   <div className="bg-gray-50 rounded-full p-1">
                    <MapPin size={24} className="text-gray-800" />
                   </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">No Saved Address</h3>
              <p className="text-gray-500 text-sm">Please add a new address</p>
            </div>
          )}
        </div>

        {/* Right Side: Form Card */}
        <div className="flex-1 border border-red-500/30 rounded-xl p-8 bg-white">
          <h2 className="text-[15px] font-bold mb-6 text-gray-900">Add New Address</h2>
          <hr className="mb-6 border-gray-100" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Full Name*</label>
              <input 
                name="fullName"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400" 
                placeholder="Enter Full Name" 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Mobile Number*</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 bg-white">
                  <img src="https://flagcdn.com/in.svg" className="w-5" alt="IN" />
                  <span className="text-[10px] text-gray-800">▼</span>
                </div>
                <input 
                  name="mobileNumber"
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400" 
                  placeholder="Enter Mobile Number" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Address Line 1*</label>
              <input 
                name="addressLine1"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="House no., Flat no., Building name" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Address Line 2*</label>
              <input 
                name="addressLine2"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Area, Colony" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Landmark</label>
              <input 
                name="landmark"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Enter Landmark" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">Pincode*</label>
              <input 
                name="pincode"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Enter Pincode" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">City*</label>
              <input 
                name="city"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Enter City" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-gray-900">State*</label>
              <input 
                name="state"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Enter State" 
              />
            </div>
          </div>

          {/* Address Type Selection */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => setAddressType('Home')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full border text-xs font-bold transition-all ${addressType === 'Home' ? 'bg-[#ffecec] border-red-200 text-[#b50b0b]' : 'border-gray-300 text-gray-700'}`}
            >
              <Home size={16} /> Home
            </button>
            <button 
              onClick={() => setAddressType('Office')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full border text-xs font-bold transition-all ${addressType === 'Office' ? 'bg-[#ffecec] border-red-200 text-[#b50b0b]' : 'border-gray-300 text-gray-700'}`}
            >
              <Building2 size={16} /> Office
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-12 mb-2">
            <button className="bg-[#b50b0b] text-white px-14 py-3 rounded-xl font-bold text-sm hover:bg-red-800 transition shadow-sm">
              Save
            </button>
            <button className="border border-red-600 text-red-600 px-14 py-3 rounded-xl font-bold text-sm hover:bg-red-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto">
          <button className="bg-gray-200 text-gray-400 w-full lg:w-[280px] py-3.5 rounded-lg font-bold text-sm cursor-not-allowed">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
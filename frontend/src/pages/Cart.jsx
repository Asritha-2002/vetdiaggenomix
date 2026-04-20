import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { Trash2, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [charges, setCharges] = useState({
  delivery: null,
  gst: null,
  });
  // console.log(charges.gst);
  

  const navigate = useNavigate();
  const fetchCharges = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/charges/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCharges({
      delivery: res.data.delivery,
      gst: res.data.gst,
    });
  } catch (error) {
    console.error("Charges fetch error:", error);
  }
  };

  // Logic to re-calculate discount with maxDiscount cap and minPurchase validation
  const calculateDiscount = (currentTotal, voucher) => {
    if (!voucher) return 0;
    
    // Check if min purchase is met
    if (currentTotal < voucher.minPurchase) return -2; // Flag for invalid

    if (voucher.type === "percentage") {
      let calc = (currentTotal * voucher.value) / 100;
      return voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
    } 
    if (voucher.type === "fixed") return voucher.value;
    return 0;
  };

  const validateVoucher = (currentCart, voucher) => {
    if (!voucher) return;
    const newDiscount = calculateDiscount(currentCart.totalAmount, voucher);
    
    if (newDiscount === -2) {
      removeVoucher(); // Threshold not met, remove
    } else {
      setVoucherDiscount(newDiscount);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setCart(data);
      
      // Rehydrate applied voucher if it exists in session
      try {
        const summaryRes = await axios.get(`${BASE_URL}/checkout/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (summaryRes.data.voucher) {
          const v = summaryRes.data.voucher;
          setAppliedVoucher(v);
          setSelectedVoucher(v);
          validateVoucher(data, v);
        }
      } catch (e) { console.log("No active checkout session found."); }
    } catch (error) { console.error("Cart fetch error:", error); }
  };

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/vouchers`, {
        params: { cartTotal: cart?.totalAmount || 0 },
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.data || [];
      setVouchers(Array.isArray(list) ? list : []);
    } catch (error) { console.error("Voucher fetch error:", error); }
  };

  useEffect(() => { fetchCart();}, []);
  useEffect(() => { if (cart) fetchVouchers(); fetchCharges(); }, [cart]);

  const delivery_fee = charges?.delivery?.value || 0;
  const totalOriginalAmount = cart?.totalOriginalAmount || 0;
  const totalAmount = cart?.totalAmount || 0;
  const discount = totalOriginalAmount - totalAmount;
  const gstTotal = charges?.gst?.subCharges?.reduce((acc, item) => {
    return acc + item.value;
  }, 0) || 0;

  const gstAmount = Math.round((totalAmount * gstTotal) / 100);

  const updateQuantity = async (itemId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${BASE_URL}/cart/${itemId}`, { action }, { headers: { Authorization: `Bearer ${token}` } });
      setCart(res.data);
      if (appliedVoucher) validateVoucher(res.data, appliedVoucher);
    } catch (error) { console.error("Quantity update error:", error); }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${BASE_URL}/cart/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCart(res.data);
      if (appliedVoucher) validateVoucher(res.data, appliedVoucher);
    } catch (error) { console.error("Remove item error:", error); }
  };

  const applyVoucher = () => {
    if (!selectedVoucher) return;
    const d = calculateDiscount(totalAmount, selectedVoucher);
    if (d === -2) {
      alert(`Minimum purchase of ₹${selectedVoucher.minPurchase} required.`);
      return;
    }
    setVoucherDiscount(d);
    setAppliedVoucher(selectedVoucher);
  };

  const removeVoucher = async () => {
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    setSelectedVoucher(null);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/checkout/voucher`, { voucherId: null }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.error("Remove voucher error:", e); }
  };

  const finalTotal = totalAmount + delivery_fee + gstAmount - voucherDiscount;

  const handleContinue = async () => {
    try {
      const token = localStorage.getItem("token");
      const sessionRes = await axios.post(`${BASE_URL}/checkout/start`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await axios.patch(`${BASE_URL}/checkout/voucher`, {
        voucherId: appliedVoucher?._id || null,
        sessionId: sessionRes.data.data._id,
      }, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/checkout");
    } catch (error) { console.error("Continue error:", error); }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 mt-16">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4 relative">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg border border-gray-100" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg text-[#b50b0b] leading-tight">{item.title}</h2>
                        <button onClick={() => removeItem(item._id)} className="flex cursor-pointer items-center gap-1 text-[#b50b0b] border border-red-100 px-2 py-1 rounded-md text-[10px] font-bold hover:bg-red-50 transition">
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-xl font-black text-black">₹{item.price}</p>
                        <span className="text-[10px] text-gray-400 font-medium">(Inclusive of taxes)</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">+ ₹100 Delivery Fee</p>
                      <div className="mt-3 flex items-center border border-gray-300 rounded overflow-hidden h-7 w-fit">
                        <button onClick={() => updateQuantity(item._id, "dec")} className="w-7 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-[#b50b0b] font-bold border-r border-gray-300">-</button>
                        <div className="w-8 h-full flex items-center justify-center bg-white font-bold text-xs text-[#b50b0b]">{item.quantity}</div>
                        <button onClick={() => updateQuantity(item._id, "inc")} className="w-7 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-[#b50b0b] font-bold border-l border-gray-300">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-800">
                      <Truck size={16} className="text-black" />
                      <span className="text-xs font-medium"><span className="italic font-black">EXPRESS</span> Deliver by March 10, 2026</span>
                    </div>
                    <label className="text-xs flex items-center gap-2 cursor-pointer text-gray-800 font-medium">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-400 text-[#b50b0b] focus:ring-0" />
                      Get Invoice with parcel
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="font-bold text-lg mb-3 text-gray-800">Total Orders Summary</h2>
                <hr className="mb-6 text-[#808080]" />
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between"><span>MRP</span><span>₹{totalOriginalAmount}</span></div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span>₹{delivery_fee}</span></div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>                  
                  <div className="flex justify-between"><span>Discount</span><span className="text-[#b50b0b]">- ₹{discount > 0 ? discount : 0}</span></div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4">
                  <div className="flex justify-between mt-4">
                    <span>GST ({gstTotal}%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
                    <p className="text-xs font-bold my-4">Apply Voucher</p>
                    <select className="w-full border rounded p-2 text-xs" value={selectedVoucher?._id || ""} onChange={(e) => {
                      const v = vouchers.find(v => v._id === e.target.value);
                      setSelectedVoucher(v || null);
                    }}>
                      <option value="">Select voucher</option>
                      {vouchers.map((v) => <option key={v._id} value={v._id}>{v.code} - {v.description || "Special Offer"}</option>)}
                    </select>
                    <button onClick={applyVoucher} disabled={appliedVoucher !== null} className={`mt-2 w-full text-xs py-2 rounded font-bold transition ${appliedVoucher ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#b50b0b] text-white hover:bg-[#8e0909]"}`}>
                      {appliedVoucher ? "Applied" : "Apply"}
                    </button>
                    {appliedVoucher && <button onClick={removeVoucher} className="mt-2 w-full text-xs py-2 rounded border border-red-500 text-red-600 hover:bg-red-50">Remove Voucher</button>}
                  </div>

                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
                  <div className="flex justify-between">
                    <span>Voucher Discount</span>
                    <span className="text-green-600">{appliedVoucher?.type === "complimentary" ? "FREE GIFT 🎁" : `- ₹${voucherDiscount}`}</span>
                  </div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
                  
                  <div className="flex justify-between items-center"><span>Total Amount</span><span>₹{finalTotal}</span></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border flex justify-between items-center">
                <p className="font-black text-[#b50b0b]">₹{finalTotal}</p>
                <button onClick={handleContinue} className="bg-[#b50b0b] text-white py-2 px-6 rounded-lg font-bold">Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
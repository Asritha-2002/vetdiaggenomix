import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCheckout } from "../../context/CheckoutContext";
import { Trash2, Truck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SummaryStepper from "../../components/checkout/SummaryStepper";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_ORDERS_URL= import.meta.env.VITE_ORDERS_URL;

const OrderSummaryPage = () => {
  const { selectedAddress } = useCheckout();
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [charges, setCharges] = useState({
  delivery: null,
  gst: null,
  });

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

  useEffect(() => {
    const saved = selectedAddress || JSON.parse(localStorage.getItem("selectedAddress"));
    setAddress(saved);
  }, [selectedAddress]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.data);
    } catch (error) { console.error("Cart fetch error:", error); }
  };

  const fetchCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/checkout/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { voucherDiscount: rawDiscount, voucher } = res.data;
      
      // LOGIC: Apply maxDiscount cap if it exists in the voucher object
      let calculatedDiscount = rawDiscount || 0;
      if (voucher?.maxDiscount) {
        calculatedDiscount = Math.min(calculatedDiscount, voucher.maxDiscount);
      }

      setVoucherDiscount(calculatedDiscount);
      setAppliedVoucher(voucher || null);
    } catch (error) { console.error("Checkout fetch error:", error); }
  };

  useEffect(() => {
    fetchCart();
    fetchCheckout();
    fetchCharges();
  }, []);

  const delivery_fee =  charges?.delivery?.value || 0;;
  const totalOriginalAmount = cart?.totalOriginalAmount || 0;
  const totalAmount = cart?.totalAmount || 0;
  const discount = totalOriginalAmount - totalAmount;
  const gstTotal =
  charges?.gst?.subCharges?.reduce((acc, item) => {
    return acc + item.value;
  }, 0) || 0;
  const gstAmount = Math.round((totalAmount * gstTotal) / 100);
  const finalTotal = Math.max(0, totalAmount + delivery_fee+ gstAmount - voucherDiscount);

  const updateQuantity = async (itemId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${BASE_URL}/cart/${itemId}`, { action }, { headers: { Authorization: `Bearer ${token}` } });
      fetchCart();
      fetchCheckout();
    } catch (error) { console.error("Quantity update error:", error); }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/cart/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCart();
      fetchCheckout();
    } catch (error) { console.error("Remove item error:", error); }
  };

  const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    // 🟢 1. Create order in backend
  const res = await axios.post(
  `${VITE_ORDERS_URL}/create-pay-order`,
  {
    shippingAddress: address,
    charges: {
  subtotal: totalAmount,
  gst: gstAmount,
  deliveryCharge: delivery_fee,
  paymentCharge: 0,
  totalAmount: finalTotal // ✅ FIX
},
    paymentMethod: "razorpay",
    appliedVoucher: appliedVoucher
      ? {
          id: appliedVoucher._id,
          code: appliedVoucher.code,
          discountType: appliedVoucher.type,
          discount: voucherDiscount,
        }
      : null,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const { razorpayOrder } = res.data;

    // 🟢 2. Razorpay options
    const options = {
      key: razorpayOrder.key,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: razorpayOrder.companyName,
      description: "Order Payment",
      image: razorpayOrder.companyLogo,

      order_id: razorpayOrder.id,

      handler: async function (response) {
        try {
          // 🟢 3. VERIFY PAYMENT
          const verifyRes = await axios.post(
            `${BASE_URL}/verify-payment`,
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful!");
            navigate("/success"); // or order confirmation page
          }
        } catch (err) {
          console.error("Verification failed", err);
        }
      },

      theme: {
        color: "#b50b0b",
      },
    };

    // 🟢 4. OPEN RAZORPAY POPUP
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
  console.error("Payment error:", error.response?.data || error.message);
}
};

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border border-gray-300 rounded">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer">
          <ChevronLeft size={20} /> Back
        </button>
        <SummaryStepper />
        <div className="w-12"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 pt-2 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-300 rounded-lg p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-800">Deliver to :</h2>
              <button onClick={() => navigate("/checkout")} className="text-[#b50b0b] cursor-pointer border border-[#b50b0b] px-3 py-1 rounded text-xs font-bold hover:bg-red-50 transition">Change</button>
            </div>
            {address ? (
              <div className="text-[13px] leading-relaxed text-gray-700">
                <p className="font-bold text-gray-900">{address.fullName} <span className="ml-2 bg-[#b50b0b] text-white text-[10px] px-2 py-0.5 rounded">HOME</span></p>
                <p className="mt-1">{address.addressLine1}, {address.addressLine2}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p className="mt-1 font-medium text-gray-900">+91 {address.mobileNumber}</p>
              </div>
            ) : <p className="text-sm text-gray-500">No address selected</p>}
          </div>

          <div className="space-y-4">
            {cart?.items?.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4 relative">
                <div className="flex gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover rounded-lg border border-gray-100" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h2 className="font-bold text-lg text-[#b50b0b]">{item.title}</h2>
                      <button onClick={() => removeItem(item._id)} className="flex cursor-pointer items-center gap-1 text-[#b50b0b] border border-red-100 px-2 py-1 rounded-md text-[10px] font-bold hover:bg-red-50 transition"><Trash2 size={12} /> Remove</button>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2"><p className="text-xl font-black text-black">₹{item.price}</p></div>
                    <div className="mt-3 flex items-center border border-gray-300 rounded overflow-hidden h-7 w-fit">
                      <button onClick={() => updateQuantity(item._id, "dec")} className="w-7 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-[#b50b0b] font-bold border-r border-gray-300">-</button>
                      <div className="w-8 h-full flex items-center justify-center bg-white font-bold text-xs text-[#b50b0b]">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item._id, "inc")} className="w-7 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-[#b50b0b] font-bold border-l border-gray-300">+</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-800"><Truck size={16} className="text-black" /> <span className="text-xs font-medium">Express Delivery</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="font-bold text-lg mb-3 text-gray-800">Total Orders Summary</h2>
            <hr className="mb-6 text-[#808080]" />
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between"><span>MRP</span><span className="text-black">₹{totalOriginalAmount}</span></div>
              <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className="text-black font-bold">₹{delivery_fee}</span></div>
              <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
              <div className="flex justify-between"><span>Discount</span><span className="text-[#b50b0b]">- ₹{discount > 0 ? discount : 0}</span></div>
              <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
              <div className="flex justify-between mt-4">
                    <span>GST ({gstTotal}%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
              <div className="flex justify-between">
                <span>Voucher Discount</span>
                <span className="text-green-600">
                  {appliedVoucher?.type === "complimentary" ? "FREE GIFT 🎁" : `- ₹${voucherDiscount}`}
                </span>
              </div>
              <div className="border-t-2 border-dotted border-gray-300 my-4"></div>
              <div className="flex justify-between items-center"><span>Total Amount</span><span>₹{finalTotal}</span></div>
              <div className="bg-[#e7f6ed] p-3 rounded-lg flex items-center justify-center gap-2">
                <p className="text-[#24a148] text-[12px] font-bold text-center">You'll save ₹{discount + voucherDiscount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border flex items-center justify-between gap-4">
            <p className="font-black text-[#b50b0b]">₹{finalTotal}</p>
            <button onClick={handlePayment} className="bg-[#b50b0b] cursor-pointer text-white py-2 px-6 rounded-lg font-bold text-base hover:bg-[#8e0909] transition-all">Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
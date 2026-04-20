import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetail = ({ productDetails }) => {
  if (!productDetails) return null;

  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate=useNavigate()

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);

    return deliveryDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImgUrl = (img) => (typeof img === "string" ? img : img?.url);

  const handlePrev = () => {
    setSelectedImg((prev) => 
      prev === 0 ? productDetails.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImg((prev) => 
      (prev + 1) % productDetails.images.length
    );
  };
const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    setIsAdding(true); // ✅ start loading

    const res = await axios.post(
      `${BASE_URL}/cart`,
      {
        bookId: productDetails._id,
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      toast.success("Added to cart successfully");
      setIsAdded(true);
      checkProductInCart();
    }

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add to cart"
    );
  } finally {
    setIsAdding(false); // ✅ stop loading
  }
};

const checkProductInCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || !productDetails?._id) return;

    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cartItems = res.data?.data?.items || [];

    const exists = cartItems.some((item) => {
      // handle both populated & non-populated cases
      return (
        item.book === productDetails._id ||
        item.book?._id === productDetails._id
      );
    });

    setIsAdded(exists);

  } catch (error) {
    console.error("Cart check failed:", error);
  }
};
useEffect(() => {
  checkProductInCart();
}, [productDetails]);

  return (
    <div className="w-full bg-white pt-5 mt-8 px-4 lg:px-0">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex gap-2">
        <Link to="/shop" className="hover:text-[#b50b0b] transition-colors">Shop</Link> 
        <span>/</span> 
        <span className="text-[#b50b0b] font-medium capitalize">{productDetails.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        
        {/* LEFT: Image Gallery Section */}
        <div className="flex flex-col justify-between">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group">
            <img
              src={getImgUrl(productDetails.images?.[selectedImg])}
              alt={productDetails.title}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all active:scale-90 z-10"
            >
              <ChevronLeft size={24} className="text-[#b50b0b]" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all active:scale-90 z-10"
            >
              <ChevronRight size={24} className="text-[#b50b0b]" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {productDetails.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImg(index)}
                className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImg === index ? "border-[#b50b0b] scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={getImgUrl(img)} className="w-full h-full object-cover" alt={`Thumbnail ${index}`} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Information Section */}
        <div className="flex flex-col justify-between py-0"> 
          
          {/* TOP SECTION: Title and Features */}
          <div>
            <h1 className="text-3xl font-bold text-[#b50b0b] mb-2 leading-tight">
              {productDetails.title}
            </h1>

            {/* <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400 text-sm">
                {"★".repeat(5)}
              </div>
              <span className="text-xs text-gray-500">
                4.5 <span className="text-[#b50b0b] underline cursor-pointer">(2.2k+)</span> | Trusted by veterinarians
              </span>
            </div> */}

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-black">
                ₹{Number(productDetails.price).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-500 font-medium">(Inclusive of taxes)</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3 text-[15px] font-medium">
              {productDetails.description}
            </p>

            <div className="space-y-3">
              {productDetails.productDetails?.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 bg-[#16a34a] rounded-full p-0.5 shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-tight">
                    <span className="font-bold text-[#b50b0b]">{detail.label}: </span>
                    <span className="text-gray-800 font-medium">{detail.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM SECTION: Aligned with thumbnail bottom edge */}
          <div className="mt-6">
            <div className="flex items-center gap-3 text-gray-600 text-sm mb-3 w-fit">
              <Truck size={20} className="text-[#b50b0b]" />
              <span className="font-medium">
                Deliver by <span className="text-black font-bold">{getDeliveryDate()}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* ✅ UPDATED Quantity Selector to match image_2a9cff.png */}
              <div className="flex items-center border border-[#808080] rounded-lg overflow-hidden h-[48px] w-fit">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center bg-[#eeeeee] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Minus size={20} className="text-[#b50b0b] stroke-[3px]" />
                </button>
                <div className="w-12 h-full flex items-center justify-center bg-[#ffffff] border-x border-gray-200">
                  <span className="text-lg font-bold text-[#b50b0b]">{quantity}</span>
                </div>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center bg-[#eeeeee] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Plus size={20} className="text-[#b50b0b] stroke-[3px]" />
                </button>
              </div>

              {!isAdded ? (
  <button
    onClick={handleAddToCart}
    disabled={isAdding}
    className={`flex-1 min-w-[140px] h-[48px] font-bold rounded-lg transition-all cursor-pointer
      ${isAdding 
        ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
        : "border border-[#b50b0b] text-[#b50b0b]"}
    `}
  >
    {isAdding ? "Adding to cart..." : "Add to Cart"}
  </button>
) : (
  <button
    onClick={() => navigate("/cart")}
    className="flex-1 min-w-[140px] h-[48px] text-[#b50b0b]  font-bold rounded-lg border border-[#b50b0b] cursor-pointer"
  >
    Go to Cart
  </button>
)}

              <button className="flex-1 min-w-[140px] h-[48px] bg-[#b50b0b] text-white font-bold rounded-lg hover:bg-[#8e0909] transition-all shadow-md cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
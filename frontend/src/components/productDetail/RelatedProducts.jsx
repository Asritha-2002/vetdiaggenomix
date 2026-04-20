import React from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  // ✅ PROFESSIONAL EMPTY STATE
  if (!products || products.length === 0) {
    return (
      <div className="py-14">
        <div className="text-center">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <ShoppingBag size={28} className="text-gray-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Related Products Found
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-sm mb-6">
            We couldn’t find similar items. Explore our full collection instead.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/shop")}
            className="bg-[#b50b0b] cursor-pointer text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#8e0909] transition"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  // ✅ NORMAL RELATED PRODUCTS UI
  return (
    <div className="w-full">
     

        {/* Heading */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-black text-center">
          Related Products
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                <img
                  src={item.images?.[0]?.url || item.images?.[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Price */}
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="text-[16px] font-bold text-[#1a1a1a] leading-[1.2] flex-1">
                  {item.title}
                </h3>

                <div className="flex flex-col items-end text-right min-w-[70px]">
                  <div className="flex items-start">
                    <span className="text-[14px] font-bold mt-0.5 mr-1">₹</span>
                    <span className="text-[18px] font-bold tracking-tight">
                      {Number(item.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-gray-600 mb-3">
                Rapid Test Kit
              </p>

              {/* Features */}
              <ul className="space-y-1.5 mb-6 flex-grow">
                {item.productDetails?.slice(0, 3).map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-[12px] text-gray-700"
                  >
                    <span className="text-green-500 font-bold">✔</span>
                    <span className="line-clamp-1">
                      {detail.value || detail.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="flex-grow bg-[#b50b0b] hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
                >
                  View details
                </button>

                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShoppingBag size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
  
  );
};

export default RelatedProducts;
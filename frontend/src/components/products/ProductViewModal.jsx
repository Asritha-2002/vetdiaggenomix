import React, { useState } from "react";
import { X, Star, Package, Box, Check } from "lucide-react";


export default function ProductViewModal({ open, onClose, product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!open || !product) return null;

  const images = product.images || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl relative overflow-y-auto max-h-[90vh]">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="p-6  flex items-stretch gap-3 bg-green-50 shadow-sm">

  {/* ICON - FULL HEIGHT */}
  <div className="flex items-center justify-center self-stretch px-3 bg-green-100 rounded-lg text-green-600">
    <Package className="w-7 h-5" />
  </div>

  {/* TITLE SECTION */}
  <div>
    <h2 className="text-2xl font-bold">{product.title}</h2>
    <p className="text-sm text-gray-500">
      {product.category} • SKU: {product.skuId}
    </p>
  </div>

</div>

        <div className="p-6 space-y-6">

          {/* ================= IMAGE CAROUSEL ================= */}
         <div className="rounded-2xl overflow-hidden bg-gray-100">

  {/* IMAGE CONTAINER */}
<div className="relative w-full h-auto bg-white flex items-center justify-center overflow-hidden rounded-xl">
  <img
    src={images[activeIndex]?.url || images[activeIndex]}
    alt="product"
    className="max-h-full max-w-full object-contain transition duration-300"
  />
</div>

  {/* DOTS */}
  {images.length > 1 && (
    <div className="flex justify-center gap-2 py-3 bg-white">
      {images.map((_, i) => (
        <button
          key={i}
          onClick={() => setActiveIndex(i)}
          className={`h-2 w-2 rounded-full transition ${
            i === activeIndex ? "bg-green-600 w-4" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  )}
</div>

          {/* ================= PRICE SECTION ================= */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
  
  {/* Price */}
  <div>
    <p className="text-sm text-gray-500">Current Price</p>
    <p className="text-2xl font-bold text-green-600">
      ₹{product.price}
    </p>
    {product.originalPrice > product.price && (
      <p className="text-sm line-through text-gray-400">
        ₹{product.originalPrice}
      </p>
    )}
  </div>

  {/* Stock */}
  <div className="text-center">
    <p className="text-sm text-gray-500">Stock Available</p>
    <p className="text-xl font-semibold">{product.stock}</p>
    <p className="text-xs text-green-600">
      {product.stock > 0 ? "In Stock" : "Out of Stock"}
    </p>
  </div>

  {/* Status */}
  <div className="text-center">
    <p className="text-sm text-gray-500 mb-1">Status</p>
    <p
      className={`font-semibold  ${
        product.stock > 0 ? "text-green-600 bg-green-200 rounded-full px-3 py-1" : "text-red-500"
      }`}
    >
      {product.stock > 0 ? "Available" : "Not Available"}
    </p>

    {/* Featured */}
    {product.parentProduct === null && (
  <div className="flex items-center justify-center gap-1 mt-1">
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    <span className="text-xs font-semibold text-yellow-500">
      Featured
    </span>
  </div>
)}
  </div>
</div>

          {/* ================= INFORMATION ================= */}
          <div className="bg-white border border-gray-300 rounded-xl p-4">
            <div className="flex gap-2 items-center mb-3">
                <Box size={16} strokeWidth={1.5} />
                <h3 className="font-semibold">Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p className="flex flex-col">
                <span className="text-gray-500">Category:</span>
                <span className="text-lg font-semibold">{product.category}</span>
              </p>
              <p className="flex flex-col gap-1">
                <span className="text-gray-500">SKU ID:</span>
                {product.skuId}
              </p>
              <p className="flex flex-col gap-1">
                <span className="text-gray-500">Slug:</span>
                {product.slug}
              </p>
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3"># Product Details</h3>

            

<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {(product.productDetails || []).map((d, i) => (
    <div
      key={i}
      className="flex items-start gap-2 bg-white p-3 rounded-lg"
    >
      {/* CHECK ICON */}
      <div className="mt-0.5 flex items-center justify-center w-5 lg:w-8 h-5 bg-green-600 rounded-full">
        <Check className="w-3.5 h-3.5 text-white " />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-[#b50b0b]">{d.label} : </p>
        <p className="text-xs">
          {typeof d.value === "object"
            ? JSON.stringify(d.value)
            : d.value}
        </p>
      </div>
    </div>
  ))}
</div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div className="bg-[#f2f5f3] shadow rounded-xl p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* ================= TAGS (if you have later) ================= */}
          {product.tags?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
import React,{useState} from "react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
/* =========================
   LOCAL PRODUCT UTILS
========================= */
export const CURRENCY_SYMBOL = "₹";

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount))
    return `${CURRENCY_SYMBOL}0`;
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString()}`;
}

export function getStockStatus(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock < 5) return "Low Stock";
  return "In Stock";
}

/* =========================
   COMPONENT
========================= */
export default function ProductCard({
  product,
  allProducts = [],
  onEdit,
  onView,
  onDelete,
}) {
  const isVariant = !!product.parentProduct;

  const stockStatus = getStockStatus(product.stock || 0);

  const stockPercent = Math.min(((product.stock || 0) / 50) * 100, 100);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const handleDeleteConfirm = () => {
  onDelete(selectedProduct); // call parent delete
  toast.success("Product deleted successfully");
  setShowDeleteModal(false);
  setSelectedProduct(null);
};

const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setSelectedProduct(null);
};

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">

      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            product.images?.[0]?.url ||
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* ACTION BUTTONS */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white rounded-full text-blue-600 shadow hover:scale-110 transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onView(product)}   // ✅ THIS triggers VIEW (separate modal)
            className="p-2 bg-white rounded-full text-green-600 shadow hover:scale-110 transition"
            title="View"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => {
  setSelectedProduct(product);
  setShowDeleteModal(true);
}}
            className="p-2 bg-white rounded-full text-red-600 shadow hover:scale-110 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* ✅ FEATURED BADGE (ONLY FOR MAIN PRODUCT) */}
        {!isVariant && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            Featured
          </div>
        )}

        {/* ✅ LOW STOCK BADGE */}
        {stockStatus === "Low Stock" && (
          <div className="absolute top-2 right-2 px-3 py-1 text-xs text-white rounded-full font-semibold shadow-md bg-red-500 low-stock-animate">
            Low Stock ({product.stock || 0})
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-xs mt-1 text-gray-500 uppercase">
          {product.category}
        </p>

        {/* PRICING */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </p>

            {product.originalPrice &&
              product.originalPrice > product.price && (
                <p className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </p>
              )}
          </div>

          {/* STOCK BAR */}
          <div className="text-right">
            <p className="text-xs text-gray-600">
              Stock: {product.stock || 0}
            </p>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
              <div
                className="h-1.5 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${stockPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
      
      <h2 className="text-lg font-semibold text-gray-800">
        Delete Product
      </h2>

      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete{" "}
        <span className="font-medium">
          {selectedProduct?.title}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleCancelDelete}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          No
        </button>

        <button
          onClick={handleDeleteConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* 🔥 LOW STOCK ANIMATION */}
      <style>{`
        @keyframes lowStockPulse {
          0% {
            background-color: #ef4444;
          }
          50% {
            background-color: #b91c1c;
          }
          100% {
            background-color: #ef4444;
          }
        }

        .low-stock-animate {
          animation: lowStockPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
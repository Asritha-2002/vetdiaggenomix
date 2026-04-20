import React from "react";
import { X, Pencil, Star, Package, Box } from "lucide-react";

/* =========================
   UTILS
========================= */
const cn = (...classes) => classes.filter(Boolean).join(" ");

const CURRENCY_SYMBOL = "₹";

function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount))
    return `${CURRENCY_SYMBOL}0`;
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString()}`;
}

function getStockStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", color: "red" };
  if (stock < 5) return { label: "Low Stock", color: "orange" };
  if (stock <= 20) return { label: "Medium Stock", color: "yellow" };
  return { label: "In Stock", color: "green" };
}

/* =========================
   UI COMPONENTS (INLINE)
========================= */

const Button = ({ children, className = "", variant, ...props }) => {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50";

  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-300 hover:bg-gray-100",
  };

  return (
    <button
      className={cn(base, variants[variant || "default"], className)}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
};

/* =========================
   COMPONENT
========================= */
export default function ProductDetailsModal({
  open,
  onClose,
  product,
  allProducts = [],
  onEdit,
}) {
  if (!open || !product) return null;

  // ✅ FIXED FIELD
  const isVariant = !!product.parentProduct;

  const parentProduct = isVariant
    ? allProducts.find((p) => p._id === product.parentProduct)
    : null;

  const variants = allProducts.filter(
    (p) => p.parentProduct === product._id
  );

  const stockStatus = getStockStatus(product.stock || 0);

  const stockColorMap = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    yellow: "bg-yellow-400 text-black",
    green: "bg-green-500 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-xs text-gray-500">
                {product.category}{" "}
                {product.skuId ? `| SKU: ${product.skuId}` : ""}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[80vh] grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* IMAGE */}
          <div>
            <img
              src={
                product.images?.[0]?.url ||
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
              }
              alt={product.title}
              className="w-full h-72 object-cover rounded-xl border"
            />
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-2 space-y-5">

            {/* ✅ VARIANT INFO */}
            {isVariant && parentProduct && (
              <div className="bg-blue-50 p-4 rounded-xl text-sm">
                <span className="font-semibold text-gray-600">
                  Parent Product:
                </span>{" "}
                {parentProduct.title}
              </div>
            )}

            {/* ✅ VARIANTS LIST */}
            {!isVariant && variants.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-xl text-sm">
                <p className="font-semibold mb-2">Variants:</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <Badge key={v._id} className="bg-gray-200 text-gray-700">
                      {v.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">

              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}
                </p>

                {product.originalPrice > product.price && (
                  <p className="text-xs line-through text-gray-400">
                    {formatCurrency(product.originalPrice)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p className="text-lg font-bold">
                  {product.stock || 0}
                </p>

                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    stockColorMap[stockStatus.color]
                  )}
                >
                  {stockStatus.label}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>

                <Badge
                  className={
                    product.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {product.stock > 0 ? "Available" : "Unavailable"}
                </Badge>

                {product.featured && (
                  <div className="flex items-center gap-1 mt-2 text-yellow-600 text-xs">
                    <Star className="w-3 h-3" /> Featured
                  </div>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Info
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <p>
                  <span className="text-gray-500">Category:</span>{" "}
                  {product.category}
                </p>
                <p>
                  <span className="text-gray-500">Slug:</span>{" "}
                  {product.slug}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => onEdit(product)} className="flex-1">
                <Pencil className="w-4 h-4 mr-2 inline" />
                Edit
              </Button>

              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
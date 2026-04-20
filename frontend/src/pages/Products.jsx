import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import ProductFormModal from "../components/products/ProductFormModal";
import StatsCards from "../components/products/StatsCards";
import FilterBar from "../components/products/FilterBar";
import ProductCard from "../components/products/ProductCard";
// import OrderPagination from "../components/orders/OrderPagination";
import OrderPagination from "../components/appointments/OrderPagination";
import ProductViewModal from "../components/products/ProductViewModal";
import { FaExclamationTriangle } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export default function Products() {
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewModalOpen, setViewModalOpen] = useState(false);
const [viewProduct, setViewProduct] = useState(null);

  // modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mode, setMode] = useState("add");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
 const fetchProducts = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      setProducts(res.data.data);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch products");
  }
  finally {
    setLoading(false);
  }
};
const categories = [...new Set(products.map((p) => p.category))];

useEffect(() => {
  fetchProducts();
}, []);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, sortBy]);

  /* ================= SAVE ================= */
  const handleSave = async (newProduct) => {
  setProducts(prev => [newProduct, ...prev]); // instant UI
  await fetchProducts(); // sync with backend
};

  /* ================= MODALS ================= */
const openAddModal = () => {
  setSelectedProduct(null);   // IMPORTANT
  setMode("add");
  setOpenModal(true);
};

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setMode("edit");
    setOpenModal(true);
  };

  const openViewModal = (product) => {
  setViewProduct(product);
  setViewModalOpen(true);
};

  /* ================= FILTER + SORT ================= */
  const filteredProducts = products
    .filter((p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      categoryFilter === "all" ? true : p.category === categoryFilter
    )
    .filter((p) => {
      if (stockFilter === "all") return true;
      if (stockFilter === "low") return p.stock < 5;
      if (stockFilter === "medium")
        return p.stock >= 5 && p.stock <= 20;
      if (stockFilter === "high") return p.stock > 20;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "title")
        return a.title.localeCompare(b.title);
      return 0;
    });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = async (product) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${BASE_URL}/books/${product._id || product.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Product deleted successfully");

    // remove from UI instantly (no need full refetch)
    setProducts((prev) =>
      prev.filter((p) => p._id !== product._id)
    );
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete product");
  }
};


 if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

    if (error) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>
    
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unable to Load Vouchers
              </h2>
    
              <p className="text-gray-500 mb-6">{error}</p>
    
              <button
                onClick={fetchProducts}
                className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }

  /* ================= UI ================= */
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between p-6 items-center mb-6 bg-white">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-gray-500 text-sm">
            Manage your product inventory and catalog
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* STATS + FILTERS */}
      <div className="px-6">
        <StatsCards products={products} />

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          stockFilter={stockFilter}
          onStockChange={setStockFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* MODAL */}
      <ProductFormModal
        open={openModal}
        onClose={() => {
  setOpenModal(false);
  setSelectedProduct(null);
}}
        product={selectedProduct}
        mode={mode}
        onSave={handleSave}
        parentProducts={products.filter(p => !p.parentProduct)}
      />
      <ProductViewModal
  open={viewModalOpen}
  onClose={() => {
    setViewModalOpen(false);
    setViewProduct(null);
  }}
  product={viewProduct}
/>

      {/* PRODUCT LIST */}
      <div className="p-6 bg-white ml-3 mr-3 rounded-3xl border border-gray-100">
        <h2 className="text-lg font-bold mb-3">
          Products Catalog
        </h2>

        <hr className="border-gray-200 -mx-6 my-3" />

        {paginatedProducts.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProducts.map((p, index) => (
              <ProductCard
                key={p._id || p.id}
                product={p}
                allProducts={products}
                index={index}
                onEdit={openEditModal}
                onView={openViewModal}
                onCreateVariant={(product) =>
                  console.log("Variant:", product)
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-6">
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalOrders={filteredProducts.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
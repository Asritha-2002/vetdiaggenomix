import React, { useEffect, useState } from "react";
import axios from "axios";

import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";

import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";
import ShopHero from "./shop/ShopHero";
import ShopProducts from "./shop/ShopProducts";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(res.data.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* ✅ HERO (UNCHANGED as you asked) */}
      <ShopHero />

      {/* ✅ MAIN CONTENT WRAPPER */}
      <div className="relative w-full overflow-hidden">
            {/* Background Image */}
            <img
              src={bg}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
        
        {/* White container for premium look */}
        <div className="max-w-7xl mx-auto bg-white shadow-sm px-4 py-8">

          {/* Heading */}
          <h2 className="text-2xl lg:text-3xl font-bold text-black text-center">
              Our Collection
            </h2>

            <p className="text-sm text-gray-500 text-end">
              {products.length} Products
            </p>
          <div className="mb-6 flex justify-between items-center">
            
          </div>

          {/* ✅ Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* ✅ Empty State */
            <div className="text-center py-20">
              <h3 className="text-lg font-semibold text-gray-700">
                No products found
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Please check back later
              </p>
            </div>
          ) : (
            /* ✅ PRODUCTS */
            <ShopProducts products={products} />
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
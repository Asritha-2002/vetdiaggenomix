import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductDetail from "../components/productDetail/ProductDetail";
import RelatedProducts from "../components/productDetail/RelatedProducts";
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [productRes, relatedRes] = await Promise.all([
          axios.get(`${BASE_URL}/books/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/books/related/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (productRes.data.success) {
          setProduct(productRes.data.data);
        }

        if (relatedRes.data.success) {
          setRelatedProducts(relatedRes.data.data);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ✅ Loading
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-4 bg-gray-200 w-full rounded"></div>
              <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center">
          <div>
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="">
      <Navbar />

      {/* ✅ MAIN WRAPPER */}
      <div className="pt-5">

        {/* ✅ PRODUCT DETAIL */}
        <div className="bg-white p-4 lg:p-8 relative z-0">
          <ProductDetail productDetails={product} />
        </div>

        {/* ✅ RELATED PRODUCTS WITH BACKGROUND */}
        <div className="relative mt-6 lg:mt-3 rounded-2xl overflow-hidden">

          {/* Background */}
          <img
            src={bg}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover opacity-10 z-0 pointer-events-none"
          />

          {/* Content */}
          <div className="relative z-10 p-4 lg:p-6">
            <RelatedProducts products={relatedProducts} />
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
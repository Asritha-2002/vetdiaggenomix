// pages/checkout/CheckoutLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar";
import Footer from "../Footer";

const CheckoutLayout = () => {
  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-white mt-18 lg:mt-24">
        {/* All checkout pages render here */}
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutLayout;
import React, { memo } from "react";
import hero from "../../assets/shop/hero.png"
import arrow from "../../assets/about/arrow.png";
import { NavLink } from "react-router-dom";


const ShopHero = () => {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] mt-15 lg:mt-20 py-8 overflow-hidden isolate">

      {/* HERO IMAGE (SAFE STACKING FIX) */}
      <img
        src={hero}
        alt="About Hero"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* CONTENT */}
      <div className="relative z-10 w-full pb-5 md:w-1/2 h-full flex flex-col gap-2 justify-center lg:pl-24 lg:pb-0 ml-2 items-start">

        <h1 className="text-3xl lg:text-4xl font-bold text-[#b50b0b]">
          VetDiag Shop – Precision Diagnostics at Your Fingertips
        </h1>

        <p className="text-md md:text-lg">
Explore VetDiag Genomix’s advanced diagnostic kits and services for fast, accurate animal health insights—helping veterinarians, farmers, and pet owners improve care and productivity.        </p>

        <p className="text-md md:text-lg font-bold">
          Trusted by Veterinarians
        </p>

        <NavLink
          to="/contact"
          className="flex items-center gap-3 bg-[#b50b0b] text-white px-8 py-2 rounded-md cursor-pointer mb-4"
        >
          Browse Diagnostic Kits 
          <img
            src={arrow}
            alt="arrow"
            width="12"
            height="12"
            className="w-3 h-3 mt-1"
          />
        </NavLink>
      </div>

      

    </div>
  );
}

export default ShopHero
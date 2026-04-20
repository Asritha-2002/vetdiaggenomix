import React, { memo } from "react";
import homehero from "../../assets/home/home-hero.png";
import { NavLink } from "react-router-dom";
import star1 from "../../assets/home/star 2.png";
import star2 from "../../assets/home/star 3.png";
import star3 from "../../assets/home/star 4.png";
import star4 from "../../assets/home/star 5.png";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] py-8 overflow-hidden antialiased">

      {/* BACKGROUND IMAGE */}
      <img
        src={homehero}
        alt="Veterinary Hero"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-4 py-10 flex flex-col justify-center items-center gap-3 h-[500px] lg:flex-row relative w-full lg:items-center lg:mt-12 justify-around z-10">

        {/* LEFT */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center gap-3 lg:gap-5 lg:ml-[40px]">
          <h1 className="text-white text-lg md:text-3xl lg:text-2xl font-bold lg:max-w-md">
            VETERINARY DIAGNOSTICS LABORATORY
          </h1>

          <p className="text-white">
            Modern laboratory diagnostics delivering accuracy, speed, and
            quality care for animals.
          </p>

          <div className="w-full md:w-1/2 flex flex-col lg:flex-row gap-4">
            <NavLink
              to="/book-appointment"
              className="bg-[#b50b0b] text-white px-6 py-2 rounded text-center md:whitespace-nowrap"
            >
              Book Appointment
            </NavLink>

            <button className="text-[#b50b0b] bg-white px-4 py-2 rounded cursor:pointer font-bold md:whitespace-nowrap">
              Book A Rapid Test Kit
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex flex-col lg:items-center lg:justify-center gap-5 mt-3">
          <p className="text-white">Trust and Cerified by</p>

          <div className="flex gap-4">
            <img src={star1} alt="trusted-icon" className="w-[60px]" />
            <img src={star2} alt="trusted-icon" className="w-[60px]" />
            <img src={star3} alt="trusted-icon" className="w-[60px]" />
            <img src={star4} alt="trusted-icon" className="w-[60px]" />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default memo(HeroSection);
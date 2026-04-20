import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import hero3 from "../../assets/home/Rectangle 22.png";
import hero4 from "../../assets/home/image 30.png";

const AppointmentCTA = () => {
  return (
    <div className="relative w-full h-auto py-10 overflow-hidden antialiased">

      {/* BACKGROUND */}
      <img
        src={hero3}
        alt="background"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      <div className="relative text-white flex flex-wrap justify-center items-center gap-10 py-10">

        {/* MAIN IMAGE */}
        <img
          src={hero4}
          alt="appointment"
          decoding="async"
          loading="lazy"
          width="320"
          height="320"
          className="w-[320px]"
        />

        {/* CONTENT */}
        <div className="flex flex-col gap-3 mx-3 items-center lg:w-1/3 justify-center md:items-start">

          <h3 className="text-2xl md:text-4xl font-bold text-center lg:text-left">
            Book a Appointment with Vetdiag Genomix
          </h3>

          <p>“Accurate • Reliable • Veterinarian Trusted”</p>

          <p>
            Schedule diagnostic testing for your pet with our expert
            veterinary laboratory team fast, accurate, and reliable results.
          </p>

          <NavLink
            to="/book-appointment"
            className="bg-white text-[#b50b0b] rounded py-2 px-5 whitespace-nowrap font-semibold"
          >
            Book Appointment
          </NavLink>

        </div>

      </div>
    </div>
  );
};

export default memo(AppointmentCTA);
import React, { memo, useMemo } from "react";
import hero2 from "../../assets/hero-sections-contact/contactsectionbgc-1.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import specialServices from "../../data/specialServices.js";

const SpecialServices = () => {

  // prevent unnecessary recalculation on re-render
  const services = useMemo(() => specialServices, []);

  return (
    <div className="relative w-full h-auto flex py-10 overflow-hidden antialiased">

      {/* BACKGROUND */}
      <img
        src={hero2}
        alt="background"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      <div className="flex flex-col gap-4 items-center justify-center relative z-10">

        {/* HEADING */}
        <div className="flex gap-2 items-center justify-center">
          <img
            src={titleimg2}
            alt="section icon"
            decoding="async"
            className="w-5 h-5 mt-2"
          />

          <h2 className="text-2xl md:text-4xl font-bold">
            <span className="text-[#b50b0b]">Our</span> Special Services
          </h2>

          <img
            src={titleimg2}
            alt="section icon"
            decoding="async"
            className="w-5 h-5 mt-2"
          />
        </div>

        <h4 className="text-xl lg:text-3xl font-semibold text-center max-w-xl mx-auto">
          Comprehensive Animal Health Testing Solutions
        </h4>

        {/* CARDS */}
        <div className="max-w-8xl mx-auto px-4 flex flex-wrap justify-center gap-6">

          {services.map((item) => (
            <div
              key={item.id}
              className="w-[300px] bg-white rounded-xl shadow-md overflow-hidden relative"
            >

              {/* IMAGE */}
              <div className="relative p-4">
                <img
                  src={item.image}
                  alt={item.title}
                  decoding="async"
                  loading="lazy"
                  className="w-full h-[180px] object-cover rounded-lg"
                />

                {/* TOP RIGHT LOGO */}
                <div className="absolute top-5 right-5">
                  <img
                    src={item.logo}
                    alt={`${item.title} logo`}
                    decoding="async"
                    loading="lazy"
                    className="w-10 h-10"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 relative">
                <h3 className="text-md font-bold text-[#b50b0b] mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {item.description}
                </p>

                {/* BOTTOM RIGHT ICON */}
                <img
                  src={item.placeholderImage}
                  alt="service icon"
                  decoding="async"
                  loading="lazy"
                  className="absolute bottom-0 right-0 w-[60px] h-[60px]"
                />
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default memo(SpecialServices);
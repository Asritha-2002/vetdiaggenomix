import React, { memo } from "react";
import hero2 from "../../assets/hero-sections-contact/contactsectionbgc-1.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import secsecimg from "../../assets/home/secsecimg.png";
import secsec from "../../assets/home/secsec.png";

const WhoWeAre = () => {
  return (
    <div className="relative w-full h-auto py-8 overflow-hidden antialiased">

      {/* BACKGROUND IMAGE */}
      <img
        src={hero2}
        alt="background"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* TITLE */}
        <div className="flex gap-4 items-center justify-center">
          <img src={titleimg2} alt="left-logo" className="w-5 h-5 mt-2" />
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-[#b50b0b]">Who</span> We Are
          </h2>
          <img src={titleimg2} alt="right-logo" className="w-5 h-5 mt-2" />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mt-10 px-4">

          {/* IMAGE */}
          <img
            src={secsecimg}
            alt="testtubeimage"
            decoding="async"
            loading="lazy"
            className="w-[400px] lg:w-[480px]"
          />

          {/* TEXT CONTENT */}
          <div className="max-w-lg text-center lg:text-left">

            <h4 className="font-semibold mb-3 text-xl lg:text-xl">
              Welcome to{" "}
              <span className="text-[#b50b0b]">VetDiag Genomix</span>,
              dedicated to providing accurate and advanced molecular
              diagnostic services.
            </h4>

            <p className="mb-4 text-xs">
              At VetDiag Genomix, we believe that precision diagnostics
              empower veterinary professionals to make informed decisions. We
              connect directly with veterinarians and pet owners to deliver
              accurate molecular diagnostic results when animal health matters
              most. We care about our team of experts and are committed to
              excellence in veterinary molecular testing.
            </p>

            {/* POINTS */}
            <div className="space-y-3 flex flex-col items-center lg:items-start">

              <div className="flex items-center gap-2 bg-[#eef7ff] p-3 w-[300px] rounded-md">
                <img src={secsec} alt="" className="w-[20px] md:w-[30px]" />
                <p className="text-xs md:text-md font-semibold">
                  Advanced Molecular Diagnostics
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#eef7ff] p-3 w-[300px] rounded-md">
                <img src={secsec} alt="" className="w-[20px] md:w-[30px]" />
                <p className="text-xs md:text-md font-semibold">
                  Rapid PCR & Genetic Testing
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#eef7ff] p-3 w-[300px] rounded-md">
                <img src={secsec} alt="" className="w-[20px] md:w-[30px]" />
                <p className="text-xs md:text-md font-semibold">
                  Comprehensive Animal Health Panels
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default memo(WhoWeAre);
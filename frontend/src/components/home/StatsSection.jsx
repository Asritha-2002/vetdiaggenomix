import React, { memo } from "react";
import hero2 from "../../assets/hero-sections-contact/contactsectionbgc-1.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import image1 from "../../assets/home/image 4.png";
import image2 from "../../assets/home/image 5.png";
import image3 from "../../assets/home/image 6.png";
import image4 from "../../assets/home/image 7.png";
import p1 from "../../assets/home/01 1.png";
import p2 from "../../assets/home/01 2.png";
import p3 from "../../assets/home/01 3.png";
import p4 from "../../assets/home/01 4.png";
import p5 from "../../assets/home/01 5.png";
import p6 from "../../assets/home/01 6.png";
import p7 from "../../assets/home/01 7.png";

const StatsSection = () => {
  return (
    <div className="relative w-full h-auto pb-10 overflow-hidden antialiased">

      {/* BACKGROUND */}
      <img
        src={hero2}
        alt="background"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      {/* STATS */}
      <div className="relative z-10 flex flex-wrap gap-5 items-center justify-center mt-10 w-full">

        <div className="flex flex-col items-center justify-center bg-white p-6 w-[200px] shadow-md rounded-lg">
          <img src={image1} alt="customers" decoding="async" loading="lazy" className="w-[100px]" />
          <h3>
            <span className="text-2xl lg:text-3xl text-[#b50b0b] font-semibold">1000</span>
            <sup className="text-xl text-[#898888]">+</sup>
          </h3>
          <p className="font-bold">Happy Customers</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 w-[200px]">
          <img src={image2} alt="experience" decoding="async" loading="lazy" className="w-[100px]" />
          <h3>
            <span className="text-2xl lg:text-3xl text-[#b50b0b] font-semibold">1</span>
            <sup className="text-lg text-[#898888]">Years +</sup>
          </h3>
          <p className="font-bold">Experience</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 w-[200px]">
          <img src={image3} alt="pets served" decoding="async" loading="lazy" className="w-[100px]" />
          <h3>
            <span className="text-2xl lg:text-3xl text-[#b50b0b] font-semibold">100</span>
            <sup className="text-xl text-[#898888]">+</sup>
          </h3>
          <p className="font-bold">Pets Served</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-6 w-[200px]">
          <img src={image4} alt="support" decoding="async" loading="lazy" className="w-[100px]" />
          <h3>
            <span className="text-2xl lg:text-3xl text-[#b50b0b] font-semibold">2</span>
            <sup className="text-xl text-[#898888]">hrs</sup>
          </h3>
          <p className="font-bold">Service Support</p>
        </div>

      </div>

      {/* NETWORK SECTION */}
      <div className="relative z-10 flex flex-col gap-4 items-center justify-center mt-5">

        <div className="flex gap-4 items-center justify-center mt-5">
          <img src={titleimg2} alt="icon" decoding="async" loading="lazy" className="w-5 h-5" />

          <h3 className="text-3xl md:text-4xl font-bold">
            <span className="text-[#b50b0b]">Our</span> Network
          </h3>

          <img src={titleimg2} alt="icon" decoding="async" loading="lazy" className="w-5 h-5" />
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold">
          Collaborative Partners
        </h2>

        <p className="text-center md:text-left">
          We work closely with leading veterinary institutions and partners to
          advance animal health
        </p>

        {/* PARTNERS */}
        <div className="flex flex-wrap gap-5 items-center justify-center">

          <img src={p1} alt="partner" decoding="async" loading="lazy" className="w-[200px] h-[100px]" />
          <img src={p2} alt="partner" decoding="async" loading="lazy" className="w-[130px] h-[150px]" />
          <img src={p3} alt="partner" decoding="async" loading="lazy" className="w-[160px] h-[150px]" />
          <img src={p4} alt="partner" decoding="async" loading="lazy" className="w-[150px] h-[120px]" />
          <img src={p5} alt="partner" decoding="async" loading="lazy" className="w-[150px] h-[120px]" />
          <img src={p6} alt="partner" decoding="async" loading="lazy" className="w-[150px] h-[120px]" />
          <img src={p7} alt="partner" decoding="async" loading="lazy" className="w-[150px] h-[120px]" />

        </div>
      </div>
    </div>
  );
};

export default memo(StatsSection);
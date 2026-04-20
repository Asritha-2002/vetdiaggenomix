import React, { memo } from "react";
import logo from "../../assets/footer/footer-logo.png";
import experts from "../../assets/about/Rectangle 125.png";
import circle from "../../assets/about/circle.png";
import p1 from "../../assets/about/e1.png";
import p2 from "../../assets/about/e2.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Experts = () => {
  return (
    <div
      className="
        flex flex-col gap-4 py-10
        will-change-transform
        transform-gpu
        contain-layout contain-paint
      "
    >
      {/* Heading */}
      <div className="flex gap-4 items-center justify-center">
        <img
          src={titleimg2}
          alt="logo"
          width="20"
          height="20"
          loading="lazy"
          decoding="async"
          className="mt-1 lg:mt-2"
        />

        <h2 className="text-2xl md:text-4xl font-bold">
          <span className="text-[#b50b0b]">Meet</span> Our Experts
        </h2>

        <img
          src={titleimg2}
          alt="logo"
          width="20"
          height="20"
          loading="lazy"
          decoding="async"
          className="mt-1 lg:mt-2"
        />
      </div>

      {/* Banner */}
      <div className="relative w-full py-8 overflow-hidden">
        <div className="relative flex flex-col items-center">
          <img
            src={logo}
            alt="logo"
            loading="lazy"
            decoding="async"
            className="w-[300px] md:w-[400px] lg:w-[500px]"
          />

          <img
            src={experts}
            alt="experts"
            loading="lazy"
            decoding="async"
            className="w-[300px] md:w-[500px] lg:w-[700px] -mt-10 md:-mt-16"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="w-full pt-28 flex flex-wrap justify-center gap-24">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="
              relative flex flex-col items-center
              transform-gpu
              will-change-transform
            "
          >
            {/* connector line */}
            <div className="absolute -top-28">
              <div className="w-[2px] h-28 border-l-2 border-dashed border-gray-300" />
            </div>

            {/* card */}
            <div
              className="
                relative w-[300px] pt-20 pb-6 px-6 text-center rounded-2xl
                bg-gradient-to-b from-[#f3f3f3] to-[#e9e9e9]
                shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                border-b-[3px] border-[#b50b0b]
                transform-gpu
                will-change-transform
              "
            >
              <img
                src={circle}
                alt=""
                decoding="async"
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-10"
              />

              <img
                src={logo}
                alt=""
                decoding="async"
                className="absolute top-4 left-4 w-[85px]"
              />

              <img
                src={index === 0 ? p1 : p2}
                alt="expert"
                decoding="async"
                className="
                  absolute top-6 left-1/2 -translate-x-1/2
                  w-28 h-28 rounded-full border-[5px] border-red-600
                  object-cover bg-white
                  transform-gpu
                "
              />

              <h3 className="text-[#b50b0b] font-bold text-lg mt-16">
                {index === 0 ? "Dr. G. Mohana Sheela" : "S. Dileep Kumar"}
              </h3>

              <p className="font-semibold">
                {index === 0 ? "Founder - Vetdiag" : "Co-Founder - Vetdiag"}
              </p>

              <div className="w-20 h-[1px] bg-[#b50b0b] mx-auto my-3" />

              <p className="text-sm h-[80px]">
                {index === 0
                  ? "M.Sc, Ph.D Microbiologist & Biotechnologist Managing Director & Founder"
                  : "DAM, BFA Multimedia Specialist Director & Digital Media Head"}
              </p>

              <div className="flex gap-4 justify-center">
                <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                  <FaFacebookF />
                </div>
                <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                  <FaTwitter />
                </div>
                <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                  <FaInstagram />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Experts);
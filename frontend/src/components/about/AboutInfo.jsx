import React, { memo, useMemo } from "react";
import hero2 from "../../assets/hero-sections-contact/contactsectionbgc-1.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import sec2 from "../../assets/about/sec2.png";
import sec3 from "../../assets/about/sec2-2.png";

const AboutInfo = () => {
  // stabilize asset references (prevents reallocation per render)
  const bg = useMemo(() => hero2, []);
  const icon = useMemo(() => titleimg2, []);
  const img1 = useMemo(() => sec2, []);
  const img2 = useMemo(() => sec3, []);

  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="relative w-full h-auto bg-cover bg-center flex py-10 will-change-transform"
    >
      <div className="flex flex-col gap-5 h-auto w-full items-center relative z-10">

        {/* Heading */}
        <div className="flex gap-4 md:items-center justify-center">

          <img
            src={icon}
            alt="section icon"
            loading="lazy"
            decoding="async"
            width="20"
            height="20"
            className="w-5 h-5 mt-1 md:mt-2"
          />

          <h2 className="text-xl md:text-4xl font-bold">
            <span className="text-[#b50b0b]">About</span> Vetdiag Genomix
          </h2>

          <img
            src={icon}
            alt="section icon"
            loading="lazy"
            decoding="async"
            width="20"
            height="20"
            className="w-5 h-5 mt-1 md:mt-2"
          />
        </div>

        {/* Section 1 */}
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 md:gap-10 lg:gap-16">

            {/* LEFT CONTENT */}
            <div className="w-full lg:w-1/2 md:text-left">

              <p className="mb-4">
                VetDiag Genomix Pvt Ltd is an innovative veterinary diagnostics startup using advanced molecular technologies to deliver faster, more accurate disease detection...
              </p>

              <ul className="list-disc pl-8 space-y-2 marker:text-[#b50b0b]">
                <li>
                  <span className="font-semibold text-[#b50b0b]">Molecular Diagnostics:</span>{" "}
                  Utilizing cutting-edge molecular techniques for accurate disease diagnosis.
                </li>
                <li>
                  <span className="font-semibold text-[#b50b0b]">Pathology Services:</span>{" "}
                  Comprehensive pathological examinations and consultations
                </li>
                <li>
                  <span className="font-semibold text-[#b50b0b]">Immunodiagnostics:</span>{" "}
                  Advanced immunoassay tests for various animal diseases.
                </li>
                <li>
                  <span className="font-semibold text-[#b50b0b]">Genetic Testing:</span>{" "}
                  Genetic screening and testing for hereditary conditions and traits.
                </li>
                <li>
                  <span className="font-semibold text-[#b50b0b]">Microbiology:</span>{" "}
                  Bacterial, viral, and fungal culture and sensitivity testing.
                </li>
              </ul>

            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={img1}
                alt="veterinary diagnostics lab"
                loading="lazy"
                decoding="async"
                width="400"
                height="330"
                className=" lg:h-[330px] lg:w-[400px] transform-gpu"
              />
            </div>

          </div>
        </div>

        {/* Section 2 */}
        <div className="max-w-7xl mx-auto px-4 py-2">

          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 md:gap-10 lg:gap-16">

            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={img2}
                alt="laboratory analysis process"
                loading="lazy"
                decoding="async"
                width="400"
                height="330"
                className="lg:w-full w-[400px] lg:h-[330px] transform-gpu"
              />
            </div>

            <div className="w-full lg:w-1/2 text-left flex flex-col gap-4">

              <div>
                <h3 className="text-2xl lg:text-2xl text-[#b50b0b] font-bold mb-2">
                  Our Mission
                </h3>
                <p>
                 We harness molecular science to support animal welfare by delivering precise diagnostic answers for veterinary health challenges. From advanced PCR testing to comprehensive hematology panels, we equip veterinarians with accurate data for optimal companion animal care.
                </p>
              </div>

              <div>
                <h3 className="text-2xl lg:text-2xl text-[#b50b0b] font-bold mb-2">
                  Our Vision
                </h3>
                <p>
                  Our mission is to support veterinarians with reliable, cutting-edge diagnostic solutions for early infection detection, accurate identification of pathogens and genetic conditions, and informed clinical decisions. Through advanced molecular diagnostics, we also help address antimicrobial resistance and improve animal health outcomes.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(AboutInfo);
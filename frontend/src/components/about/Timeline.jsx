import React from "react";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import flag from "../../assets/about/Vector (3).png";
import microscope from "../../assets/about/Microscope.png";
import iso from "../../assets/about/iso.png";
import labicon from "../../assets/about/Rectangle 165.png";
import india from "../../assets/about/india.png";


const Timeline = () => {
  return (
    <section className="py-8 overflow-hidden">
            {/* Header Section */}
            <div className="flex gap-2 lg:gap-2 items-center justify-center pb-15">
              <img
                src={titleimg2}
                alt="logo"
                className=" w-3 h-3 lg:w-5 lg:h-5"
              />
              <h2 className="text-xl md:text-4xl font-bold">
                <span className="text-[#b50b0b]">Showcasing</span> Our
                Milestones
              </h2>
              <img
                src={titleimg2}
                alt="logo"
                className=" w-3 h-3 lg:w-5 lg:h-5"
              />
            </div>

            {/* Timeline Container */}
            <div className="relative max-w-9xl mx-auto px-4 py-5">
              {/* Center Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#e50e0e] transform -translate-x-1/2"></div>

              <div className="flex flex-col gap-5">
                {/* 2021 - Left Content Item */}
                <div className="relative flex items-start w-full">
                  {/* LEFT SIDE: Text and Connector */}
                  <div className="w-1/2 relative flex justify-end pr-0">
                    {/* Text Group: Positioned on the far left */}
                    <div className="flex flex-col items-start text-left max-w-[280px]">
                      <span className="text-[#e50e0e] font-bold text-lg md:text-2xl leading-none">
                        2021
                      </span>
                      <h4 className="font-bold text-gray-900 text-md mt-2">
                        Founded VetDiag Genomix
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Launched our venture dedicated to advancing veterinary
                        diagnostics through molecular science.
                      </p>
                    </div>

                    {/* Horizontal Line: Starts from the Year and goes to the Center Dot */}
                    {/* We use absolute to ensure it doesn't push the text box */}
                    <div className="absolute right-0 top-[14px] flex items-center">
                      {/* Dot */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full"></div>

                      {/* Bar */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[60px] md:w-[100px]"></div>
                    </div>
                  </div>

                  {/* CENTER DOT: Aligned to the line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-4"></div>

                  {/* RIGHT SIDE: Icon */}
                  <div className="w-1/2 pl-3">
                    <img
                      src={flag}
                      className="w-10 h-10 object-contain"
                      alt="icon"
                    />
                  </div>
                </div>

                {/* 2022 - Right Side */}
                <div className="relative flex items-start w-full">
                  <div className="w-1/2 flex justify-end pr-3">
                    <img
                      src={microscope}
                      className="w-12 h-12 object-contain"
                      alt="icon"
                    />
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-3"></div>

                  <div className="w-1/2 flex flex-col items-start">
                    {/* LINE + YEAR */}
                    <div className="flex items-center w-full">
                      {/* LINE */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[100px]"></div>

                      {/* DOT at the end of the line */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full -ml-[1px]"></div>

                      {/* YEAR */}
                      <span className="ml-3 text-[#e50e0e] font-bold text-lg md:text-2xl">
                        2022
                      </span>
                    </div>
                    <div className="flex flex-col ml-[10px] md:ml-[100px] max-w-[260px]">
                      <h4 className="font-bold text-gray-900 text-md">
                        First Molecular Lab Setup
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Established our state-of-the-art molecular diagnostics laboraory.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 2023- left side*/}
                <div className="relative flex items-start w-full">
                  {/* LEFT SIDE: Text and Connector */}
                  <div className="w-1/2 relative flex justify-end pr-0">
                    {/* Text Group: Positioned on the far left */}
                   <div className="flex flex-col items-start text-left max-w-[280px]">
                      <span className="text-[#e50e0e] font-bold text-lg md:text-2xl leading-none">
                        2023
                      </span>
                      <h4 className="font-bold text-gray-900 text-md mt-2">
                        ISO 9001 Certification
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Achieved ISO 9001:2015 Certification for quality
                        management system.
                      </p>
                    </div>

                    {/* Horizontal Line: Starts from the Year and goes to the Center Dot */}
                    {/* We use absolute to ensure it doesn't push the text box */}
                    <div className="absolute right-0 top-[14px] flex items-center">
                      {/* Dot */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full"></div>

                      {/* Bar */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[60px] md:w-[100px]"></div>
                    </div>
                  </div>

                  {/* CENTER DOT: Aligned to the line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-4"></div>

                  {/* RIGHT SIDE: Icon */}
                  <div className="w-1/2 pl-3">
                    <img
                      src={iso}
                      className="w-12 h-12 object-contain"
                      alt="icon"
                    />
                  </div>
                </div>
                {/* 2024- right side*/}
                <div className="relative flex items-start w-full">
                  <div className="w-1/2 flex justify-end pr-3">
                    <img
                      src={labicon}
                      className="w-12 h-12 object-contain"
                      alt="icon"
                    />
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-3"></div>

                  <div className="w-1/2 flex flex-col items-start">
                    {/* LINE + YEAR */}
                    <div className="flex items-center w-full">
                      {/* LINE */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[60px] md:w-[100px]"></div>

                      {/* DOT at the end of the line */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full -ml-[1px]"></div>

                      {/* YEAR */}
                      <span className="ml-3 text-[#e50e0e] font-bold text-lg lg:text-2xl">
                        2024
                      </span>
                    </div>
                    <div className="flex flex-col ml-[10px] md:ml-[100px] max-w-[260px]">
                      <h4 className="font-bold text-gray-900 text-md">
                        Expanded RT-PCR Services
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Enhanced our testing capabilities with advanced RT-PCR
                        Assays.
                      </p>
                    </div>
                  </div>
                </div>
                {/* section 5 left */}
                <div className="relative flex items-start w-full">
                  {/* LEFT SIDE: Text and Connector */}
                  <div className="w-1/2 relative flex justify-end pr-0">
                    {/* Text Group: Positioned on the far left */}
                    <div className="flex flex-col items-start text-left max-w-[280px]">
                      <span className="text-[#e50e0e] font-bold text-lg lg:text-2xl leading-none">
                        2025
                      </span>
                      <h4 className="font-bold text-gray-900 text-md mt-2">
                        Multi-city Presence
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Plan to expand our services across multiple cities in
                        india.
                      </p>
                    </div>

                    {/* Horizontal Line: Starts from the Year and goes to the Center Dot */}
                    {/* We use absolute to ensure it doesn't push the text box */}
                    <div className="absolute right-0 top-[14px] flex items-center">
                      {/* Dot */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full"></div>

                      {/* Bar */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[60px] md:w-[100px]"></div>
                    </div>
                  </div>

                  {/* CENTER DOT: Aligned to the line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-4"></div>

                  {/* RIGHT SIDE: Icon */}
                  <div className="w-1/2 pl-3">
                    <img
                      src={india}
                      className="w-12 h-12 object-contain"
                      alt="icon"
                    />
                  </div>
                </div>
                {/* section 6 right */}
                <div className="relative flex items-start w-full">
                  <div className="w-1/2 flex justify-end pr-12"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4f4f4f] rounded-full z-10 mt-3"></div>
                  <div className="w-1/2 flex flex-col items-start">
                    {/* LINE + YEAR */}
                    <div className="flex items-center w-full">
                      {/* LINE */}
                      <div className="h-[2px] bg-[#4f4f4f] w-[60px] md:w-[100px]"></div>

                      {/* DOT at the end of the line */}
                      <div className="w-3 h-3 bg-[#e50e0e] rounded-full -ml-[1px]"></div>

                      {/* YEAR */}
                      <span className="ml-3 text-[#e50e0e] font-bold text-lg lg:text-2xl">
                        2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  );
};

export default Timeline;
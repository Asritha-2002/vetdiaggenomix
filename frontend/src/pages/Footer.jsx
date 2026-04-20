import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import footerlogo from "../assets/footer/footer-logo.png";
import footerarrow from "../assets/footer/footer-arrow.png";
import footercall from "../assets/footer/footer-call.png";
import footerlocation from "../assets/footer/footer-location.png";
import footermail from "../assets/footer/footer-mail.png";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const [footerServiceOpen, setFooterServiceOpen] = useState(false);
  return (
    <div className="">
      <section className="bg-[#f0eff0]">
        <div className="flex flex-col mx-8 py-4 md:flex-row md:items-center gap-[10px] md:gap-[30px] lg:gap-[40px] lg:ml-20">
          <img
            src={footerlogo}
            alt=""
            className="w-[280px] md:w-[240px] lg:w-[320px]"
          />
          <div className="hidden md:block border-1 h-16 border-[#dddcdd]"></div>
          <div>
            <h2 className="text-md md:text-1xl lg:text-2xl font-bold">
              Advanced Molecular Diagnostics for Optimal Animal Health
            </h2>
            <p className="text-xs md:text-md lg:text-lg text-[#3c3c3c]">
              Delivering accurate and reliable veterinary diagnostic services
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col px-8 gap-[15px] lg:flex-row my-4 lg:justify-evenly lg:px-0 lg:gap-0">
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-2xl md:text-xl lg:text-xl font-semibold">
            Quick Links
          </h3>
          <ul>
            <li className="flex gap-[2px] hover:text-[#b50b0b] cursor-pointer">
              <img src={footerarrow} alt=">" />
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="flex gap-[2px] hover:text-[#b50b0b] cursor-pointer">
              <img src={footerarrow} alt=">" />
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              {/* Parent */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setFooterServiceOpen(!footerServiceOpen)}
              >
                <div className="flex gap-[2px]">
                  <img src={footerarrow} alt=">" />
                  <span>Services</span><span>{footerServiceOpen ? "▾" : "▸"}</span>
                </div>
              </div>

              {/* Sub Services */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  footerServiceOpen ? "max-h-96 mt-2" : "max-h-0"
                }`}
              >
                <ul className="ml-5 space-y-1 text-sm list-disc">
                  <li className="ml-4">
                    <NavLink
                      to="/services/pcr"
                      className="hover:text-[#b50b0b]"
                    >
                      Polymerase Chain Reaction (PCR)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/rtpcr"
                      className="hover:text-[#b50b0b]"
                    >
                      Reverse Transcription PCR (RT-PCR)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/vcbp"
                      className="hover:text-[#b50b0b]"
                    >
                      Complete Blood Picture (CBP)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/ast"
                      className="hover:text-[#b50b0b]"
                    >
                      Antibiotic Sensitivity Test (AST)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/act"
                      className="hover:text-[#b50b0b]"
                    >
                      Aerobic Culture Test (ACT)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/lft"
                      className="hover:text-[#b50b0b]"
                    >
                      Liver Function Test (LFT)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/kft"
                      className="hover:text-[#b50b0b]"
                    >
                      Kidney Function Test (KFT)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/plt"
                      className="hover:text-[#b50b0b]"
                    >
                      Pancreatic Lipase Test (PLT)
                    </NavLink>
                  </li>

                  <li className="ml-4">
                    <NavLink
                      to="/services/pet"
                      className="hover:text-[#b50b0b]"
                    >
                      Pancreatic Elastase Test (PE)
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>
            <li className="flex gap-[2px] hover:text-[#b50b0b] cursor-pointer">
              <img src={footerarrow} alt=">" />
              <NavLink to="/shop">Shop</NavLink>
            </li>
            <li className="flex gap-[2px] hover:text-[#b50b0b] cursor-pointer">
              <img src={footerarrow} alt=">" />
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>
        <div className="hidden lg:block border-l h-auto border-[#dddcdd] "></div>
        <hr className="border-t border-[#b50b0b] my-4 lg:hidden" />
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-2xl md:text-xl lg:text-xl font-semibold">
            Working Hours
          </h3>
          <p>
            Monday - Saturday
            <br />
            08 AM - 08 PM
          </p>
          <p>
            Sunday
            <br />
            08 AM - 01 PM
          </p>
        </div>
        <div className="hidden lg:block border-l h-auto border-[#dddcdd] "></div>
        <hr className="border-t border-[#b50b0b] my-4 lg:hidden" />
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-2xl md:text-xl lg:text-xl font-semibold">
            Get in Touch
          </h3>
          <div className="flex gap-[5px] items-start">
            <img src={footerlocation} alt="" />
            <p>
              D.No. 74-7-6/2, SB House,
              <br />
              Patamata, Vijayawada,520010
            </p>
          </div>
          <div className="flex gap-[5px] items-start">
            <img src={footermail} />
            <p>vetdiaggenomix@gmail.com</p>
          </div>
          <div className="flex gap-[5px] items-start">
            <img src={footercall} />
            <p>
              +91 6301867331
              <br />
              +91 6281798372
            </p>
          </div>
        </div>
        <div className="hidden lg:block border-l h-auto border-[#dddcdd] "></div>
        <hr className="border-t border-[#b50b0b] my-4 lg:hidden" />
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-2xl md:text-xl lg:text-xl font-semibold">
            Follow Us
          </h3>
          <div className="flex flex-col gap-[10px]">
            <p>connect with us on social media</p>
            <div className="flex gap-4">
              <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                <FaFacebookF />
              </div>

              <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                <FaTwitter />
              </div>

              <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                <FaWhatsapp />
              </div>

              <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                <FaYoutube />
              </div>

              <div className="bg-[#b50b0b] text-white p-3 rounded-full">
                <FaInstagram />
              </div>
            </div>
            <p className="text-[#b50b0b]">#vetdiaggenomix</p>
          </div>
        </div>
      </section>
      <section className="bg-[#f0eff0]">
        <div className="flex flex-col text-xs items-center gap-[5px] py-2 md:flex-row justify-between px-8">
          <p className="text-[#787878]">
            <span className="font-semibold">CIN:</span> U75000AP2024PTC114031
          </p>
          <p className="text-[#787878]">
            © 2024 VetDiag Genomix Pvt Ltd | Privacy Policy | Terms of Service
          </p>
        </div>
      </section>
    </div>
  );
};

export default Footer;

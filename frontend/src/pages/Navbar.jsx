import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/navbar-images/logo.png";
import profile from "../assets/navbar-images/profile.png";
import shoppingbag from "../assets/navbar-images/shopping-bag.png";
import { useNavigate } from "react-router-dom";
import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const navRef = useRef([]);
  const indicatorRef = useRef(null);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

const [mobileMenu, setMobileMenu] = useState("");
const [mobileSubMenu, setMobileSubMenu] = useState("");
const [cartCount, setCartCount] = useState(0);
const navigate=useNavigate()

const toggleMenu = (menu) => {
  setOpenMenu(openMenu === menu ? null : menu);

  // optional: reset sub menu when switching main
  setOpenSubMenu(null);
};

const toggleSubMenu = (menu) => {
  setOpenSubMenu(openSubMenu === menu ? null : menu);
};

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
  ];

  const serviceRoutes = [
    "/services/cbc",
    "/services/kft",
    "/services/lft",
    "/services/pcr",
    "/services/rtpcr",
    "/services/cbp",
    "/services/act",
    "/services/plt",
    "/services/pet",
  ];

  useEffect(() => {
    let activeIndex = navRef.current.findIndex(
      (el) => el?.dataset?.path === location.pathname,
    );

    // SERVICES active
    if (serviceRoutes.includes(location.pathname)) {
      activeIndex = links.length;
    }

    // CONTACT active
    if (location.pathname === "/contact") {
      activeIndex = links.length + 1;
    }

    if (activeIndex !== -1) {
      const el = navRef.current[activeIndex];

      const parent = el.closest("header");
      const parentLeft = parent.getBoundingClientRect().left;
      const elLeft = el.getBoundingClientRect().left;

      indicatorRef.current.style.left = elLeft - parentLeft + "px";
      indicatorRef.current.style.width = el.offsetWidth + "px";
    }
  }, [location]);

  const fetchCartCount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("CART RESPONSE:", res.data);
    const items = res.data.data?.items || [];

    // total quantity count (not just item count)
    const totalQty = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(totalQty);
  } catch (error) {
    console.error("Cart count fetch error:", error);
  }
};
useEffect(() => {
  fetchCartCount();
}, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-[#b50b0b] z-50">
      {/* INDICATOR */}
      <span
        ref={indicatorRef}
        className="hidden md:block absolute top-0 h-[5px] bg-[#b50b0b] rounded-b-full transition-all duration-300 z-50"
      ></span>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center py-3">
          {/* LOGO */}
          <NavLink to="/">
            <img
              src={logo}
              className="w-[180px] md:w-[220px] lg:w-[250px] cursor-pointer"
              alt="logo"
            />
          </NavLink>

          {/* DESKTOP */}
          <div className="hidden xl:flex items-center ml-auto gap-16">
            <nav className="flex items-center">
              <ul className="flex gap-6 items-center">
                {links.map((link, index) => (
                  <li
                    key={link.path}
                    ref={(el) => (navRef.current[index] = el)}
                    data-path={link.path}
                    className="px-2 py-1"
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? "text-[#b50b0b]" : "hover:text-[#b50b0b]"
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}

                {/* SERVICES */}

               <li
  ref={(el) => (navRef.current[links.length] = el)}
  className="relative group px-2 py-1"
>
  <span className="cursor-pointer hover:text-[#b50b0b]">
    Services
  </span>

  {/* MAIN DROPDOWN (hover controlled) */}
  <div className="absolute top-8 left-0 hidden group-hover:block bg-white shadow-lg rounded p-3 w-72">

    {/* Hematology */}
    <div>
      <div
        onClick={() => toggleMenu("hematology")}
        className="flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]"
      >
        Hematology <span>{openMenu === "hematology" ? "▾" : "▸"}</span>
      </div>

      {openMenu === "hematology" && (
        <div className="ml-4">
          <NavLink to="/services/cbc" className="block py-1">
            Complete Blood Count (CBC)
          </NavLink>
        </div>
      )}
    </div>

<div>
  <div
    onClick={() => toggleMenu("biochemistry")}
    className="flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]"
  >
    Biochemistry <span>{openMenu === "biochemistry" ? "▾" : "▸"}</span>
  </div>

  {openMenu === "biochemistry" && (
    <div className="ml-4 max-h-60 overflow-y-auto">
      
      <NavLink to="/services/kft" className="block py-1">
        Kidney Function Test (KFT)
      </NavLink>

      <NavLink to="/services/lft" className="block py-1">
        Liver Function Test (LFT)
      </NavLink>

      <NavLink to="/services/ast" className="block py-1">
        AST / ALT / ALP / Total Protein / Albumin / Bilirubin
      </NavLink>

      <NavLink to="/services/urea" className="block py-1">
        Serum Creatinine / Urea / Uric Acid
      </NavLink>

      <NavLink to="/services/t3" className="block py-1">
        Canine Specific T3
      </NavLink>

      <NavLink to="/services/tsh" className="block py-1">
        Canine Specific TSH
      </NavLink>

      <NavLink to="/services/t4" className="block py-1">
        Canine Specific T4
      </NavLink>

      <NavLink to="/services/ldh" className="block py-1">
        LDH - Lactate Dehydrogenase
      </NavLink>

      <NavLink to="/services/rbs" className="block py-1">
        Random Blood Sugar
      </NavLink>

      <NavLink to="/services/sl" className="block py-1">
        Serum Lipase
      </NavLink>

      <NavLink to="/services/sa" className="block py-1">
        Serum Analysis
      </NavLink>

      <NavLink to="/services/b12" className="block py-1">
        Vitamin B12
      </NavLink>

      <NavLink to="/services/d" className="block py-1">
        Vitamin D
      </NavLink>

    </div>
  )}
</div>

<div>
  <div
    onClick={() => toggleMenu("molecular")}
    className="flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]"
  >
    Molecular Biology - RT PCR
    <span>{openMenu === "molecular" ? "▾" : "▸"}</span>
  </div>

  {openMenu === "molecular" && (
    <div className="ml-4 max-h-60 overflow-y-auto">

      {/* CDV */}
      <NavLink to="/services/cdv" className="block py-1">
        Canine Distemper Virus - RT-PCR
      </NavLink>

      {/* Tick Fever Panel */}
      <div>
        <div
          onClick={() => toggleSubMenu("tick")}
          className="flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]"
        >
          Canine Tick Fever Panel
          <span>{openSubMenu === "tick" ? "▾" : "▸"}</span>
        </div>

        {openSubMenu === "tick" && (
          <div className="ml-4">

            <NavLink to="/services/ctfc-2" className="block py-1">
              Tick Fever Panel - 2 Organisms
            </NavLink>

            <NavLink to="/services/ctfc-4" className="block py-1">
              Tick Fever Panel - 4 Organisms
            </NavLink>

            <NavLink to="/services/ctfc-7" className="block py-1">
              Tick Fever Panel - 7 Organisms
            </NavLink>

            <NavLink to="/services/ctfpbg" className="block py-1">
              Babesia Gibsoni
            </NavLink>

            <NavLink to="/services/ctfpbc" className="block py-1">
              Babesia Canis
            </NavLink>

            <NavLink to="/services/ctfpbr" className="block py-1">
              Babesia Rossi
            </NavLink>

            <NavLink to="/services/ctfpbv" className="block py-1">
              Babesia Vogeli
            </NavLink>

            <NavLink to="/services/ctfphc" className="block py-1">
              Hepatozoon Canis
            </NavLink>

            <NavLink to="/services/ctfpec" className="block py-1">
              Ehrlichia Canis
            </NavLink>

            <NavLink to="/services/ctfpap" className="block py-1">
              Anaplasma Platys
            </NavLink>

          </div>
        )}
      </div>

      {/* Other Tests */}
      <NavLink to="/services/ap" className="block py-1">
        Anaplasma Phagocytophilum
      </NavLink>

      <NavLink to="/services/cpv" className="block py-1">
        Canine Parvovirus (CPV)
      </NavLink>

      <NavLink to="/services/leptospira" className="block py-1">
        Leptospira
      </NavLink>

    </div>
  )}
</div>
<div>
      <div
        onClick={() => toggleMenu("histopathology")}
        className="flex justify-between items-center cursor-pointer py-1 hover:text-[#b50b0b]"
      >
        Histopathology
        <span>{openMenu === "histopathology" ? "▾" : "▸"}</span>
      </div>

      {openMenu === "histopathology" && (
        <div className="ml-4">
          <NavLink to="/services/biopsy" className="block py-1">
            Biopsy
          </NavLink>

          <NavLink to="/services/fnac" className="block py-1">
            FNAC (Fine Needle Aspiration Cytology)
          </NavLink>
<NavLink to="/services/abst" className="block py-1">
            Culture & Antibiotic Sensitivity Test (ABST)
          </NavLink>

          <NavLink to="/services/sse" className="block py-1">
            Skin Scraping Examination
          </NavLink>
        </div>
      )}
    </div>

    {/* DIRECT LINKS */}
    <NavLink to="/services/pcr" className="block py-1">
      Polymerase Chain Reaction (PCR)
    </NavLink>
     <NavLink to="/services/rtpcr" className="block py-1">
      Polymerase Chain Reaction (RT - PCR)
    </NavLink>
     <NavLink to="/services/cbp" className="block py-1">
      Complete Blood Picture (CBP)
    </NavLink>

    <NavLink to="/services/act" className="block py-1">
      Aerobic Culture Test (ACT)
    </NavLink>

    <NavLink to="/services/plt" className="block py-1">
      Pancreatic Lipase Test (PLT)
    </NavLink>

    <NavLink to="/services/pet" className="block py-1">
      Pancreatic Elastase (PE)
    </NavLink>

  </div>
</li>

                {/* CONTACT LAST */}
                <li
                  ref={(el) => (navRef.current[links.length + 1] = el)}
                  data-path="/contact"
                  className="px-2 py-1"
                >
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive ? "text-[#b50b0b]" : "hover:text-[#b50b0b]"
                    }
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              <button className="bg-[#b50b0b] text-white px-4 py-2 rounded cursor:pointer">
                <NavLink to="/book-appointment">Book Appointment</NavLink>
              </button>

             <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
  <img src={shoppingbag} className="w-8" alt="cart" />
  <span className="absolute -top-2 -right-2 bg-[#b50b0b] text-white text-xs px-2 py-1 rounded-full">
  {cartCount}
</span>
</div>
              <div
  onClick={() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  }}
  className="cursor-pointer"
>
  <img
    src={profile}
    className="w-10 h-10 rounded-full"
    alt="profile"
  />
</div>
            </div>
          </div>

          {/* MOBILE ICON */}
          <div className="xl:hidden ml-auto flex gap-5">
            <div className="relative">
              <img src={shoppingbag} className="w-8" alt="cart" />
              <span className="absolute -top-2 -right-2 bg-[#b50b0b] text-white text-xs px-2 rounded-full">
                0
              </span>
            </div>
            <button onClick={() => setMobileOpen(true)} className="text-2xl">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        <div className="px-4">
          <NavLink to="/">
            <img src={logo} className="w-[180px]" alt="logo" />
          </NavLink>
        </div>

        <div className="flex items-center gap-3 px-4 mt-4">
          <NavLink to="/profile">
            <img
              src={profile}
              className="w-10 h-10 rounded-full"
              alt="profile"
            />
          </NavLink>
        </div>

        <ul className="mt-6 space-y-4 px-5">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} onClick={() => setMobileOpen(false)}>
                {link.name}
              </NavLink>
            </li>
          ))}

         <li>
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={() => setServiceOpen(!serviceOpen)}
  >
    <span>Services {serviceOpen ? "▾" : "▸"}</span>
  </div>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      serviceOpen ? "max-h-[800px]" : "max-h-0"
    }`}
  >
    <ul className="ml-3 mt-2 space-y-2 text-sm">

      {/* ================= HEMATOLOGY ================= */}
      <li>
        <div
          onClick={() =>
            setMobileMenu(mobileMenu === "hematology" ? "" : "hematology")
          }
          className="flex justify-between cursor-pointer"
        >
          Hematology
          <span>{mobileMenu === "hematology" ? "▾" : "▸"}</span>
        </div>

        {mobileMenu === "hematology" && (
          <ul className="ml-4">
            <li>
              <NavLink to="/services/cbc" onClick={() => setMobileOpen(false)}>
                Complete Blood Count (CBC)
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* ================= BIOCHEMISTRY ================= */}
      <li>
        <div
          onClick={() =>
            setMobileMenu(mobileMenu === "biochemistry" ? "" : "biochemistry")
          }
          className="flex justify-between cursor-pointer"
        >
          Biochemistry
          <span>{mobileMenu === "biochemistry" ? "▾" : "▸"}</span>
        </div>

        {mobileMenu === "biochemistry" && (
         <ul className="ml-4">
  <NavLink to="/services/kft" className="block py-1">KFT</NavLink>
  <NavLink to="/services/lft" className="block py-1">LFT</NavLink>
  <NavLink to="/services/ast" className="block py-1">AST</NavLink>
  <NavLink to="/services/urea" className="block py-1">Urea</NavLink>
  <NavLink to="/services/t3" className="block py-1">T3</NavLink>
  <NavLink to="/services/tsh" className="block py-1">TSH</NavLink>
  <NavLink to="/services/t4" className="block py-1">T4</NavLink>
  <NavLink to="/services/ldh" className="block py-1">LDH</NavLink>
  <NavLink to="/services/rbs" className="block py-1">RBS</NavLink>
  <NavLink to="/services/sl" className="block py-1">Serum Lipase</NavLink>
  <NavLink to="/services/sa" className="block py-1">Serum Analysis</NavLink>
  <NavLink to="/services/b12" className="block py-1">Vitamin B12</NavLink>
  <NavLink to="/services/d" className="block py-1">Vitamin D</NavLink>
</ul>
        )}
      </li>

      {/* ================= MOLECULAR ================= */}
      <li>
        <div
          onClick={() =>
            setMobileMenu(mobileMenu === "molecular" ? "" : "molecular")
          }
          className="flex justify-between cursor-pointer"
        >
          Molecular Biology
          <span>{mobileMenu === "molecular" ? "▾" : "▸"}</span>
        </div>

        {mobileMenu === "molecular" && (
          <ul className="ml-4">

            <NavLink to="/services/cdv">CDV</NavLink>

            {/* TICK PANEL */}
            <li>
              <div
                onClick={() =>
                  setMobileSubMenu(
                    mobileSubMenu === "tick" ? "" : "tick"
                  )
                }
                className="flex justify-between cursor-pointer"
              >
                Tick Fever Panel
                <span>{mobileSubMenu === "tick" ? "▾" : "▸"}</span>
              </div>

              {mobileSubMenu === "tick" && (
                <ul className="ml-4">
                  <NavLink to="/services/ctfc-2" className="block py-1">2 Organisms</NavLink>
                  <NavLink to="/services/ctfc-4" className="block py-1">4 Organisms</NavLink>
                  <NavLink to="/services/ctfc-7" className="block py-1">7 Organisms</NavLink>
                  <NavLink to="/services/ctfpbg" className="block py-1">Babesia Gibsoni</NavLink>
                  <NavLink to="/services/ctfpbc" className="block py-1">Babesia Canis</NavLink>
                  <NavLink to="/services/ctfpbr" className="block py-1">Babesia Rossi</NavLink>
                  <NavLink to="/services/ctfpbv" className="block py-1">Babesia Vogeli</NavLink>
                  <NavLink to="/services/ctfphc" className="block py-1">Hepatozoon Canis</NavLink>
                  <NavLink to="/services/ctfpec" className="block py-1">Ehrlichia Canis</NavLink>
                  <NavLink to="/services/ctfpap" className="block py-1">Anaplasma Platys</NavLink>
                </ul>
              )}
            </li>

            <NavLink to="/services/ap">Anaplasma</NavLink>
            <NavLink to="/services/cpv">CPV</NavLink>
            <NavLink to="/services/leptospira">Leptospira</NavLink>
          </ul>
        )}
      </li>

      {/* ================= HISTOPATHOLOGY ================= */}
      <li>
        <div
          onClick={() =>
            setMobileMenu(
              mobileMenu === "histopathology" ? "" : "histopathology"
            )
          }
          className="flex justify-between cursor-pointer"
        >
          Histopathology
          <span>{mobileMenu === "histopathology" ? "▾" : "▸"}</span>
        </div>

        {mobileMenu === "histopathology" && (
          <ul className="ml-4">
            <NavLink to="/services/biopsy" className="block py-1">Biopsy</NavLink>
            <NavLink to="/services/fnac" className="block py-1">FNAC</NavLink>
            <NavLink to="/services/abst" className="block py-1">ABST</NavLink>
            <NavLink to="/services/sse" className="block py-1">Skin Scraping</NavLink>
          </ul>
        )}
      </li>

      {/* ================= DIRECT ================= */}
      <li><NavLink to="/services/pcr" >Polymerase Chain Reaction (PCR)</NavLink></li>
      <li><NavLink to="/services/rtpcr">Reverse Transcription Polymerase Chain Reaction (RT-PCR) Test</NavLink></li>
      <li><NavLink to="/services/cbp">Complete Blood Picture (CBP)</NavLink></li>
      <li><NavLink to="/services/act">Aerobic Culture Test(ACT)</NavLink></li>
      <li><NavLink to="/services/plt">Pancreatic Lipase Test(PLT)</NavLink></li>
      <li><NavLink to="/services/pet">Pancreatic Elastase(PE)</NavLink></li>

    </ul>
  </div>
</li>
 <li>
              <NavLink to="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </NavLink>
            </li>
        </ul>

        <div className="px-4 mt-6">
          <NavLink
            to="/book-appointment"
            className="w-full bg-[#b50b0b] text-white py-2 px-4 rounded cursor-pointer"
          >
            Book Appointment
          </NavLink>
        </div>

        <div className="flex gap-4 px-4 mt-6">
          <FontAwesomeIcon icon={faFacebook} className="text-3xl" />
          <FontAwesomeIcon icon={faTwitter} className="text-3xl" />
          <FontAwesomeIcon icon={faInstagram} className="text-3xl" />
        </div>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Navbar;

import { useParams, NavLink } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import serviceData from "../data/serviceData.js";
import contacthero from "../assets/hero-sections-contact/contactsectionbgc-1.png";
import { FaCheck } from "react-icons/fa";

const ServiceDetails = () => {
  const { serviceName } = useParams();

  // 🔥 STABLE KEY (no re-computation issues)
  const key = useMemo(() => {
    if (!serviceName) return "";
    return serviceName.startsWith("ctfc-")
      ? serviceName.split("-")[1]
      : serviceName;
  }, [serviceName]);

  // 🔍 OPTIMIZED SEARCH (memoized, avoids recalculation on rerender)
  const { service, categoryName } = useMemo(() => {
    const findService = (data, key) => {
      if (data[key]) return data[key];

      for (let category in data) {
        const item = data[category];

        if (item[key]) return item[key];

        for (let sub in item) {
          if (typeof item[sub] === "object" && item[sub][key]) {
            return item[sub][key];
          }

          for (let deep in item[sub] || {}) {
            if (deep === key) {
              return item[sub][deep];
            }
          }
        }
      }
      return null;
    };

    const findCategory = (data, key) => {
      for (let category in data) {
        const item = data[category];

        if (item[key]) return category;

        for (let sub in item) {
          if (item[sub]?.[key]) return category;

          for (let deep in item[sub] || {}) {
            if (deep === key) return category;
          }
        }
      }
      return "";
    };

    return {
      service: findService(serviceData, key),
      categoryName: findCategory(serviceData, key),
    };
  }, [key]);

  // prevent crashes during hydration
  const points = useMemo(() => {
    if (!service?.points) return [];
    return service.points.split("-");
  }, [service]);

  if (!service) return <h1>Service Not Found</h1>;

  const { title, description, image, sampletype, Resulttime, Applicablefor } =
    service;

  const match = title?.match(/\((.*?)\)/);
  const mainText = title?.replace(/\(.*?\)/, "");
  const innerText = match ? match[1] : "";

  return (
    <>
      <Navbar />

      {/* BACKGROUND SECTION (GPU optimized) */}
      <div
        className="pb-8 will-change-transform"
        style={{
          backgroundImage: `url(${contacthero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto mt-10 p-4 flex flex-col lg:flex-row gap-6 relative items-center">
          {/* LEFT IMAGE */}
          <div className="flex justify-center w-full lg:w-1/2 mt-10 md:mt-15 lg:ml-5">
            <img
              src={image}
              alt={title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-[520px] rounded transform-gpu"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-1/2 lg:mt-15 lg:mr-5">
            <h1 className="text-xl lg:text-2xl text-[#b50b0b] mb-3 font-semibold inline-block border-b border-[#b50b0b] pb-1">
              {categoryName}
            </h1>

            <h2 className="text-xl lg:text-3xl font-bold mb-4">
              {mainText}
              {innerText && (
                <>
                  {" ("}
                  <span className="text-[#b50b0b]">{innerText}</span>
                  {")"}
                </>
              )}
            </h2>

            <p className="pb-3">{description}</p>

            {points.map((item, index) => (
              <div key={index} className="flex gap-3 p-2 pb-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <FaCheck className="text-xs" />
                </div>
                <p>{item}</p>
              </div>
            ))}

            <div className="flex flex-col gap-4 md:flex-row lg:gap-[40px] pb-3">
              <p>
                <span className="text-[#b50b0b] font-bold">Sample Type: </span>
                {sampletype}
              </p>

              <p>
                <span className="text-[#b50b0b] font-bold">Result time: </span>
                {Resulttime}
              </p>
            </div>

            <p className="pb-4">
              <span className="text-[#b50b0b] font-bold">Applicable for: </span>
              {Applicablefor}
            </p>

            <NavLink to="/book-appointment">
              <button className="bg-[#b50b0b] text-white font-semibold px-6 py-2 rounded-md">
                Book Appointment
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ServiceDetails;

import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import userImg from "../../assets/navbar-images/profile.png";
import comma from "../../assets/home/Vector 4.png";
import hero3 from "../../assets/home/Rectangle 22.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const [swiperInstance, setSwiperInstance] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // 🔥 Fetch data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 🔥 Fix navigation binding
  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  // 🔥 Smart navigation logic (responsive safe)
  const updateNavState = (swiper) => {
    if (!swiper) return;

    const totalSlides = swiper.slides.length;
    let slidesPerView = swiper.params.slidesPerView;

    if (swiper.params.breakpoints) {
      const breakpoints = swiper.params.breakpoints;
      const width = window.innerWidth;

      for (const bp in breakpoints) {
        if (width >= bp) {
          slidesPerView = breakpoints[bp].slidesPerView;
        }
      }
    }

    setIsBeginning(swiper.activeIndex === 0);
    setIsEnd(swiper.activeIndex >= totalSlides - slidesPerView);
  };

  // 🔥 Handle resize (MAIN FIX)
  useEffect(() => {
    const handleResize = () => {
      if (swiperInstance) {
        updateNavState(swiperInstance);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [swiperInstance]);

  return (
    <section className="relative w-full py-16 px-4 overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <img
        src={hero3}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0"></div>

      {/* CONTENT */}
      <div className="relative z-10">

        <h2 className="text-center text-white text-2xl md:text-4xl font-bold mb-10">
          Our Client Says...
        </h2>

        <div className="max-w-6xl mx-auto relative">

          {/* LEFT ARROW */}
          <button
            ref={prevRef}
            className={`absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-md transition 
            ${
              isBeginning
                ? "bg-gray-300 opacity-50 pointer-events-none"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FaChevronLeft size={14} />
          </button>

          {/* RIGHT ARROW */}
          <button
            ref={nextRef}
            className={`absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-md transition 
            ${
              isEnd
                ? "bg-gray-300 opacity-50 pointer-events-none"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <FaChevronRight size={14} />
          </button>

          {loading ? (
            <p className="text-center text-white">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-white">No reviews found</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                updateNavState(swiper);
              }}
              onSlideChange={(swiper) => updateNavState(swiper)}
              onBreakpoint={(swiper) => updateNavState(swiper)} // 🔥 KEY FIX
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {reviews.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white backdrop-blur-md rounded-2xl p-5 shadow-lg h-full flex flex-col justify-between">

                    {/* USER */}
                    <div className="flex gap-3 mb-3">
                      <img
                        src={item.profileImage || userImg}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="user"
                      />

                      <div className="mt-3">
                        <h3 className="font-bold text-sm text-[#b50b0b]">
                          {item.userName || "Anonymous"}
                        </h3>
                        <p className="text-xs text-gray-500">Pet Owner</p>
                      </div>
                    </div>

                    {/* REVIEW */}
                    <p className="text-gray-700 text-sm mb-4 h-20 overflow-hidden">
                      {item.review}
                    </p>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center">

                      {/* STARS */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < item.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {/* QUOTES */}
                      <div className="flex">
                        <img src={comma} alt="" className="w-5 h-7" />
                        <img src={comma} alt="" className="w-5 h-7 -ml-2" />
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
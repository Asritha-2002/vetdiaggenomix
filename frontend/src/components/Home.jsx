import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../pages/Navbar.jsx";
import Footer from "../pages/Footer.jsx";

// eager (above fold)
import HeroSection from "./home/HeroSection.jsx";
import WhoWeAre from "./home/WhoWeAre.jsx";
import ProcessSection from "./home/ProcessSection.jsx";
import AppointmentCTA from "./home/AppointmentCTA.jsx";

// lazy sections (below fold)
const SpecialServices = lazy(() => import("./home/SpecialServices.jsx"));
const StatsSection = lazy(() => import("./home/StatsSection.jsx"));
const Testimonials = lazy(() => import("./home/Testimonials.jsx"));

import SpecialServicesSkeleton from "../skeleton/SpecialServicesSkeleton.jsx";
import TestimonialsSkeleton from "../skeleton/TestimonialsSkeleton.jsx";


/* ---------------- Intersection Observer Hook ---------------- */
const useInView = (options = { threshold: 0.15 }) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // load once (important for performance)
      }
    }, options);

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return [setRef, isVisible];
};

/* ---------------- Section Wrapper ---------------- */
const LazySection = ({ children }) => {
  const [ref, isVisible] = useInView();

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-[300px]" />}
    </div>
  );
};

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />

      {/* ABOVE FOLD (NO LAZY LOADING) */}
      <HeroSection />
      <WhoWeAre />
      <ProcessSection />

      {/* BELOW FOLD (SMART LOAD ON SCROLL) */}
      <LazySection>
        <Suspense fallback={<SpecialServicesSkeleton />}>
          <SpecialServices />
        </Suspense>
      </LazySection>

      <AppointmentCTA />

      <LazySection>
        <Suspense fallback={<div className="h-[200px]" />}>
          <StatsSection />
        </Suspense>
      </LazySection>

      <LazySection>
         <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
      </LazySection>

      <Footer />
    </motion.div>
  );
};

export default Home;
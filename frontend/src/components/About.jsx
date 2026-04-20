import { lazy, Suspense } from "react";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";
import AboutHero from "./about/AboutHero";
import AboutInfo from "./about/AboutInfo";

const Accreditations = lazy(() => import("../components/about/Accreditations"));
const Experts = lazy(() => import("../components/about/Experts"));
const Timeline = lazy(() => import("../components/about/Timeline"));
const Gallery = lazy(() => import("../components/about/Gallery"));

const SectionSkeleton = () => (
  <div className="w-full py-16 px-4">
    <div className="max-w-6xl mx-auto animate-pulse space-y-6">
      <div className="h-6 w-1/3 bg-gray-300 rounded mx-auto"></div>
      <div className="h-40 md:h-60 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* STATIC LAYER (no Suspense delay) */}
      <Navbar />
      <AboutHero />
      <AboutInfo />

      {/* HEAVY SECTIONS (lazy loaded safely) */}
      <Suspense fallback={<SectionSkeleton />}>
        <Accreditations />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Experts />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Timeline />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Gallery />
      </Suspense>

      <Footer />

    </div>
  );
};

export default About;
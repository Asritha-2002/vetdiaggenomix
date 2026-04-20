import { memo } from "react";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import a1 from "../../assets/about/Rectangle 136.png";
import a2 from "../../assets/about/Rectangle 137.png";
import a3 from "../../assets/about/Rectangle 138.png";
import a4 from "../../assets/about/Rectangle 139.png";

const images = [
  { src: a1, alt: "cat" },
  { src: a2, alt: "bovine" },
  { src: a3, alt: "dog" },
  { src: a4, alt: "canine" },
];

const Gallery = () => {
  return (
    <div className="py-10 overflow-hidden">

      {/* HEADER */}
      <div className="flex gap-4 items-center justify-center">
        <img src={titleimg2} alt="left-logo" className="w-5 h-5 mt-1 md:mt-2" />
        <h2 className="text-2xl md:text-4xl font-bold">Gallary</h2>
        <img src={titleimg2} alt="right-logo" className="w-5 h-5 mt-1 md:mt-2" />
      </div>

      {/* ================= MOBILE UI ================= */}
      <div className="md:hidden mt-8 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4">
          {images.map((item, i) => (
            <div
              key={i}
              className="min-w-[80%] snap-center rounded-xl overflow-hidden shadow-lg transform-gpu"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-[250px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP UI ================= */}
      <div className="hidden md:flex gap-5 justify-center items-center py-10 [perspective:1500px] bg-white overflow-hidden will-change-transform">

        {/* LEFT */}
        <div className="w-64  [transform:rotateY(40deg)] transition-transform duration-500 hover:scale-105">
          <img
            src={a1}
            alt="cat"
            loading="lazy"
            decoding="async"
            className="w-full h-auto shadow [clip-path:ellipse(130%_90%_at_50%_50%)]"
            
          />
        </div>

        {/* SECOND */}
        <div className="w-59 [transform:rotateY(10deg)] transition-transform duration-500 hover:scale-105">
          <img
            src={a2}
            alt="bovine"
            loading="lazy"
            decoding="async"
            className="w-full h-auto shadow [clip-path:ellipse(130%_95%_at_50%_50%)]"
          />
        </div>

        {/* THIRD */}
        <div className="w-59 [transform:rotateY(-10deg)] transition-transform duration-500 hover:scale-105">
          <img
            src={a3}
            alt="dog"
            loading="lazy"
            decoding="async"
            className="w-full h-auto shadow [clip-path:ellipse(130%_95%_at_50%_50%)]"
          />
        </div>

        {/* RIGHT */}
        <div className="w-64 [transform:rotateY(-40deg)] transition-transform duration-500 hover:scale-105">
          <img
            src={a4}
            alt="canine"
            loading="lazy"
            decoding="async"
            className="w-full h-auto shadow [clip-path:ellipse(130%_90%_at_50%_50%)]"
          />
        </div>

      </div>
    </div>
  );
};

export default memo(Gallery);
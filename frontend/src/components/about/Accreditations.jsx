import hero2 from "../../assets/hero-sections-contact/contactsectionbgc-1.png";
import titleimg2 from "../../assets/home/second-sec-tit.png";
import s1 from "../../assets/about/Rectangle 121.png";
import s2 from "../../assets/about/Rectangle 122.png";
import s3 from "../../assets/about/Rectangle 123.png";
import s4 from "../../assets/about/Rectangle 124.png";

const Accreditations = () => {
  return (
    <div
      className="
        relative w-full h-auto flex
        overflow-hidden
        will-change-transform
        transform-gpu
        contain-layout contain-paint
      "
    >
      {/* Background Image (optimized rendering layer) */}
      <img
        src={hero2}
        alt="background"
        loading="lazy"
        decoding="async"
        className="
          absolute inset-0 w-full h-full
          object-cover
          -z-10
          transform-gpu
          will-change-transform
        "
      />

      <div className="flex flex-col gap-5 w-full items-center relative z-10">
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
            <span className="text-[#b50b0b]">Our</span> Accreditations
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

        {/* Grid Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[s1, s2, s3, s4].map((img, i) => (
              <div
                key={i}
                className="
                  bg-white shadow-md rounded-xl p-4
                  flex items-center justify-center
                  transform-gpu
                  will-change-transform
                "
              >
                <img
                  src={img}
                  alt={`accreditation-${i}`}
                  loading="lazy"
                  decoding="async"
                  className="h-[80px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accreditations;
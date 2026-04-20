import contacthero from "../../assets/hero-sections-contact/contact-hero.png";


const ContactHero = () => {
  return (
    <div className="pt-[60px]">
        <section className="relative w-full h-[450px] lg:h-[520px] overflow-hidden">

      {/* BACKGROUND IMAGE (better performance than inline style) */}
      <img
        src={contacthero}
        alt="Contact Hero"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
        loading="eager"
        decoding="async"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/10" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center w-[90%] md:w-[70%] lg:w-[65%] px-6 md:px-16 lg:px-24">

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#b50b0b] mb-4">
          Get in Touch With Our Team
        </h1>

        <p className="text-base md:text-xl text-gray-800">
          We are here to assist you. Feel free to reach out for inquiries or
          to schedule an appointment.
        </p>

      </div>


    </section>
    </div>
  );
};

export default ContactHero;

import Navbar from "../pages/Navbar";

import BookAppointment from "../pages/BookAppointment";
import Footer from "../pages/Footer";
import ContactHero from "./contact/ContactHero";
import LocationsSection from "./contact/LocationsSection";

const Contact = () => {


  return (
    <div>
      <Navbar />
      
        {/* Hero Section */}
      <ContactHero/>
        {/* Locations Section */}

<LocationsSection/>

<BookAppointment/>
<Footer/>
      
    </div>
  );
};

export default Contact;
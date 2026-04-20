import React, { useState, useEffect } from "react";
import contactsec from "../assets/hero-sections-contact/contactsectionbcg-2.png";
import serviceData from "../data/serviceData"; // ✅ ADDED
const BASE_URL=import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

const BookAppointment = () => {
  const initialData = {
    name: "",
    phone: "",
    email: "",
    petCategory: "",
    service: "",
    dateOfAppointment: "",
    time: "",
    location: "",
  };

  const [appointmentData, setAppointmentData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isBooking, setIsBooking] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
const [statusType, setStatusType] = useState(""); // "success" | "error"
const [statusMessage, setStatusMessage] = useState("");

  // ✅ FILTER SERVICES BASED ON PET
  const getFilteredServices = () => {
    const selectedPet = appointmentData.petCategory.toLowerCase();

    if (!selectedPet) return ["Nothing Found"];

    let servicesList = [];

    const traverse = (data) => {
      for (let key in data) {
        const item = data[key];

        if (item?.title && item?.Applicablefor) {
          if (item.Applicablefor.toLowerCase().includes(selectedPet)) {
            servicesList.push(item.title);
          }
        }

        if (typeof item === "object") {
          traverse(item);
        }
      }
    };

    traverse(serviceData);

    return servicesList;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "petCategory" && { service: "" }), // ✅ RESET SERVICE
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!appointmentData.name.trim()) newErrors.name = "Name is required";

    if (
      !appointmentData.phone.trim() ||
      !/^[6-9]\d{9}$/.test(appointmentData.phone)
    )
      newErrors.phone = "Enter valid mobile number";

    if (
      !appointmentData.email.trim() ||
      !/\S+@\S+\.\S+/.test(appointmentData.email)
    )
      newErrors.email = "Enter valid email";

    if (!appointmentData.petCategory.trim()) newErrors.petCategory = "Required";

    if (!appointmentData.service) newErrors.service = "Select service";

    if (!appointmentData.dateOfAppointment)
      newErrors.dateOfAppointment = "Select date";

    if (!appointmentData.time) newErrors.time = "Select time";

    if (!appointmentData.location) newErrors.location = "Select location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setIsBooking(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        petCategory: appointmentData.petCategory,
        service: appointmentData.service,
        dateOfAppointment: appointmentData.dateOfAppointment,
        time: appointmentData.time,
        location: appointmentData.location,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
  toast.error(data.message || "Booking failed");

  setStatusType("error");
  setStatusMessage(data.message || "Your appointment could not be booked. Please try again.");
  setShowStatusModal(true);

} else {
  // toast.success("Appointment booked successfully");

  setStatusType("success");
  setStatusMessage("Thank you, your appointment has been confirmed. Our team will call back shortly to assist you.");
  setShowStatusModal(true);

  setAppointmentData(initialData);
}

  } catch (error) {
    // console.error(error);
    toast.error("Something went wrong");
  } finally {
    setIsBooking(false);
  }
};
const generateTimeSlots = (isSunday) => {
  const slots = [];
  const start = 8;
  const end = isSunday ? 13 : 20;

  for (let i = start; i <= end; i++) {
    const hour = i > 12 ? i - 12 : i;
    const period = i >= 12 ? "PM" : "AM";
    const formatted = `${hour.toString().padStart(2, "0")}:00 ${period}`;
    slots.push(formatted);
  }

  return slots;
};
const selectedDate = appointmentData.dateOfAppointment;
const isSunday =
  selectedDate && new Date(selectedDate).getDay() === 0;
  const timeSlots = generateTimeSlots(isSunday);
  useEffect(() => {
  setAppointmentData((prev) => ({
    ...prev,
    time: "",
  }));
}, [appointmentData.dateOfAppointment]);

  return (
    <div>
      <section
        className="relative w-full bg-cover bg-center py-8"
        style={{ backgroundImage: `url(${contactsec})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xl bg-[#f7f7f7] rounded-xl p-8 shadow-[0_0_10px_rgba(0,0,0,0.25)]">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2">
                Book Your Appointment
              </h2>
              <p className="text-center mb-6">
                Fill out the form below, and our team will contact you shortly
                to confirm your appointment
              </p>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Name */}
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={appointmentData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  />
                  <p className="text-red-500 text-sm">{errors.name}</p>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block mb-1">Mobile</label>
                  <input
                    type="text"
                    name="phone"
                    value={appointmentData.phone}
                    onChange={handleChange}
                    placeholder="Enter Your Mobile Number"
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  />
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={appointmentData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>

                {/* Pet Category */}
                <div>
                  <label className="block mb-1">Pet Category</label>
                  <input
                    type="text"
                    name="petCategory"
                    value={appointmentData.petCategory}
                    onChange={handleChange}
                    placeholder="Enter Pet Category"
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  />
                  <p className="text-red-500 text-sm">{errors.petCategory}</p>
                </div>

                {/* Service */}
                <div>
                  <label className="block mb-1">Service</label>
                  <select
                    name="service"
                    value={appointmentData.service}
                    onChange={handleChange}
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  >
                    <option value="">Choose Service</option>

                    {getFilteredServices().length > 0 ? (
                      getFilteredServices().map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))
                    ) : appointmentData.petCategory ? (
                      <option disabled>No services found</option>
                    ) : null}
                  </select>
                  <p className="text-red-500 text-sm">{errors.service}</p>
                </div>

                {/* Date */}
                <div>
                  <label className="block mb-1">Date of Appointment</label>
                  <input
                    type="date"
                    name="dateOfAppointment"
                    value={appointmentData.dateOfAppointment}
                    onChange={handleChange}
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  />
                  <p className="text-red-500 text-sm">
                    {errors.dateOfAppointment}
                  </p>
                </div>

                {/* Time */}
               <div>
  <label className="block mb-1">Time</label>

  <select
    name="time"
    value={appointmentData.time}
    onChange={handleChange}
    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
  >
    <option value="">Choose Time</option>

    {timeSlots.map((time, index) => (
      <option key={index} value={time}>
        {time}
      </option>
    ))}
  </select>

  <p className="text-red-500 text-sm">{errors.time}</p>
</div>

                {/* Location */}
                <div>
                  <label className="block mb-1">Location</label>
                  <select
                    name="location"
                    value={appointmentData.location}
                    onChange={handleChange}
                    className="w-full border border-[#767676] rounded-md px-3 py-2 focus:outline-none bg-[#ffffff]"
                  >
                    <option value="">Choose Location</option>
                    <option>Vijayawada</option>
                    <option>Yalamanchili</option>
                    <option>Visakhapatnam</option>
                  </select>
                  <p className="text-red-500 text-sm">{errors.location}</p>
                </div>

                {/* Submit */}
                <div className="sm:col-span-2 text-center mt-4">
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="bg-[#b50b0b] text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer"
                  >
                    {isBooking ? "Booking..." : "Book Appointment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {showStatusModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">

    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 sm:p-8 text-center">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-full ${
            statusType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span className="text-white text-3xl font-bold">
            {statusType === "success" ? "✓" : "✕"}
          </span>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        {statusType === "success"
          ? "Appointment Confirmed!"
          : "Appointment Failed"}
      </h2>

      {/* MESSAGE */}
      <p className="text-gray-600 text-sm sm:text-base mb-3">
        {statusMessage}
      </p>

      {/* SUB TEXT */}
      <p className="text-gray-500 text-xs sm:text-sm mb-6">
        Go to My Appointments to see the details and instructions for your Appointment
      </p>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        
        {/* My Appointments */}
        <button
          onClick={() => (window.location.href = "/profile")}
          className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg w-full sm:w-auto"
        >
          My Appointments
        </button>

        {/* Close */}
        <button
          onClick={() => setShowStatusModal(false)}
          className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg w-full sm:w-auto"
        >
          Close
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BookAppointment;

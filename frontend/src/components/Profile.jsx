import React, { useState, useEffect } from "react";
import background from "../assets/hero-sections-contact/contactsectionbgc-1.png";
import Footer from "../pages/Footer";
import Navbar from "../pages/Navbar";
import profileicon from "../assets/profile/profileicon.png";
import addressIcon from "../assets/profile/address.png";
import calender from "../assets/profile/calender.png";
import camera from "../assets/profile/camera.png";
import edit from "../assets/profile/edit.png";
import deleteIcon from "../assets/profile/delete.png";
import logout from "../assets/profile/logout.png";
import orders from "../assets/profile/orders.png";
import profile from "../assets/navbar-images/profile.png";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import office from "../assets/profile/office.png";
import home from "../assets/profile/home.png";
import flag from "../assets/profile/flag.png";
import home_icon from "../assets/profile/home_icon.png";
import office_icon from "../assets/profile/office_icon.png";
import detailsCalender from "../assets/appointments/detailsCalender.png";
import tabsCalender from "../assets/appointments/tabsCalender.png";
import arrow from "../assets/appointments/arrow.png";
import check from "../assets/appointments/check.png";
import clock from "../assets/appointments/clock.png";
import back from "../assets/appointments/back.png";
import location from "../assets/appointments/location.png";
import checkmark from "../assets/appointments/checkmark.png";
import cancel from "../assets/appointments/cancel.png";
import emptystar from "../assets/appointments/emptystar.png";
import filledstar from "../assets/appointments/filledstar.png";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("My Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const sidebarItems = [
    { name: "My Profile", icon: profileicon },
    { name: "My Orders", icon: orders },
    { name: "My Appointments", icon: calender },
    { name: "My Address", icon: addressIcon },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const nameParts = data.name?.split(" ") || [];
        const fetchedData = {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: data.email || "",
          mobile: data.phone ? `+91${data.phone}` : "",
          gender: data.gender || "Male",
          dob: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        };
        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        // console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      }
    };
    fetchProfile();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if ((name === "firstName" || name === "lastName") && !value.trim()) {
      error = `${name === "firstName" ? "First" : "Last"} name is required`;
    } else if (
      name === "mobile" &&
      (!value || value.replace(/\D/g, "").length < 10)
    ) {
      error = "Enter a valid mobile number";
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
    if (!error) {
      setFormErrors((prev) => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.mobile || formData.mobile.replace(/\D/g, "").length < 10) {
      errors.mobile = "Enter a valid mobile number";
    }
    if (formData.dob && isNaN(new Date(formData.dob).getTime())) {
      errors.dob = "Invalid date of birth";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const phone = formData.mobile.replace("+91", "");

      // Only include dateOfBirth if it's non-empty
      const bodyData = {
        name: fullName,
        gender: formData.gender,
        phone: phone,
      };
      if (formData.dob) {
        bodyData.dateOfBirth = formData.dob;
      }

      const res = await fetch(`${BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully");
      setOriginalData(formData);
      setIsEditing(false);
      setFormErrors({});
    } catch (error) {
      //console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setFormErrors({});
  };

  const initialAddress = {
    fullname: "", // prefill from formData
    mobilenum: "",
    addl1: "",
    addl2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    type: "",
  };

  const [address, setAddress] = useState(initialAddress);
  const [addressErrors, setAddressErrors] = useState({});

  // Disable editing fullname
  const isFullnameDisabled = true;

  // Generic handler
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    // Update input value
    setAddress((prev) => ({ ...prev, [name]: value }));

    // Validate this field immediately
    validateFields(name, value);
  };

  // Field-level validation
  const validateFields = (name, value) => {
    let error = "";

    // Required check for all fields except landmark and type
    if (name !== "landmark" && name !== "type" && !value.trim()) {
      error = "This field is required";
    }

    // Mobile number validation
    if (name === "mobilenum" && value.trim() && !/^[6-9]\d{9}$/.test(value)) {
      error = "Enter a valid 10-digit mobile number starting with 6-9";
    }

    // Update the error state for this field
    setAddressErrors((prev) => ({ ...prev, [name]: error }));
  };

  //   useEffect(() => {
  //     setAddress((prev) => ({
  //       ...prev,
  //       fullname: formData.firstName + " " + formData.lastName,
  //     }));
  //   }, [formData.firstName, formData.lastName]);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch addresses");
      setAddresses(data);
    } catch (error) {
      //console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);
  const handleEditClick = (index) => {
    //console.log("Clicked index:", index); // 👈 check this

    const addrToEdit = addresses[index];

    setAddress({
      fullname: addrToEdit.fullname || "",
      mobilenum: addrToEdit.mobilenum || "",
      addl1: addrToEdit.addl1 || "",
      addl2: addrToEdit.addl2 || "",
      landmark: addrToEdit.landmark || "",
      pincode: addrToEdit.pincode || "",
      city: addrToEdit.city || "",
      state: addrToEdit.state || "",
      type: addrToEdit.type || "home",
    });

    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };
  const [showAddressModal, setShowAddressModal] = useState(false);
const [addressStatus, setAddressStatus] = useState(""); // "success" | "error"
const [addressAction, setAddressAction] = useState(""); // "add" | "edit"
const [addressMessage, setAddressMessage] = useState("");
  // Form submit
  const handleSubmit = async (e) => {
    //console.log("FORM SUBMITTED 🔥");
    //console.log("ADDRESS STATE:", address);

    e.preventDefault();

    // Validate all required fields
    const errors = {};
    Object.keys(address).forEach((key) => {
      if (key === "landmark" || key === "type" || key === "fullname") return;

      if (typeof address[key] === "string" && !address[key].trim()) {
        errors[key] = "This field is required";
      } else if (key === "mobilenum" && !/^[6-9]\d{9}$/.test(address[key])) {
        errors[key] = "Enter a valid mobile number";
      }
    });

    setAddressErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      let res;
      if (editingAddressIndex !== null) {
       
        res = await fetch(`${BASE_URL}/addresses`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            index: editingAddressIndex,
            updatedAddress: address,
          }),
        });
      } else {
        // ➕ ADD (your existing code)
        res = await fetch(`${BASE_URL}/addresses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(address),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setAddressStatus("error");
setAddressMessage(data.message || "Operation failed");
setShowAddressModal(true);
      } else {
        setAddressStatus("success");
setAddressAction(editingAddressIndex !== null ? "edit" : "add");
setAddressMessage(
  editingAddressIndex !== null
    ? "Updated Successfully"
    : "Added Successfully"
);
setShowAddressModal(true);

        // ✅ Refresh list
        fetchAddresses();

        // ✅ Reset form
        setAddress({
          fullname: "",
          mobilenum: "",
          addl1: "",
          addl2: "",
          landmark: "",
          pincode: "",
          city: "",
          state: "",
          type: "",
        });

        setEditingAddressIndex(null);
        setShowAddressForm(false);
      }
    } catch (error) {
      //console.error(error);
      toast.error("Something went wrong", { id: "submit" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = (index) => {
    setShowDeletePopup(true);
    setDeleteAddressIndex(index);
  };
  const handleSpecificAddressDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (deleteAddressIndex !== null) {
        const addressId = addresses[deleteAddressIndex]._id; // 👈 important

        const res = await fetch(`${BASE_URL}/addresses/${addressId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          // ✅ update UI (remove deleted address)
          const updatedAddresses = addresses.filter(
            (_, index) => index !== deleteAddressIndex,
          );
          setAddresses(updatedAddresses);

          // ✅ toast success
          toast.success(data.message || "Address deleted successfully");
        } else {
          toast.error(data.message || "Failed to delete address");
        }
        setShowDeletePopup(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      //console.error(error);
    }
  };
  const [showAppointmentCancelPopup, setShowAppointmentCancelPopup] =
    useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  // ✅ ACTIVE FILTER STATE
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchReviews();
  }, []);

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);

      const res = await fetch(`${BASE_URL}/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setAppointments(data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredAppointments =
    activeFilter === "All"
      ? appointments
      : appointments.filter(
          (item) => item.status?.toLowerCase() === activeFilter.toLowerCase(),
        );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);
  const handleAppointmentCancel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/appointments/${cancelAppointmentId}`, // ✅ correct route
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Appointment cancelled");

        // ✅ CLOSE POPUP
        setShowAppointmentCancelPopup(false);

        // ✅ 🔥 UPDATE UI INSTANTLY (IMPORTANT)
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === cancelAppointmentId
              ? { ...item, status: "cancelled" }
              : item,
          ),
        );

        // ✅ also update selectedAppointment (details view)
        setSelectedAppointment((prev) =>
          prev && prev._id === cancelAppointmentId
            ? { ...prev, status: "cancelled" }
            : prev,
        );
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [showRescheduleResponsePopup, setShowRescheduleResponsePopup] =
    useState(false);
  const [rescheduleResponse, setRescheduleResponse] = useState({
    success: false,
    message: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const handleReschedule = (id) => {
    setRescheduleAppointmentId(id);
    setShowReschedulePopup(true);
  };
  const handleConfirmReschedule = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/appointments/reschedule/${rescheduleAppointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(rescheduleData),
        },
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ SUCCESS
        setRescheduleResponse({
          success: true,
          message: data.message || "Rescheduled successfully",
        });

        setShowReschedulePopup(false);
        setShowRescheduleResponsePopup(true);

        // ✅ update UI instantly
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === rescheduleAppointmentId
              ? {
                  ...item,
                  dateOfAppointment: rescheduleData.date,
                  time: rescheduleData.time,
                }
              : item,
          ),
        );
      } else {
        // ❌ ERROR
        setRescheduleResponse({
          success: false,
          message: data.message || "Failed to reschedule appointment",
        });

        setShowRescheduleResponsePopup(true);
      }
    } catch (err) {
      setRescheduleResponse({
        success: false,
        message: "Something went wrong",
      });

      setShowRescheduleResponsePopup(true);
    }
  };
  const generateTimeSlots = (date) => {
    if (!date) return [];

    const selectedDate = new Date(date);
    const day = selectedDate.getDay(); // 0 = Sunday

    let startHour = 8;
    let endHour = day === 0 ? 13 : 20; // Sunday → 1PM, others → 8PM

    const slots = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

      slots.push(`${formattedHour}:00 ${ampm}`);
    }

    return slots;
  };
  const [reviewData, setReviewData] = useState({
    appointmentId: null,
    rating: 0,
    review: "",
  });
  const [reviews, setReviews] = useState({});
  const handleSubmitReview = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId,
          rating: reviewData.rating,
          review: reviewData.review,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Review submitted successfully");

        // ✅ store review for that appointment
        setReviews((prev) => ({
          ...prev,
          [appointmentId]: {
            rating: reviewData.rating,
            review: reviewData.review,
          },
        }));

        // reset form
        setReviewData({
          appointmentId: null,
          rating: 0,
          review: "",
        });
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
    //console.log(reviewData);
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/reviews/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🔥 convert array → object (easy access)
      const reviewMap = {};
      data.forEach((r) => {
        reviewMap[r.appointmentId] = {
          rating: r.rating,
          review: r.review,
        };
      });

      setReviews(reviewMap);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <section
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
        }}
        className=" mt-21 flex items-center justify-center p-6 bg-[#ffffff]"
      >
        <div className="flex w-full max-w-5xl gap-6 flex-col lg:flex-row">
          {/* LEFT SIDEBAR */}
          <div className="lg:w-1/4 w-full bg-[#ffffff] rounded-lg shadow-sm border border-[#bfbfbf] flex flex-row lg:flex-col py-2 lg:py-4 overflow-x-auto lg:overflow-x-visible">
            {/* MENU ITEMS */}
            <div className="flex lg:flex-col flex-row flex-grow">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setShowAddressForm(false);
                  }}
                  className={`flex items-center justify-center lg:justify-start gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium transition-colors border-l-0 lg:border-l-4 min-w-[80px] lg:min-w-full ${
                    activeTab === item.name
                      ? "text-[#b50b0b] border-[#b50b0b] bg-red-50"
                      : "text-gray-600 border-transparent hover:bg-gray-50"
                  }`}
                >
                  <img src={item.icon} alt="" className="w-5 h-5" />
                  <span className="hidden lg:inline">{item.name}</span>
                </button>
              ))}
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => setShowLogoutPopup(true)}
              className="flex items-center justify-center lg:justify-start gap-2 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium mt-0 lg:mt-auto min-w-[80px] lg:min-w-full cursor-pointer"
            >
              <img src={logout} alt="" className="w-5 h-5" />
              <span className="hidden lg:inline">Logout</span>
            </button>

            {/* POPUP (UNCHANGED) */}
            {showLogoutPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
                <div className="bg-white w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 flex flex-col items-center rounded-lg border border-[#b50b0b] shadow-lg">
                  {/* Optional icon */}
                  <img src="" alt="" className="w-12 sm:w-14 md:w-16 mb-3" />

                  <p className="text-gray-700 mb-6 font-medium text-sm sm:text-base text-center">
                    Are you sure you want to logout?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                    {/* YES */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        setShowLogoutPopup(false);
                        window.location.href = "/";
                      }}
                      className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg cursor-pointer w-full sm:w-[100px] text-sm sm:text-base"
                    >
                      Yes
                    </button>

                    {/* NO */}
                    <button
                      onClick={() => setShowLogoutPopup(false)}
                      className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg cursor-pointer w-full sm:w-[100px] text-sm sm:text-base"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:w-3/4 space-y-4 border border-[#bbbbbb] bg-[#ffffff] p-2 rounded-lg shadow-lg overflow-x-auto lg:overflow-x-visible">
            {/* SHOW PERSONAL INFO IF ACTIVE */}
            {activeTab === "My Profile" && (
              <>
                {/* HEADER */}
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#bfbfbf] flex items-center gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible">
                  {/* PROFILE IMAGE */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={profile}
                      alt="Profile"
                      className="w-12 h-12 sm:w-15 sm:h-15 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full border shadow-sm">
                      <img
                        src={camera}
                        alt=""
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                    </button>
                  </div>

                  {/* USER INFO */}
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 truncate">
                      {formData.email}
                    </p>
                  </div>
                </div>

                {/* FORM CARD */}
                <div className="bg-white rounded-lg shadow-sm border border-[#bfbfbf] overflow-x-auto lg:overflow-x-visible">
                  <div className="flex flex-row justify-between items-center px-4 sm:px-6 py-4 border-b gap-2">
                    <h3 className="font-bold text-sm sm:text-base">
                      Personal Information
                    </h3>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:underline self-start sm:self-auto"
                    >
                      <img src={edit} alt="" className="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <div className="p-8 py-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {/* Existing personal info fields here */}
                      {/* First Name */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          First Name*
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            });
                            validateField("firstName", e.target.value);
                          }}
                          className={`w-full px-3 py-1 border rounded-md ${
                            formErrors.firstName
                              ? "border-red-500 bg-red-50"
                              : "border-[#bfbfbf] bg-[#eaeaea]"
                          } focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60`}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      {/* Last Name */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            });
                            validateField("lastName", e.target.value);
                          }}
                          className={`w-full px-3 py-1 border rounded-md ${
                            formErrors.lastName
                              ? "border-red-500 bg-red-50"
                              : "border-[#bfbfbf] bg-[#eaeaea]"
                          } focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60`}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-sm">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          Email*
                        </label>
                        <input
                          type="email"
                          disabled={true}
                          value={formData.email}
                          className="w-full px-3 py-1 bg-[#eaeaea] border border-[#bfbfbf] rounded-md focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          Mobile Number*
                        </label>
                        <div className="flex gap-2">
                          {/* Fixed Indian Flag */}
                          <div className="w-[45px] h-9 flex-shrink-0 flex items-center justify-center px-3 border rounded-lg border-[#bfbfbf] bg-white">
                            <img src={flag} alt="" className="w-5" />
                          </div>

                          {/* Input for number only */}
                          <input
                            type="tel"
                            placeholder="Enter Mobile Number"
                            disabled={!isEditing}
                            value={formData.mobile}
                            onChange={(e) => {
                              const phone = e.target.value; // get value from event
                              setFormData({ ...formData, mobile: phone });
                              validateField("mobile", phone);
                            }}
                            className="w-full px-3 py-1 bg-[#eaeaea] border border-[#bfbfbf] rounded-md focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60"
                          />
                        </div>
                        {formErrors.mobile && (
                          <p className="text-red-500 text-sm">
                            {formErrors.mobile}
                          </p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          Gender
                        </label>
                        <select
                          disabled={!isEditing}
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-full px-3 py-1 bg-[#eaeaea] border border-[#bfbfbf] rounded-md focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      {/* DOB */}
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">
                          Date Of Birth
                        </label>
                        <input
                          type="date"
                          disabled={!isEditing}
                          value={formData.dob}
                          onChange={(e) => {
                            setFormData({ ...formData, dob: e.target.value });
                            validateField("dob", e.target.value);
                          }}
                          className={`w-full px-3 py-1 border rounded-md ${
                            formErrors.dob
                              ? "border-red-500 bg-red-50"
                              : "border-[#bfbfbf] bg-[#eaeaea]"
                          } focus:bg-white focus:text-black focus:ring-1 focus:ring-red-500 outline-none disabled:opacity-60`}
                        />
                        {formErrors.dob && (
                          <p className="text-red-500 text-sm">
                            {formErrors.dob}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={handleSave}
                        disabled={
                          !isEditing || Object.keys(formErrors).length > 0
                        }
                        className={`text-sm sm:text-lg w-full sm:w-auto px-6 sm:px-12 py-2 sm:py-3 rounded-lg font-semibold ${
                          isEditing
                            ? "bg-[#b50b0b] text-white cursor-pointer"
                            : "bg-[#eaeaea] text-[#808080] opacity-50 cursor-not-allowed"
                        }`}
                      >
                        Save
                      </button>

                      <button
                        onClick={handleCancel}
                        className={`text-sm sm:text-lg w-full sm:w-auto px-6 sm:px-12 py-2 sm:py-3 rounded-lg font-bold ${
                          isEditing
                            ? "border border-[#b50b0b] bg-white text-[#b50b0b] cursor-pointer"
                            : "border border-[#808080] text-[#757575] cursor-not-allowed"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "My Orders" && (
              <div className="flex h-[500px] w-full justify-center items-center">
                <h4 className="shadow-lg py-20 px-40 bg-[#e50e0e] text-white font-bold rounded-lg">
                  Coming Soon.....
                </h4>
              </div>
            )}

            {/* MY APPOINTMENTS TAB */}
            {activeTab === "My Appointments" && (
              <div className="p-2 min-h-[400px]">
                {/* REQUIRED STATE */}
                {/* const [selectedAppointment, setSelectedAppointment] = useState(null); */}

                {selectedAppointment ? (
                  (() => {
                    const item = selectedAppointment;
                    const apptDate = new Date(item.dateOfAppointment);
                    const todayDate = new Date();
                    const isPast = apptDate < todayDate;

                    return (
                      <div className="">
                        {/* BACK */}
                        <div
                          className="flex items-center sm:gap-3 mb-1 sm:mb-2 cursor-pointer overflow-x-auto  whitespace-nowrap min-w-0"
                          onClick={() => setSelectedAppointment(null)}
                        >
                          <span className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:text-[#b50b0b] transition-colors">
                        ‹
                      </span>

                          <p className="font-semibold text-xs sm:text-sm md:text-lg break-all">
                            Appointment ID: {item._id}
                          </p>
                        </div>
                        <div className="w-full border-t border-gray-300 my-3 hidden sm:block"></div>
                        {/* TOP SECTION */}
                        <div className="flex gap-1 item-start">
                          <div className="flex-grow border border-[#bfbfbf] rounded p-4 shadow mr-4">
                            <div className="flex justify-between items-center p-4 rounded">
                              <div className="flex gap-2 sm:gap-3 items-stretch">
                                <div className="shrink-0 flex items-stretch">
                                  <img
                                    src={detailsCalender}
                                    alt=""
                                    className="h-full w-5 sm:w-6 object-contain"
                                  />
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                  <h3 className="font-bold text-[#b50b0b] text-lg sm:text-xl break-words">
                                    {item.service}
                                  </h3>

                                  <div className="text-xs sm:text-sm flex gap-1 items-center flex-wrap">
                                    <img
                                      src={clock}
                                      alt=""
                                      className="w-3 h-3"
                                    />
                                    <span className="break-words">
                                      {formatDate(item.dateOfAppointment)} ,{" "}
                                      {item.time}
                                    </span>
                                  </div>

                                  <div className="text-xs sm:text-sm flex gap-1 items-center flex-wrap">
                                    <img
                                      src={location}
                                      alt=""
                                      className="w-3 h-3"
                                    />
                                    <span className="break-words">
                                      {item.location}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* STATUS BADGE */}
                              <div
                                className={`px-4 py-1 rounded-full text-white text-sm ${
                                  item.status === "cancelled"
                                    ? "bg-[#e50e0e]"
                                    : isPast
                                      ? "bg-[#00cd3d]"
                                      : "bg-[#ff6200]"
                                }`}
                              >
                                {item.status === "cancelled"
                                  ? "Cancelled"
                                  : isPast
                                    ? "Completed"
                                    : "Upcoming"}
                              </div>
                            </div>
                            <hr className="border border-[#808080]" />

                            {/* DETAILS SECTION */}
                            <div className="flex justify-between gap-6 mt-6 p-4 pt-2 flex-col lg:flex-row">
                              <div>
                                <h3 className="font-bold text-[#b50b0b] mb-3 text-lg">
                                  Appointment Details:
                                </h3>

                                <div className="text-sm space-y-2">
                                  {[
                                    { label: "Name", value: item.name },
                                    { label: "Mobile", value: item.phone },
                                    { label: "Email", value: item.email },
                                    {
                                      label: "Pet Category",
                                      value: item.petCategory,
                                    },
                                    {
                                      label: "Date",
                                      value: formatDate(item.dateOfAppointment),
                                    },
                                    { label: "Service", value: item.service },
                                    { label: "Location", value: item.location },
                                  ].map((row, index) => (
                                    <div key={index} className="flex">
                                      {/* LABEL */}
                                      <span className="w-[140px]">
                                        {row.label}
                                      </span>

                                      {/* COLON */}
                                      <span className="w-[20px] text-center">
                                        :
                                      </span>

                                      {/* VALUE */}
                                      <span className="flex-1">
                                        {row.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {item.status === "booked" && (
                                  <div className="flex gap-4 mt-6">
                                    {/* RESCHEDULE */}
                                    <button
                                      onClick={() => handleReschedule(item._id)}
                                      className="bg-[#b50b0b] text-white px-10 py-2 rounded-xl cursor-pointer"
                                    >
                                      Reschedule
                                    </button>
                                    {showReschedulePopup && (
                                      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                        <div className="bg-white w-[500px] p-6 rounded-lg">
                                          {/* HEADER */}
                                          <div className="flex justify-between items-center border-b pb-2 mb-4">
                                            <h2 className="font-bold text-lg">
                                              Reschedule Appointment
                                            </h2>
                                            <button
                                              onClick={() =>
                                                setShowReschedulePopup(false)
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>

                                          {/* CURRENT DETAILS */}
                                          {selectedAppointment && (
                                            <div>
                                              <h2 className="text-[#404040] font-semibold p-1">
                                                Current Appointment
                                              </h2>
                                              <div className="border p-3 rounded mb-4">
                                                <h3 className="text-[#b50b0b] font-semibold">
                                                  {selectedAppointment.service}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex gap-1 ">
                                                  <img
                                                    src={clock}
                                                    alt=""
                                                    className="w-4 h-4 mt-0.5"
                                                  />
                                                  {formatDate(
                                                    selectedAppointment.dateOfAppointment,
                                                  )}
                                                </p>
                                                <p className="text-sm text-gray-500 flex gap-1 ">
                                                  <img
                                                    src={location}
                                                    alt=""
                                                    className="w-4 h-4 mt-0.5"
                                                  />
                                                  {selectedAppointment.location}
                                                </p>
                                              </div>
                                            </div>
                                          )}

                                          {/* DATE */}
                                          <div className="mb-3">
                                            <label className="font-semibold text-sm">
                                              Select New Date
                                            </label>
                                            <input
                                              type="date"
                                              value={rescheduleData.date}
                                              onChange={(e) =>
                                                setRescheduleData({
                                                  ...rescheduleData,
                                                  date: e.target.value,
                                                })
                                              }
                                              className="w-full border rounded px-3 py-2 mt-1"
                                            />
                                          </div>

                                          {/* TIME */}
                                          <div className="mb-3">
                                            <label className="font-semibold text-sm">
                                              Time
                                            </label>

                                            <select
                                              value={rescheduleData.time}
                                              onChange={(e) =>
                                                setRescheduleData({
                                                  ...rescheduleData,
                                                  time: e.target.value,
                                                })
                                              }
                                              className="w-full border rounded px-3 py-2 mt-1"
                                            >
                                              <option value="">
                                                Choose Time
                                              </option>

                                              {generateTimeSlots(
                                                rescheduleData.date,
                                              ).map((slot, index) => (
                                                <option
                                                  key={index}
                                                  value={slot}
                                                >
                                                  {slot}
                                                </option>
                                              ))}
                                            </select>
                                          </div>

                                          {/* REASON */}
                                          <div className="mb-4">
                                            <label className="font-semibold text-sm">
                                              Reason for Reschedule (Optional)
                                            </label>
                                            <textarea
                                              value={rescheduleData.reason}
                                              onChange={(e) =>
                                                setRescheduleData({
                                                  ...rescheduleData,
                                                  reason: e.target.value,
                                                })
                                              }
                                              className="w-full border rounded px-3 py-2 mt-1"
                                              placeholder="Type your message here..............."
                                              rows={3}
                                            />
                                          </div>

                                          {/* BUTTONS */}
                                          <div className="flex gap-4 justify-between w-full mt-7">
                                            <button
                                              onClick={handleConfirmReschedule}
                                              className="bg-[#b50b0b] text-white  py-2 rounded w-1/2"
                                            >
                                              Confirm
                                            </button>

                                            <button
                                              onClick={() =>
                                                setShowReschedulePopup(false)
                                              }
                                              className="border border-[#b50b0b] text-[#b50b0b]  py-2 rounded w-1/2"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {showRescheduleResponsePopup && (
                                      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                        <div className="bg-white w-[500px] p-8 rounded-2xl text-center shadow-lg">
                                          {/* ICON */}
                                          <div className="flex justify-center mb-4">
                                            <div
                                              className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl ${
                                                rescheduleResponse.success
                                                  ? "bg-green-500"
                                                  : "bg-red-500"
                                              }`}
                                            >
                                              {rescheduleResponse.success
                                                ? "✔"
                                                : "✕"}
                                            </div>
                                          </div>

                                          {/* TITLE */}
                                          <h2 className="text-2xl font-bold mb-2">
                                            {rescheduleResponse.success
                                              ? "Appointment Rescheduled!"
                                              : "Reschedule Failed"}
                                          </h2>

                                          {/* MESSAGE */}
                                          <p className="text-gray-600 mb-6 flex flex-col gap-2">
                                            {/* {rescheduleResponse.message} */}
                                            <span>
                                              Thank you, your appointment has
                                              been Rescheduled successfully
                                            </span>
                                            <span>
                                              Go to My Appointments to see the
                                              details and Instructions for your
                                              Appointment
                                            </span>
                                          </p>

                                          {/* BUTTONS */}
                                          <div className="flex justify-center gap-4">
                                            {rescheduleResponse.success && (
                                              <button
                                                onClick={() => {
                                                  setShowRescheduleResponsePopup(
                                                    false,
                                                  );
                                                  setSelectedAppointment(null); // go back to list
                                                }}
                                                className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg cursor-pointer"
                                              >
                                                My Appointments
                                              </button>
                                            )}

                                            <button
                                              onClick={() =>
                                                setShowRescheduleResponsePopup(
                                                  false,
                                                )
                                              }
                                              className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg cursor-pointer"
                                            >
                                              Close
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* CANCEL */}
                                    <button
                                      onClick={() => {
                                        setCancelAppointmentId(item._id); // store id
                                        setShowAppointmentCancelPopup(true);
                                      }}
                                      className="border border-[#b50b0b] text-[#b50b0b] px-10 py-2 rounded-xl cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    {showAppointmentCancelPopup && (
                                      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 z-50 border border-[#b50b0b]">
                                        <div className="bg-white p-10 flex flex-col items-center rounded border border-[#b50b0b]">
                                          <p className="text-gray-700 mb-6 font-medium">
                                            Are you sure you want to cancel the
                                            Appointment?
                                          </p>

                                          <div className="flex gap-4">
                                            {/* YES BUTTON */}
                                            <button
                                              onClick={handleAppointmentCancel}
                                              className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                                            >
                                              Yes
                                            </button>

                                            {/* NO BUTTON */}
                                            <button
                                              onClick={() =>
                                                setShowAppointmentCancelPopup(
                                                  false,
                                                )
                                              }
                                              className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                                            >
                                              No
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {item.status === "completed" && (
                                  <div>
                                    <hr className="w-stretch mt-3 mb-3" />
                                    <div>
                                      <div className="flex gap-1">
                                        <img
                                          src={checkmark}
                                          alt=""
                                          className="bg-[#00cd3d] rounded-xl p-1 "
                                        />
                                        <h3 className="font-semibold">
                                          Appointment Completed Successfully
                                        </h3>
                                      </div>
                                      <p className="text-sm">
                                        Thank you for choosing VetDiag Genomix.
                                        We appreciate your trust in our
                                        veterinary diagnostic services.
                                      </p>
                                      <p className="text-sm">
                                        We look forward to serving you again.
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {item.status === "cancelled" && (
                                  <div>
                                    <hr className="w-stretch mt-3 mb-3" />
                                    <div>
                                      <div className="flex gap-1">
                                        <img
                                          src={cancel}
                                          alt=""
                                          className="w-5 h-5 mt-0.5 "
                                        />
                                        <h3 className="font-semibold">
                                          Appointment Appointment Cancelled
                                        </h3>
                                      </div>
                                      <p className="text-sm">
                                        If you need help booking another test or
                                        choosing the right diagnostic kit for
                                        your pet, our support team is always
                                        available to assist you.
                                      </p>
                                      <p className="text-sm">
                                        Thank you for choosing VetDiag Genomix.
                                        We look forward to serving you again.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {item.status === "booked" && (
                                <div className="flex gap-3">
                                  <div className="border-l-1 border-dashed border-gray-400 self-stretch hidden lg:block"></div>
                                  <div>
                                    <div className="flex flex-col">
                                      <h3 className="font-bold text-[#b50b0b]">
                                        Preparation Instructions:
                                      </h3>
                                      <p className="mt text-sm mb-2">
                                        Please follow these instructions before
                                        bringing your pet for the test
                                      </p>
                                    </div>

                                    <ul className="text-sm space-y-1">
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Fasting required (6–8 hours)
                                      </li>
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Bring previous medical reports
                                      </li>
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Inform about medications
                                      </li>
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Arrive 10–15 minutes early
                                      </li>
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Keep pet secured with leash/carrier
                                      </li>
                                      <li className="flex gap-1">
                                        <img
                                          src={check}
                                          alt=""
                                          className="w-4 h-4 mt-1"
                                        />{" "}
                                        Keep your pet calm before testing
                                      </li>
                                    </ul>
                                    <p className="flex gap-1 text-[13px] mt-3">
                                      <span className="underline font-semibold">
                                        Note:{" "}
                                      </span>
                                      <span>
                                        If your pet is sick or recently
                                        vaccinated, please inform the
                                        veterinarian before the test.
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {(item.status === "completed" ||
                            item.status === "cancelled") && (
<div className="w-50 flex-shrink-0 h-fit border border-[#bfbfbf] rounded-xl p-6 shadow-sm bg-white">
                              {/* ✅ IF REVIEW EXISTS */}
                              {reviews[item._id] ? (
                                <>
                                  <h3 className="font-bold text-xl text-black">
                                    Your Review
                                  </h3>
                                  <hr className="mt-2 mb-4 border-[#bfbfbf]" />

                                  {/* ⭐ SHOW RATING */}
                                  <div className="flex gap-1 mb-4 flex-wrap">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <img
                                        key={star}
                                        src={
                                          reviews[item._id].rating >= star
                                            ? filledstar
                                            : emptystar
                                        }
                                        alt="star"
                                        className="w-6 h-6"
                                      />
                                    ))}
                                  </div>

                                  {/* 📝 REVIEW TEXT */}
                                  <p className="text-sm text-gray-600">
                                    {reviews[item._id].review}
                                  </p>
                                </>
                              ) : (
                                <>
                                  {/* 🔥 ORIGINAL FORM */}
                                  <h3 className="font-bold text-xl text-black">
                                    Write Your Review
                                  </h3>
                                  <hr className="mt-2 mb-4 border-[#bfbfbf]" />

                                  <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                      const isSelected =
                                        reviewData.appointmentId === item._id &&
                                        reviewData.rating >= star;

                                      return (
                                        <img
                                          key={star}
                                          src={
                                            isSelected ? filledstar : emptystar
                                          }
                                          alt="star"
                                          className="w-6 h-6 cursor-pointer transition-transform hover:scale-110"
                                          onClick={() =>
                                            setReviewData((prev) => ({
                                              ...prev,
                                              rating: star,
                                              appointmentId: item._id,
                                            }))
                                          }
                                        />
                                      );
                                    })}
                                  </div>

                                  <textarea
                                    className="w-full border border-[#bfbfbf] rounded-xl p-3 text-sm text-gray-500 outline-none focus:border-gray-400"
                                    rows="5"
                                    placeholder="Type your review......................"
                                    value={
                                      reviewData.appointmentId === item._id
                                        ? reviewData.review
                                        : ""
                                    }
                                    onChange={(e) =>
                                      setReviewData({
                                        ...reviewData,
                                        review: e.target.value,
                                        appointmentId: item._id,
                                      })
                                    }
                                  ></textarea>

                                  <button
                                    onClick={() => handleSubmitReview(item._id)}
                                    disabled={
                                      reviewData.rating === 0 ||
                                      reviewData.review.trim() === "" ||
                                      reviewData.appointmentId !== item._id
                                    }
                                    className={`w-full font-semibold py-3 mt-6 rounded-xl ${
                                      reviewData.rating === 0 ||
                                      reviewData.review.trim() === "" ||
                                      reviewData.appointmentId !== item._id
                                        ? "bg-[#e6e6e6] text-[#707070] cursor-not-allowed"
                                        : "bg-[#b50b0b] text-white cursor-pointer"
                                    }`}
                                  >
                                    Submit
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <>
                    {/* HEADER */}
                    <div className="pb-1 mb-4">
                      <h3 className="font-bold text-base sm:text-lg">
                        My Appointments
                      </h3>
                      <hr className="w-full h-1 color-gray-500" />
                    </div>

                    {/* FILTER TABS */}
                    <div className="flex gap-4 sm:gap-6 border-b border-gray-500 mb-4 overflow-x-auto">
                      {["All", "Booked", "Cancelled"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveFilter(tab)}
                          className={`pb-2 capitalize whitespace-nowrap text-sm sm:text-base ${
                            activeFilter === tab
                              ? "border-b-3 rounded-t border-[#b50b0b] text-[#b50b0b] font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* LOADING */}
                    {appointmentsLoading ? (
                      <div className="h-16 border border-[#bfbfbf] rounded flex items-center justify-center">
                        <p className="text-gray-500">Loading appointments...</p>
                      </div>
                    ) : (
                      (() => {
                        const filteredAppointments = appointments.filter(
                          (item) => {
                            if (activeFilter === "All") return true;
                            if (activeFilter === "Booked")
                              return (
                                item.status === "booked" ||
                                item.status === "completed"
                              );
                            if (activeFilter === "Cancelled")
                              return item.status === "cancelled";
                            return true;
                          },
                        );

                        return filteredAppointments.length === 0 ? (
                          <div className="h-16 border border-[#bfbfbf] rounded flex items-center justify-center">
                            <p>No appointments found.</p>
                          </div>
                        ) : (
                          filteredAppointments.map((item, index) => {
                            const apptDate = new Date(item.dateOfAppointment);
                            const todayDate = new Date();
                            const isPast = apptDate < todayDate;

                            return (
                              <div
                                key={item._id}
                                className="border border-[#bfbfbf] rounded p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 mb-2"
                              >
                                {/* LEFT */}
                                <div className="flex gap-2">
                                  <div>
                                    <img
                                      src={tabsCalender}
                                      alt=""
                                      className="w-8 sm:w-auto"
                                    />
                                  </div>

                                  <div className="flex flex-col justify-between">
                                    <div>
                                      <h3 className="font-bold text-[#b50b0b] text-sm sm:text-base">
                                        {item.service}
                                      </h3>

                                      <p className="flex flex-col sm:flex-row sm:items-center text-sm">
                                        <span className="font-semibold">
                                          Appointment ID :
                                        </span>
                                        <span className="sm:ml-2 break-all text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-base">
                                          {item._id}
                                        </span>
                                      </p>
                                    </div>

                                    {/* STATUS */}
                                    <p
                                      className={`text-xs sm:text-sm flex items-center gap-1 ${
                                        item.status === "cancelled"
                                          ? "text-[#ff0000]"
                                          : item.status === "completed" ||
                                              isPast
                                            ? "text-[#00cd3d]"
                                            : "text-[#ff6200]"
                                      }`}
                                    >
                                      <span
                                        className={`h-2.5 rounded-full mt-0.5 ${
                                          item.status === "cancelled"
                                            ? "w-2.5 border border-[#ff5050] bg-[#e50e0e]"
                                            : item.status === "completed" ||
                                                isPast
                                              ? "w-2.5 border border-[#00cd3d] bg-[#48ff7f]"
                                              : "w-2.5 bg-[#ffc387] border border-[#ff6200]"
                                        }`}
                                      />

                                      <span className="break-words">
                                        {item.status === "cancelled"
                                          ? `Appointment Cancelled on ${formatDate(item.updatedAt)}`
                                          : item.status === "completed"
                                            ? `Attended on ${formatDate(item.dateOfAppointment)}`
                                            : isPast
                                              ? `Attended on ${formatDate(item.dateOfAppointment)}`
                                              : `Next Appointment on ${formatDate(item.dateOfAppointment)}`}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                {/* RIGHT */}
                                <button
                                  onClick={() => setSelectedAppointment(item)}
                                  className="text-xs sm:text-sm underline hover:text-red-600 flex items-center gap-1 group font-bold italic self-start sm:self-center"
                                >
                                  View Details
                                  <img
                                    src={arrow}
                                    alt=""
                                    className="w-4 h-4 mt-1"
                                  />
                                </button>
                              </div>
                            );
                          })
                        );
                      })()
                    )}

                    {/* POPUP (UNCHANGED) */}
                    {showAppointmentCancelPopup && (
                      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 z-50 border border-[#b50b0b]">
                        <div className="bg-white p-6 sm:p-10 flex flex-col items-center rounded border border-[#b50b0b]">
                          <p className="text-gray-700 mb-6 font-medium text-center text-sm sm:text-base">
                            Are you sure you want to cancel Appointment?
                          </p>

                          <div className="flex gap-4">
                            <button
                              onClick={handleSpecificAppointmentCancel}
                              className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                            >
                              Yes
                            </button>

                            <button
                              onClick={() =>
                                setShowAppointmentCancelPopup(false)
                              }
                              className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* SHOW ADDRESS TAB */}
            {activeTab === "My Address" && (
              <div className="p-2 min-h-[400px]">
                {!showAddressForm ? (
                  <div className="space-y-2">
                    <div className="border-b pb-1 mb-4">
                      <h3 className="font-bold">My Addresses</h3>
                    </div>

                    <div className="space-y-2">
                      {loading ? (
                        <div className="h-16 border border-[#bfbfbf] rounded flex items-center justify-center">
                          <p className="text-center text-gray-500">
                            Loading addresses...
                          </p>
                        </div>
                      ) : addresses.length === 0 ? (
                        <div className="h-16 border border-[#bfbfbf] rounded flex items-center justify-center">
                          <p className="text-center">No address found.</p>
                        </div>
                      ) : (
                        addresses.map((addr, index) => (
                          <div
                            key={index}
                            className="border border-[#bfbfbf] rounded p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4"
                          >
                            <div className="flex-shrink-0 flex items-center justify-center bg-[#fff5f5] rounded-lg p-2 sm:p-3 self-start">
                              <img
                                src={
                                  addr.type === "home" ? home_icon : office_icon
                                }
                                alt={addr.type}
                                className="w-12 h-full object-contain"
                              />
                            </div>

                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-lg">
                                  {`${formData.firstName} ${formData.lastName}`}
                                </p>
                                {addr.isDefault && (
                                  <span className="bg-[#b50b0b] text-white text-xs px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm">
                                {addr.addl1} {addr.city}, {addr.state} -{" "}
                                {addr.pincode}
                              </p>
                              <p className="text-sm break-words">
                                +91 {addr.mobilenum}
                              </p>
                            </div>

                            <div className="flex flex-row sm:flex-col lg:flex-row items-start sm:items-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                              {/* EDIT BUTTON TRIGGER */}
                              <button
                                onClick={() => handleEditClick(index)}
                                className="flex items-center gap-1 text-sm hover:text-[#b50b0b] cursor-pointer"
                              >
                                <img
                                  src={edit}
                                  alt="Edit"
                                  className="w-4 h-4"
                                />
                                <u>Edit</u>
                              </button>
                              <button
                                onClick={() => handleDelete(index)}
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:underline"
                              >
                                <img
                                  src={deleteIcon}
                                  alt="delete icon"
                                  className="w-4 h-4"
                                />{" "}
                                Delete
                              </button>
                              {showDeletePopup && (
                                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/10 z-50  border border-[#b50b0b]">
                                  <div className="bg-white p-6 sm:p-10 flex flex-col items-center rounded border border-[#b50b0b] w-[90%] sm:w-auto">
                                    <p className="text-gray-700 mb-6 font-medium">
                                      Are you sure you want to delete?
                                    </p>

                                    <div className="flex gap-4">
                                      {/* YES BUTTON */}
                                      <button
                                        onClick={handleSpecificAddressDelete}
                                        className="bg-[#b50b0b] text-white px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                                      >
                                        Yes
                                      </button>

                                      {/* NO BUTTON */}
                                      <button
                                        onClick={() =>
                                          setShowDeletePopup(false)
                                        }
                                        className="border border-[#b50b0b] text-[#b50b0b] px-6 py-2 rounded-lg cursor-pointer w-[100px]"
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setAddress({
                          ...initialAddress,
                          fullname:
                            formData.firstName + " " + formData.lastName, // ✅ set here
                        });

                        setEditingAddressIndex(null);
                        setShowAddressForm(true);
                      }}
                      className="group flex items-center gap-6 p-5 border-2 border-dashed border-[#808080] rounded-xl cursor-pointer hover:border-[#b50b0b] transition-all"
                    >
                      <div className="w-16 h-16 flex items-center justify-center bg-[#fff5f5] rounded-lg">
                        <span className="text-[#b50b0b] text-4xl font-light">
                          +
                        </span>
                      </div>
                      <span className="font-bold">Add New Address</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white overflow-hidden">
                    {/* Dynamic Header: Edit vs Add */}
                    <div
                      className="flex items-center border-b mb-3 sm:mb-4 cursor-pointer group px-3 sm:px-0"
                      onClick={() => setShowAddressForm(false)}
                    >
                      <span className="text-2xl sm:text-3xl mb-1 sm:mb-2 mr-2 group-hover:text-[#b50b0b] transition-colors">
                        ‹
                      </span>

                      <h3 className="font-semibold text-base sm:text-lg">
                        {editingAddressIndex !== null
                          ? "Edit Address"
                          : "Add New Address"}
                      </h3>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="p-3 sm:p-4 md:p-6 pt-0 space-y-5 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">
                            Full Name*
                          </label>
                          {/* {console.log(address.fullname)} */}

                          <input
                            type="text"
                            name="fullname"
                            placeholder="Enter Full Name"
                            value={`${formData.firstName} ${formData.lastName}`}
                            disabled={isFullnameDisabled}
                            onChange={handleAddressChange}
                            className="w-full h-9 px-4 border rounded-lg border-[#bfbfbf] outline-none bg-[#eaeaea]"
                          />
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">
                            Mobile Number*
                          </label>

                          {/* FLEX ROW */}
                          <div className="flex gap-2">
                            <div className="w-[60px] h-10 flex items-center justify-center px-2 border rounded-lg border-[#bfbfbf] bg-white">
                              <img src={flag} alt="" className="w-5" />
                            </div>

                            <input
                              type="tel"
                              name="mobilenum"
                              placeholder="Enter Mobile Number"
                              value={address.mobilenum || ""}
                              onChange={handleAddressChange}
                              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded font-semibold text-xs sm:text-sm border transition-colors w-full sm:w-auto ${
                                addressErrors.mobilenum
                                  ? "border-red-500 focus:border-red-500"
                                  : "border-[#bfbfbf] focus:border-[#b50b0b]"
                              }`}
                            />
                          </div>
                          {addressErrors.mobilenum && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.mobilenum}
                            </p>
                          )}
                        </div>

                        {/* Address Line 1 */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">
                            Address Line 1*
                          </label>

                          <input
                            type="text"
                            name="addl1"
                            placeholder="House no., Flat no."
                            value={address.addl1 || ""}
                            onChange={handleAddressChange}
                            className={`w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none ${
                              addressErrors.addl1
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#bfbfbf] focus:border-[#b50b0b]"
                            }`}
                          />

                          {addressErrors.addl1 && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.addl1}
                            </p>
                          )}
                        </div>

                        {/* Address Line 2 */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">Country*</label>

                          <input
                            type="text"
                            name="addl2"
                            placeholder="India, America,.."
                            value={address.addl2 || ""}
                            onChange={handleAddressChange}
                            className={`w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none ${
                              addressErrors.addl2
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#bfbfbf] focus:border-[#b50b0b]"
                            }`}
                          />

                          {addressErrors.addl2 && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.addl2}
                            </p>
                          )}
                        </div>

                        {/* Landmark */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">Landmark</label>
                          <input
                            type="text"
                            name="landmark"
                            placeholder="Enter Landmark"
                            value={address.landmark}
                            onChange={handleAddressChange}
                            className="w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none"
                          />
                        </div>

                        {/* Pincode */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">Pincode*</label>

                          <input
                            type="text"
                            name="pincode"
                            placeholder="House no., Flat no."
                            value={address.pincode || ""}
                            onChange={handleAddressChange}
                            className={`w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none ${
                              addressErrors.pincode
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#bfbfbf] focus:border-[#b50b0b]"
                            }`}
                          />

                          {addressErrors.pincode && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.pincode}
                            </p>
                          )}
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">City*</label>

                          <input
                            type="text"
                            name="city"
                            placeholder="House no., Flat no."
                            value={address.city || ""}
                            onChange={handleAddressChange}
                            className={`w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none ${
                              addressErrors.city
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#bfbfbf] focus:border-[#b50b0b]"
                            }`}
                          />

                          {addressErrors.city && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.city}
                            </p>
                          )}
                        </div>

                        {/* State */}
                        <div className="space-y-1">
                          <label className="text-sm font-bold">State*</label>

                          <input
                            type="text"
                            name="state"
                            placeholder="House no., Flat no."
                            value={address.state || ""}
                            onChange={handleAddressChange}
                            className={`w-full h-10 sm:h-9 md:h-10 px-3 sm:px-4 text-sm sm:text-base border rounded-lg outline-none ${
                              addressErrors.state
                                ? "border-red-500 focus:border-red-500"
                                : "border-[#bfbfbf] focus:border-[#b50b0b]"
                            }`}
                          />

                          {addressErrors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {addressErrors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address Type Selectors */}
                      <div className="flex gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() =>
                            setAddress({ ...address, type: "home" })
                          }
                          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm border transition-colors w-full sm:w-auto ${
                            address.type === "home"
                              ? "bg-[#fff5f5] border-red-300 text-[#b50b0b]"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <img src={home} alt="" className="w-5 h-5" /> Home
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setAddress({ ...address, type: "office" })
                          }
                          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm border transition-colors w-full sm:w-auto ${
                            address.type === "office"
                              ? "bg-[#fff5f5] border-red-300 text-[#b50b0b]"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <img src={office} alt="" className="w-5 h-5" /> Office
                        </button>
                      </div>

                      <div className="flex justify-center gap-5">
                        <button
                          type="submit"
                          className="w-[140px] py-2 bg-[#b50b0b] text-white rounded-xl font-bold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="w-[140px] py-2 border border-red-300 text-[#b50b0b] rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            {showAddressModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">

    <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl border border-red-400 p-6 sm:p-8 text-center shadow-lg">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-full ${
            addressStatus === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span className="text-white text-3xl font-bold">
            {addressStatus === "success" ? "✓" : "✕"}
          </span>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        {addressStatus === "success"
          ? addressMessage
          : "Something went wrong"}
      </h2>

      {/* BUTTON */}
      <button
        onClick={() => setShowAddressModal(false)}
        className="bg-[#c60c0c] text-white px-6 py-2 rounded-lg w-full sm:w-[200px]"
      >
        Okay
      </button>

    </div>
  </div>
)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png"
import { NavLink } from 'react-router-dom';
import profile from "../assets/navbar-images/profile.png";
import axios from "axios"
import toast from "react-hot-toast"; // ✅
const BASE_URL=import.meta.env.VITE_BASE_URL;

const Signup = () => {

  const initialState = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ added

  const regex = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
  };

  const validate = () => {
    let newErrors = {};

    if (!regex.name.test(formData.name)) newErrors.name = "Enter a valid name (2-30 characters).";
    if (!regex.email.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!regex.phone.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!regex.password.test(formData.password)) newErrors.password = "Must be 8+ characters with letters & numbers.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    setLoading(true); // ✅ start loading

    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        formData
      );

      // ✅ toast success
      toast.success(response.data.message || "Admin registered! Verify email");

      // ✅ reset form
      setFormData(initialState);

    } catch (err) {
      // ❌ toast error
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors(prev => {
      let newErrors = { ...prev };

      if (name === "name") {
        if (!regex.name.test(value)) newErrors.name = "Enter a valid name (2-30 letters)";
        else delete newErrors.name;
      }

      if (name === "email") {
        if (!regex.email.test(value)) newErrors.email = "Enter a valid email";
        else delete newErrors.email;
      }

      if (name === "phone") {
        if (!regex.phone.test(value)) newErrors.phone = "Enter a valid 10-digit number";
        else delete newErrors.phone;
      }

      if (name === "password") {
        if (!regex.password.test(value)) newErrors.password = "Password must be 8+ chars with letters & numbers";
        else delete newErrors.password;
      }

      if (name === "confirmPassword") {
        if (value !== formData.password) newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
      }

      return newErrors;
    });
  };

  return (
    <div style={{backgroundImage:`url(${bg})`}} className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-8 flex flex-col items-center">
        
        <div className="mb-4">
          <img src={profile} alt="" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-center text-sm mb-6">Join VetDiag Genomix to access diagnostic services and reports.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {/* Name */}
          <div className="flex flex-col gap-1">
            <div className={`relative flex items-center border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}>
              <User size={18} className="absolute left-3 text-gray-400" />
              <input
                name="name"
                value={formData.name}   // ✅ controlled
                type="text"
                placeholder="Enter Your Full Name"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
              />
            </div>
            {errors.name && <span className="text-[10px] text-red-500 ml-1">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className={`relative flex items-center border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}>
              <Mail size={18} className="absolute left-3 text-gray-400" />
              <input
                name="email"
                value={formData.email}
                type="email"
                placeholder="Enter Your Email Address"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 ml-1">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <div className={`relative flex items-center border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}>
              <Phone size={18} className="absolute left-3 text-gray-400" />
              <input
                name="phone"
                value={formData.phone}
                type="tel"
                placeholder="Enter Your phone Number"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
              />
            </div>
            {errors.phone && <span className="text-[10px] text-red-500 ml-1">{errors.phone}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className={`relative flex items-center border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
              <Lock size={18} className="absolute left-3 text-gray-400" />
              <input
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="Create Your Password"
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 text-sm outline-none rounded-lg"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] ml-1">Password must contain 8 characters</p>
            {errors.password && <span className="text-[10px] text-red-500 ml-1">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <div className={`relative flex items-center border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}>
              <Lock size={18} className="absolute left-3 text-gray-400" />
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
              />
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-red-500 ml-1">{errors.confirmPassword}</span>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#b50b0b] text-white font-bold py-2.5 rounded-lg mt-4 hover:bg-red-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Submitting..." : "Create Your Account"}
          </button>
        </form>

        <p className="text-lg mt-6 text-gray-600 font-semibold">
          Already have an account? 
          <NavLink to="/sign-in" className="text-[#b50b0b] hover:underline cursor-pointer"> Log in</NavLink>
        </p>
        
        {/* DO NOT REMOVE */}
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-s">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
          Continue with Google
        </button>

      </div>
    </div>
  );
};

export default Signup;
import React, { useState } from "react";
import { Mail } from "lucide-react";
import key from "../assets/user/key.png";
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";
import axios from "axios";
import toast from "react-hot-toast"; // ✅ added
import { NavLink } from "react-router-dom";
const BASE_URL=import.meta.env.VITE_BASE_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState({ email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail({ email: value });

    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // ✅ start loading

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        email
      );

      toast.success(response.data.message || "Verification code sent"); // ✅ toast

      setEmail({ email: "" }); // optional reset

    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message); // ✅ toast error
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="min-h-screen bg-center bg-cover flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
        
        <div className="flex justify-center mb-4">
          <img src={key} alt="" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Forget Password?
        </h2>
        <p className="text-sm text-center mb-6">
          Enter your registered email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-800 ml-1">
              Email Address
            </label>
            <div
              className={`relative flex items-center border rounded-lg ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail size={18} className="absolute left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 text-sm outline-none rounded-lg"
                required
              />
            </div>
            {error && (
              <span className="text-[10px] text-red-500 ml-1">{error}</span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading} // ✅ disable click
            className={`w-full font-bold py-2.5 rounded-lg bg-[#b50b0b] text-white 
  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send Verification email"} {/* ✅ text change */}
          </button>

          <NavLink
  to="/sign-in"
  className="block w-full text-center border border-[#b50b0b] text-[#b50b0b] font-semibold py-2.5 rounded-lg transition-colors hover:bg-[#b50b0b] hover:text-white"
>
  Back to Login
</NavLink>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
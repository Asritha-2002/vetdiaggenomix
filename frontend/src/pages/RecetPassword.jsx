import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import key from "../assets/user/key.png";
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png";
const BASE_URL=import.meta.env.VITE_BASE_URL;

const RecetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/reset-password`,
        { token, password }
      );
      alert(response.data.message);
      navigate("/login"); // redirect to login after success
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] px-10 py-12 flex flex-col items-center">
        
        {/* Top Circular Key Icon */}
        <div className="mb-3">
          <img src={key} alt="key" />
        </div>

        {/* Header Section */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Password</h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Enter your new password
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">New Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#b50b0b] transition-colors">
                <Lock size={18} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter Your New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b50b0b] focus:border-[#b50b0b] placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">Confirm Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#b50b0b] transition-colors">
                <Lock size={18} />
              </span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b50b0b] focus:border-[#b50b0b] placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#b50b0b] hover:bg-[#a00a0a] text-white font-bold py-3.5 rounded-lg transition-all shadow-md active:scale-[0.98] mt-4 text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecetPassword;
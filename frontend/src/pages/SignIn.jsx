import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png"
import profile from "../assets/navbar-images/profile.png";
const BASE_URL=import.meta.env.VITE_BASE_URL;


const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Controlled form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type === "email" ? "email" : "password"]: e.target.value
    });
  };

  // ✅ Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${BASE_URL}/login`, formData);

    toast.success(res.data.message || "Login successful");

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    const isAdmin = res.data.user?.isAdmin;

    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

    // ✅ ONLY NAVIGATE HERE
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div style={{backgroundImage:`url(${bg})`}} className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] px-8 py-10 flex flex-col items-center">
        
        <div className="mb-4">
          <img src={profile} alt="" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in to Your Account</h1>
        <p className="text-center text-sm mb-5 px-6 leading-relaxed">
          Welcome back! please enter your credentials to access your account.
        </p>

        {/* ✅ attach submit */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          
          <div className='space-y-4'>
            <label className="text-sm font-semibold text-gray-800 ml-1">Email Address</label>
            <div className="relative group mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#b50b0b] transition-colors">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email Address"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b50b0b] focus:border-[#b50b0b] placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-800 ml-1">Password</label>
            <div className="relative group mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#b50b0b] transition-colors">
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b50b0b] focus:border-[#b50b0b] placeholder-gray-400"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="w-full flex justify-end">
              <NavLink to="/forget-password" className="text-s text-[#b50b0b] cursor-pointer underline pt-0.5 font-semibold">
                Forget Password?
              </NavLink>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#b50b0b] hover:bg-[#8e0909] text-white font-bold py-3 rounded-lg transition-colors mt-2">
            Login
          </button>
        </form>

        <p className="text-md text-gray-700 mt-3 font-semibold">
          Don't have an account?{" "}
          <span className="text-md text-[#b50b0b] cursor-pointer hover:underline">
            <NavLink to="/sign-up">Sign up</NavLink>
          </span>
        </p>

        <div className="w-full flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-s font-medium">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="google" 
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-semibold text-sm">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
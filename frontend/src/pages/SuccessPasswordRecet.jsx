import React from 'react'
import lock from "../assets/user/lock.png"
import { useNavigate } from 'react-router-dom';
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png"

const SuccessPasswordRecet = () => {
    
    const navigate = useNavigate();
  return (
    <div style={{backgroundImage:`url(${bg})`}} className="min-h-screen flex items-center justify-center bg-cover bg-center">
    <div className="text-center bg-[#ffffff] w-[300px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#b50b0b]">
              <img src={lock} alt="" />
              <p className="text-gray-700 mb-6">
                Password Changed successfully.
              </p>
              <button
                onClick={() => navigate("/sign-in")}
                className="bg-[#b50b0b] text-white px-20 py-2 rounded-lg"
              >
                Login
              </button>
            </div>
            </div>
  )
}

export default SuccessPasswordRecet
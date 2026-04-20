import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/hero-sections-contact/contactsectionbgc-1.png"

const FailPasswordRecet = () => {
  const navigate = useNavigate();

  return (
    <div style={{backgroundImage:`url(${bg})`}} className="min-h-screen flex items-center justify-center bg-cover bg-center">
      
      <div className="text-center bg-[#ffffff] w-[350px] p-8 rounded-xl flex flex-col items-center justify-center border border-[#b50b0b] shadow-lg">
        
        <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <FaTimes className="text-white text-2xl" />
        </div>

        <p className="text-gray-700 mb-6">Token Expired</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/forget-password")}
            className="bg-[#b50b0b] text-white px-20 py-2 rounded-lg"
          >
            Forget Password
          </button>

          <button
            onClick={() => navigate("/sign-in")}
            className="bg-[#b50b0b] text-white px-20 py-2 rounded-lg"
          >
            Login
          </button>
        </div>

      </div>

    </div>
  );
};

export default FailPasswordRecet;
import React from "react";
import { useLocation } from "react-router-dom";

const SummaryStepper = () => {
  const location = useLocation();

  const getStep = () => {
    if (location.pathname.includes("address")) return 1;
    if (location.pathname.includes("summary")) return 2;
    if (location.pathname.includes("payment")) return 3;
    return 1;
  };

  const activeStep = getStep();

  const Step = ({ number, label }) => {
    const isCompleted = activeStep > number;
    const isActive = activeStep === number;
    const isPending = activeStep < number;

    return (
      <div className={`flex flex-col items-center ${isPending ? "opacity-50" : ""}`}>

        {/* CIRCLE */}
        <div
          className={`w-6 h-6 rounded-full text-[12px] flex items-center justify-center font-bold transition-colors ${
            isActive || isCompleted
              ? "bg-[#b50b0b] text-white"
              : "border border-gray-400 text-gray-500"
          }`}
        >
          {isCompleted ? "✓" : number}
        </div>

        {/* LABEL */}
        <span 
          className={`text-[14px] whitespace-nowrap ${
            isActive ? "font-semibold" : "font-medium"
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">

      {/* STEP 1 */}
      <Step number={1} label="Address" />

       <div className={`h-[1px] w-12 mx-1 -mt-5 ${activeStep > 1 ? "bg-[#b50b0b]" : "bg-gray-300"}`}></div>

      {/* STEP 2 (SUMMARY PAGE ACTIVE HERE) */}
      <Step number={2} label="Order Summary" />

       {/* <div className={`h-[1px] w-12 mx-1 -mt-5 ${activeStep > 2 ? "bg-[#b50b0b]" : "bg-gray-300"}`}></div> */}

      {/* STEP 3 */}
      {/* <Step number={3} label="Payment" /> */}
    </div>
  );
};

export default SummaryStepper;
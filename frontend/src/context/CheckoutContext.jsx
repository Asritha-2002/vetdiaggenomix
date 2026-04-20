import React, { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// custom hook (clean usage)
export const useCheckout = () => useContext(CheckoutContext);
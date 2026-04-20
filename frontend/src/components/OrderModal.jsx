import { useState } from "react";

const OrderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Order Details</h3>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p>Order details will be shown here...</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
            Close
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
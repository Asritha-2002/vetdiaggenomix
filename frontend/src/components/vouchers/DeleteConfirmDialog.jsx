import React, { useEffect } from "react";

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  voucherCode,
}) {
  // 🔒 Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // ❌ Don't render if not open
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-800">
          Delete Voucher
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to delete voucher{" "}
          <span className="font-semibold text-gray-800">
            {voucherCode}
          </span>
          ? This action cannot be undone.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          {/* CANCEL */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          {/* DELETE */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}
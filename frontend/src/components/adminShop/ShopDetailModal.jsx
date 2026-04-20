import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast"

/* ================= API ================= */
const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export const createCharge = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/charges`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.success(res.data?.message || "Charge created successfully");

    return res.data;
  } catch (error) {
    console.error("Create Charge Error:", error);

    toast.error(
      error?.response?.data?.message || "Failed to create charge"
    );

    throw error; // important so UI can also handle it if needed
  }
};

export const updateCharge = async (id, data) => {
  try {
    const res = await axios.patch(`${BASE_URL}/charges/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.success(res.data?.message || "Charge updated successfully");

    return res.data;
  } catch (error) {
    console.error("Update Charge Error:", error);

    toast.error(
      error?.response?.data?.message || "Failed to update charge"
    );

    throw error;
  }
};

/* ================= MODAL WRAPPER ================= */
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

/* ================= INPUT ================= */
const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={
      "w-full h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 " +
      className
    }
  />
));

/* ================= SELECT ================= */
function Select({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">Select Type</option>
      <option value="GST">GST</option>
      <option value="DELIVERY">Delivery</option>
    </select>
  );
}

/* ================= BUTTON ================= */
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "h-11 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 " +
        className
      }
    >
      {children}
    </button>
  );
}

/* ================= MAIN MODAL ================= */

export default function ShopDetailModal({
  open,
  onOpenChange,
  detail,
  onSave,
}) {
  const isEditing = !!detail;

  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [sgst, setSgst] = useState("");
  const [cgst, setCgst] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (detail) {
      setCategory(detail.chargeType === "gst" ? "GST" : "DELIVERY");

      if (detail.chargeType === "delivery") {
        setValue(detail.value || "");
      }

      if (detail.chargeType === "gst" && detail.subCharges) {
        const sg = detail.subCharges.find((i) => i.name === "SGST");
        const cg = detail.subCharges.find((i) => i.name === "CGST");

        setSgst(sg?.value || "");
        setCgst(cg?.value || "");
      }
    } else {
      setCategory("");
      setValue("");
      setSgst("");
      setCgst("");
    }

    setErrors({});
  }, [detail]);

  /* ================= VALIDATION ================= */
  const validate = () => {
    let err = {};

    if (!category) err.category = "Category is required";

    if (category === "DELIVERY") {
      if (!value) err.value = "Delivery value is required";
    }

    if (category === "GST") {
      if (!sgst) err.sgst = "SGST is required";
      if (!cgst) err.cgst = "CGST is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setSaving(true);

  try {
    let payload;

    if (category === "DELIVERY") {
      payload = {
        chargeType: "delivery",
        type: "fixed",
        value: Number(value),
        subCharges: [],
      };
    }

    if (category === "GST") {
      payload = {
        chargeType: "gst",
        type: "percentage",
        value: 0,
        subCharges: [
          { name: "SGST", value: Number(sgst) },
          { name: "CGST", value: Number(cgst) },
        ],
      };
    }

    let res;

    // 🔥 UPDATE FLOW
    if (isEditing) {
      res = await updateCharge(detail._id, payload);
    } 
    // 🔥 CREATE FLOW
    else {
      res = await createCharge(payload);
    }

    onSave?.(res);
    onOpenChange(false);

    setCategory("");
    setValue("");
    setSgst("");
    setCgst("");
    setErrors({});

  } catch (err) {
    console.error("Submit failed");
  } finally {
    setSaving(false);
  }
};

  return (
    <Modal open={open} onClose={() => onOpenChange(false)}>

      {/* CLOSE */}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 text-gray-400 hover:text-black"
      >
        <X className="w-4 h-4" />
      </button>

      {/* TITLE */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit" : "Add"} Charge
        </h2>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CATEGORY */}
        <div>
          <Select value={category} onChange={setCategory} />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* DELIVERY */}
        {category === "DELIVERY" && (
          <div>
            <Input
              placeholder="Delivery Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {errors.value && (
              <p className="text-red-500 text-xs mt-1">{errors.value}</p>
            )}
          </div>
        )}

        {/* GST */}
        {category === "GST" && (
          <>
            <div>
              <Input
                placeholder="SGST %"
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
              />
              {errors.sgst && (
                <p className="text-red-500 text-xs mt-1">{errors.sgst}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="CGST %"
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
              />
              {errors.cgst && (
                <p className="text-red-500 text-xs mt-1">{errors.cgst}</p>
              )}
            </div>
          </>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 border"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Update" : "Add"}
          </Button>

        </div>

      </form>
    </Modal>
  );
}
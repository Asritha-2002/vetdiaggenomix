import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

/* ================= SIMPLE COMPONENTS ================= */
const Button = ({ children, variant = "default", className = "", ...props }) => {
  const base =
    "inline-flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-2 h-10 transition";

  const styles = {
    default: "bg-purple-500 text-white hover:bg-purple-600",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = (props) => (
  <input
    {...props}
    className="w-full h-11 rounded-xl border px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
  />
);

const Label = ({ children }) => (
  <label className="text-sm font-semibold">{children}</label>
);

const Switch = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition ${
      checked ? "bg-purple-500" : "bg-gray-300"
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </div>
);

/* ================= FORM ================= */
export default function VoucherForm({ voucher, onSave, onCancel }) {
  const isEdit = !!voucher;

  const [form, setForm] = useState({
    code: voucher?.code || "",
    type: voucher?.type || "fixed",
    value: voucher?.value || "",

    max_discount: voucher?.maxDiscount || "",
    min_purchase: voucher?.minPurchase || "",
    max_uses: voucher?.maxUses || "",

    expiry_date: voucher?.expiryDate
      ? new Date(voucher.expiryDate).toISOString().split("T")[0]
      : "",

    is_active: voucher?.isActive ?? true,

    description: voucher?.description || "",

    complimentary_quantity: voucher?.complimentaryConfig?.quantity || "",
    complimentary_min_price: voucher?.complimentaryConfig?.minPrice || "",
    complimentary_max_price: voucher?.complimentaryConfig?.maxPrice || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        code: form.code,
        type: form.type,
        value:
          form.type !== "complimentary" ? Number(form.value) : null,

        maxDiscount: form.max_discount
          ? Number(form.max_discount)
          : null,

        minPurchase: Number(form.min_purchase) || 0,

        maxUses: form.max_uses ? Number(form.max_uses) : null,

        expiryDate: form.expiry_date || null,

        isActive: form.is_active,

        description: form.description,
      };

      if (form.type === "complimentary") {
        data.complimentaryConfig = {
          quantity: Number(form.complimentary_quantity),
          minPrice: Number(form.complimentary_min_price),
          maxPrice: form.complimentary_max_price
            ? Number(form.complimentary_max_price)
            : null,
        };
      }

      const token = localStorage.getItem("token");
      let res;

      if (isEdit) {
        res = await axios.patch(
          `${BASE_URL}/vouchers/${voucher._id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Voucher updated successfully 🎉");
      } else {
        res = await axios.post(`${BASE_URL}/vouchers`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Voucher created successfully 🎉");
      }

      onSave(res.data);
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit" : "Add"} Voucher
          </h1>
          <p className="text-gray-500 text-sm">
            Configure discount voucher details
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl border p-7">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label>Voucher Code *</Label>
              <Input
                required
                placeholder="Enter voucher code"
                value={form.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
              />
            </div>

            <div>
              <Label>Voucher Type *</Label>
              <select
                required
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full h-11 rounded-xl border px-3 bg-gray-50"
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage Discount</option>
                <option value="complimentary">Complimentary Items</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description *</Label>
            <Input
              required
              placeholder="Enter description"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />
          </div>

          {/* VALUE */}
          {form.type !== "complimentary" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label>Value *</Label>
                <Input
                  type="number"
                  required
                  placeholder="Enter value"
                  value={form.value}
                  onWheel={(e) => e.target.blur()} 
                  onChange={(e) =>
                    handleChange("value", e.target.value)
                  }
                />
              </div>

              {form.type === "percentage" && (
                <div>
                  <Label>Max Discount *</Label>
                  <Input
                    type="number"
                    required
                    placeholder="Enter max discount"
                    value={form.max_discount}
                    onWheel={(e) => e.target.blur()} 
                    onChange={(e) =>
                      handleChange("max_discount", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* COMPLIMENTARY */}
          {form.type === "complimentary" && (
            <div className="bg-purple-50 p-5 rounded-xl space-y-4">
              <h4 className="font-semibold text-purple-700">
                Complimentary Items *
              </h4>

              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  required
                  placeholder="Quantity"
                  value={form.complimentary_quantity}
                  onWheel={(e) => e.target.blur()} 
                  onChange={(e) =>
                    handleChange(
                      "complimentary_quantity",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="number"
                  required
                  placeholder="Min Price"
                  value={form.complimentary_min_price}
                  onWheel={(e) => e.target.blur()} 
                  onChange={(e) =>
                    handleChange(
                      "complimentary_min_price",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="number"
                  required
                  placeholder="Max Price"
                  value={form.complimentary_max_price}
                  onWheel={(e) => e.target.blur()} 
                  onChange={(e) =>
                    handleChange(
                      "complimentary_max_price",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* PURCHASE */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label>Minimum Purchase *</Label>
              <Input
                type="number"
                required
                placeholder="Min purchase amount"
                value={form.min_purchase}
                onWheel={(e) => e.target.blur()} 
                onChange={(e) =>
                  handleChange("min_purchase", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Usage Limit *</Label>
              <Input
                type="number"
                required
                placeholder="Max uses"
                value={form.max_uses}
                onWheel={(e) => e.target.blur()} 
                onChange={(e) =>
                  handleChange("max_uses", e.target.value)
                }
              />
            </div>
          </div>

          {/* EXPIRY */}
          <div className="grid md:grid-cols-2 gap-5 items-end">
            <div>
              <Label>Expiry Date *</Label>
              <Input
                type="date"
                required
                value={form.expiry_date}
                onChange={(e) =>
                  handleChange("expiry_date", e.target.value)
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onChange={(v) => handleChange("is_active", v)}
              />
              <Label>Active Voucher *</Label>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"} Voucher
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
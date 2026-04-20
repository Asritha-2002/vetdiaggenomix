import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_BASE_URL_ADMIN;

export default function ProductFormModal({
  open,
  onClose,
  product,
  onSave,
  parentProducts,
}) {
  const isEdit = !!product?._id;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    sku: "",
    category: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    parent: "",
    description: "",
    product_details: [{ label: "", value: "" }],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

useEffect(() => {
  if (!open) return; // ✅ important guard

  if (product?._id) {
    setForm({
      title: product.title || "",
      slug: product.slug || "",
      sku: product.skuId || "",
      category: product.category || "",
      price: product.price || 0,
      originalPrice: product.originalPrice || 0,
      stock: product.stock || 0,
      parent: product.parentProduct || "",
      description: product.description || "",
      product_details: product.productDetails?.length
        ? product.productDetails
        : [{ label: "", value: "" }],
    });

    setExistingImages(product.images || []);
    setImagePreviews(product.images?.map((img) => img.url || img) || []);
  } else {
    resetForm();
    setExistingImages([]);
  }

  setImages([]);
}, [open, product]);
useEffect(() => {
  if (product?.images) {
    const previews = product.images.map((img) =>
      typeof img === "string" ? img : img.url
    );
    setImagePreviews(previews);
  }
}, [product]);

  const updateField = (field, value) => {
    // fields that should be numbers
    const numberFields = ["price", "originalPrice", "stock"];

    setForm((prev) => ({
      ...prev,
      [field]: numberFields.includes(field)
        ? Number(value || 0)
  : value,
      ...(field === "title"
        ? { slug: value.toLowerCase().replace(/\s+/g, "-") }
        : {}),
    }));
  };

  const [images, setImages] = useState([]);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // ✅ append new files instead of replacing
    setImages((prev) => [...prev, ...files]);

    // ✅ append previews also
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);

    // ✅ reset input so same file can be selected again if needed
    e.target.value = null;
  };

  const addDetail = () => {
    setForm((prev) => ({
      ...prev,
      product_details: [...prev.product_details, { label: "", value: "" }],
    }));
  };

  const updateDetail = (i, field, value) => {
    const updated = [...form.product_details];
    updated[i][field] = value;
    setForm({ ...form, product_details: updated });
  };

  const removeDetail = (i) => {
    setForm({
      ...form,
      product_details: form.product_details.filter((_, idx) => idx !== i),
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      sku: "",
      category: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      parent: "",
      description: "",
      product_details: [{ label: "", value: "" }],
    });

    setImagePreviews([]);
    setImages([]); // ✅ add this
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      console.log(form);
      

      // TEXT FIELDS
      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("originalPrice", form.originalPrice);
      formData.append("stock", form.stock);
      formData.append("skuId", form.sku);
      formData.append("category", form.category);
      formData.append("parentProduct", form.parent || "");

      // PRODUCT DETAILS (IMPORTANT)
      formData.append("productDetails", JSON.stringify(form.product_details));

      // IMAGES (IMPORTANT)
      images.forEach((file) => {
        formData.append("bookImages", file);
      });

      // API CALL
      const token = localStorage.getItem("token");

      let res;

if (isEdit) {
  res = await axios.patch(
    `${BASE_URL}/books/${product._id}`,   // 🔥 IMPORTANT
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
} else {
  res = await axios.post(
    `${BASE_URL}/books`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

      console.log("SUCCESS:");
      onSave(res.data);

      toast.success(
  isEdit ? "Product updated successfully" : "Product added successfully"
);
      resetForm();
      onClose();
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      toast.error("Failed to add product");
    }
  };

  if (!open) return null;
 const removeImage = async (index, isExisting) => {
  try {
    // 🔥 If existing image → delete from backend
    if (isExisting) {
      const image = existingImages[index];

      const token = localStorage.getItem("token");

      await axios.delete(
        `${BASE_URL}/books/${product._id}/images/${image.public_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // remove from existing images
      setExistingImages((prev) =>
        prev.filter((_, i) => i !== index)
      );
    } else {
      // new uploaded image
      const newIndex = index - existingImages.length;

      setImages((prev) =>
        prev.filter((_, i) => i !== newIndex)
      );
    }

    // remove preview (for both cases)
    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );

    toast.success("Image removed");

  } catch (error) {
    console.error(error);
    toast.error("Failed to delete image");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden">
        {/* HEADER */}

        <div className="px-6 py-5 bg-green-50 flex justify-between items-center">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white">
              <FaPlus size={16} />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-xl font-bold">
  {isEdit ? "Update Product" : "Add New Product"}
</h2>
<p className="text-sm text-gray-500">
  {isEdit
    ? "Modify the product details"
    : "Fill in the details to add a new product"}
</p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* BASIC INFO */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-semibold mb-5">Basic Information</h3>

            <div className="grid grid-cols-2 gap-5">
              {/* TITLE */}
              <div>
                <label className="label">Product Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="input"
                  placeholder="Enter product title"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="label">SKU Id</label>
                <input
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  className="input"
                  placeholder="SKU Id"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="label">Slug *</label>
                <input
                  value={form.slug}
                  readOnly
                  className="input bg-gray-100"
                  placeholder="product-url-slug"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="label">Category *</label>
                <input
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="input"
                  placeholder="Enter category"
                />
              </div>

              <div className="col-span-2 grid grid-cols-4 gap-5">
                {/* PRICE */}
                <div className="col-span-1">
                  <label className="label">Price *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                {/* ORIGINAL PRICE */}
                <div className="col-span-1">
                  <label className="label">Original Price</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) =>
                      updateField("originalPrice", e.target.value)
                    }
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                {/* STOCK (takes 2 columns = equal to both above combined) */}
                <div className="col-span-2">
                  <label className="label">Stock *</label>
                  <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  className="input"
                  min="0"
                />
                </div>
              </div>

              {/* NEXT ROW → PARENT PRODUCT (HALF WIDTH ONLY) */}
              <div className="col-span-1">
                <label className="label">Parent Product</label>
                <select
                  className="input"
                  value={form.parent}
                  onChange={(e) => updateField("parent", e.target.value)}
                >
                  <option value="">No Parent (Main Product)</option>

                  {parentProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* EMPTY SPACE (to keep alignment clean like UI) */}
              <div></div>

              {/* DESCRIPTION FULL ROW */}
              <div className="col-span-2">
                <label className="label">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="input h-24"
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Product Details</h3>
              <button type="button" onClick={addDetail} className="btn-add">
                <Plus size={14} /> Add Detail
              </button>
            </div>

            {(form.product_details || []).map((d, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <input
                  placeholder="Label"
                  value={d.label}
                  onChange={(e) => updateDetail(i, "label", e.target.value)}
                  className="input"
                />
                <input
                  placeholder="Value"
                  value={d.value}
                  onChange={(e) => updateDetail(i, "value", e.target.value)}
                  className="input"
                />
                <button onClick={() => removeDetail(i)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* IMAGES */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4">Images</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="upload"
              />

              <button
                type="button"
                onClick={() => document.getElementById("upload").click()}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Upload size={16} />
                Upload Images
              </button>

              <p className="text-sm text-gray-500 mt-2">
                Upload book cover and additional images
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">
              {imagePreviews.map((img, i) => {
  const isExisting = i < existingImages.length;

  return (
    <div key={i} className="relative">
      <img
        src={img}
        className="h-20 w-full object-cover rounded-xl"
      />

      <button
        type="button"
        onClick={() => removeImage(i, isExisting)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
        <X size={12} />
      </button>
    </div>
  );
})}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full border p-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-xl"
            >
              {isEdit ? "Update" : "Add Product"}
            </button>
          </div>
        </form>

        {/* STYLE */}
        <style>{`
          .label {
            font-size: 13px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
            display: block;
          }
          .input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            outline: none;
          }
          .input:focus {
            border-color: #10b981;
            box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
          }
          .btn-add {
            background: #d1fae5;
            color: #047857;
            padding: 6px 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 5px;
          }
        `}</style>
      </div>
    </div>
  );
}

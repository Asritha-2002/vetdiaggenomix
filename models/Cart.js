const mongoose = require("mongoose");

/* ================= ITEM SCHEMA ================= */
const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  // ✅ NEW: original price (MRP)
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  image: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  subtotal: {
    type: Number,
    min: 0,
  },
});

/* ================= CART SCHEMA ================= */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    // ✅ Total selling price
    totalAmount: {
      type: Number,
      default: 0,
    },

    // ✅ NEW: total MRP
    totalOriginalAmount: {
      type: Number,
      default: 0,
    },

    totalItems: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ================= AUTO CALCULATION ================= */
cartSchema.pre("save", function (next) {
  // ✅ Calculate subtotal per item
  this.items.forEach((item) => {
    item.subtotal = item.price * item.quantity;
  });

  // ✅ Total items
  this.totalItems = this.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // ✅ Total selling amount
  this.totalAmount = this.items.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  // ✅ Total original amount (MRP)
  this.totalOriginalAmount = this.items.reduce(
    (acc, item) => acc + item.originalPrice * item.quantity,
    0
  );

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
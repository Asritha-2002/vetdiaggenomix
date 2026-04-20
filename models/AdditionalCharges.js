// const mongoose = require('mongoose');

// const additionalChargesSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     chargeType: {
//         type: String,
//         enum: ['delivery', 'gst'],
//         required: true
//     },
//     type: {
//         type: String,
//         enum: ['percentage', 'fixed'],
//         required: true
//     },
//     value: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     appliesTo: {
//         type: String,
//         enum: ['all', 'specific_categories'],
//         default: 'all'
//     },
//     categories: [{
//         type: String
//     }],
//     subCharges: {
//         type: [{
//             name: {
//                 type: String,
//                 enum: ['CGST', 'SGST', 'IGST'],
//                 required: true
//             },
//             value: {
//                 type: Number,
//                 required: true,
//                 min: 0
//             }
//         }],
//         default: []
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('AdditionalCharges', additionalChargesSchema);


const mongoose = require("mongoose");

const subChargeSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["CGST", "SGST", "IGST"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
});

const additionalChargesSchema = new mongoose.Schema(
  {
    chargeType: {
      type: String,
      enum: ["delivery", "gst"],
      required: true,
    },

    // DELIVERY → fixed or percentage (optional but useful)
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // USED FOR DELIVERY ONLY
    value: {
      type: Number,
      min: 0,
      default: 0,
    },

    // GST STRUCTURE (SGST + CGST)
    subCharges: {
      type: [subChargeSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    appliesTo: {
      type: String,
      enum: ["all", "specific_categories"],
      default: "all",
    },

    categories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdditionalCharges", additionalChargesSchema);
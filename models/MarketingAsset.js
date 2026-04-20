const mongoose = require('mongoose');

const marketingAssetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['banner', 'promotion', 'advertisement', 'featured', 'sale'],
    required: true
  },
  title: { type: String, required: true },  image: {
    path: { type: String, required: true },
    cloudinaryId: { type: String }
  },
  isActive: { type: Boolean, default: true },
  position: { type: Number },
  linkTo: { type: String },
  displayPeriod: {
    startDate: { type: Date },
    endDate: { type: Date }
  },
  metadata: {
    altText: String,
    description: String,
    targetAudience: [String],
    deviceTypes: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('MarketingAsset', marketingAssetSchema);

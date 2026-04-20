const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  productDetails: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number},
  stock: { type: Number, required: true },
  skuId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  parentProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  images: [{ 
    url: String,
    public_id: String
  }],
  videos: [{
    path: String,
    title: String,
    duration: Number
  }],
  statistics: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    lastViewed: { type: Date },
    viewsHistory: [{
      date: { type: Date },
      count: { type: Number }
    }],
    purchaseHistory: [{
      date: { type: Date },
      quantity: { type: Number },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
    }]
  }
}, { timestamps: true });

bookSchema.methods.incrementViews = async function() {
  this.statistics.views += 1;
  this.statistics.lastViewed = new Date();
    const today = new Date().setHours(0,0,0,0);
  const viewRecord = this.statistics.viewsHistory.find(
    record => record.date.setHours(0,0,0,0) === today
  );
  
  if (viewRecord) {
    viewRecord.count += 1;
  } else {
    this.statistics.viewsHistory.push({ date: today, count: 1 });
  }
  
  await this.save();
};

// Add method to increment purchases
bookSchema.methods.recordPurchase = async function(quantity, orderId) {
  this.statistics.purchases += quantity;
  this.statistics.revenue += (this.price * quantity);
  
  this.statistics.purchaseHistory.push({
    date: new Date(),
    quantity,
    orderId
  });
  
  await this.save();
};

// Add static method to get top selling books
bookSchema.statics.getTopSelling = function(limit = 5) {
  return this.aggregate([
    {
      $sort: { 'statistics.purchases': -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        title: 1,
        price: 1,
        statistics: 1,
        totalSales: { $multiply: ['$price', '$statistics.purchases'] }
      }
    }
  ]);
};

// Add indexes for better performance
bookSchema.index({ 'statistics.purchases': -1 });
bookSchema.index({ 'statistics.revenue': -1 });
bookSchema.index({ category: 1, 'statistics.purchases': -1 });

module.exports = mongoose.model('Book', bookSchema);

const mongoose = require('mongoose');

const shopDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ShopDetails', shopDetailsSchema);

const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['DELIVERY', 'PAYMENTTYPE', 'FINALCHARGES'],
        required: true
    },
    value: {
        type: String,
        required: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('StoreConfig', storeConfigSchema);

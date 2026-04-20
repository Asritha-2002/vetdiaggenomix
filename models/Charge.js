const mongoose = require('mongoose');

const chargeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['DELIVERY', 'PAYMENTTYPE', 'FINALCHARGES', 'SERVICE'],
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    displayName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Charge', chargeSchema);

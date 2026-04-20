const mongoose = require('mongoose');

const otherStoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    // Online store specific fields
    onlineDetails: {
        ecommerceName: String,
        link: String,
        joinedOn: Date
    },
    // Offline store specific fields
    offlineDetails: {
        address: String,
        mapsLink: String,
        image: {
            url: String,
            public_id: String
        },
        contactNumber: String, // Adding contact number for offline stores
        openingHours: String  // Adding opening hours for offline stores
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('OtherStore', otherStoreSchema);

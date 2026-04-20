const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const OtherStore = require('../models/OtherStore');
const { upload } = require('../middleware/upload'); // Changed this line
const cloudinary = require('../config/cloudinary');

// Get all stores
router.get('/', async (req, res) => {
    try {
        const stores = await OtherStore.find().sort('-createdAt');
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single store
router.get('/:id', async (req, res) => {
    try {
        const store = await OtherStore.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create store (admin only)
router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
    try {
        const storeData = req.body;
        
        // Handle image upload for offline stores
        if (storeData.type === 'offline' && req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            storeData.offlineDetails = {
                ...storeData.offlineDetails,
                image: {
                    url: result.secure_url,
                    public_id: result.public_id
                }
            };
        }

        const store = new OtherStore(storeData);
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update store (admin only)
router.put('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
    try {
        const storeData = req.body;
        
        // Handle image upload for offline stores
        if (storeData.type === 'offline' && req.file) {
            // Delete old image if exists
            const oldStore = await OtherStore.findById(req.params.id);
            if (oldStore?.offlineDetails?.image?.public_id) {
                await cloudinary.uploader.destroy(oldStore.offlineDetails.image.public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path);
            storeData.offlineDetails = {
                ...storeData.offlineDetails,
                image: {
                    url: result.secure_url,
                    public_id: result.public_id
                }
            };
        }

        const store = await OtherStore.findByIdAndUpdate(
            req.params.id, 
            storeData,
            { new: true }
        );
        res.json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete store (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const store = await OtherStore.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Delete image from cloudinary if exists
        if (store.type === 'offline' && store.offlineDetails?.image?.public_id) {
            await cloudinary.uploader.destroy(store.offlineDetails.image.public_id);
        }

        await store.deleteOne();
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

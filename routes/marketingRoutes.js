const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const MarketingAsset = require('../models/MarketingAsset');
  const { upload, uploadImageToCloudinary } = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Add new marketing asset
router.post('/', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('Received file:', req.file); // Debugging line
    console.log('Received body:', req.body); // Debugging line
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadImageToCloudinary(req.file.path, 'marketing');

    // Delete local temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    const asset = new MarketingAsset({
      type: req.body.type,
      title: req.body.title,
      position: parseInt(req.body.position) || 0,
      isActive: req.body.isActive === 'true',
      linkTo: req.body.linkTo || '',
      displayPeriod: {
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null
      },
      metadata: {
        altText: req.body.altText || '',
        description: req.body.description || '',
        targetAudience: req.body.targetAudience ? req.body.targetAudience.split(',') : [],
        deviceTypes: req.body.deviceTypes ? req.body.deviceTypes.split(',') : ['all']
      },
      image: {
        path: cloudinaryResult.url,
        cloudinaryId: cloudinaryResult.public_id
      }
    });

    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating marketing asset:', error);
    // Cleanup uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all marketing assets (admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const assets = await MarketingAsset.find()
      .sort({ position: 1, createdAt: -1 })
      .lean()
      .exec();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active marketing assets by type
router.get('/:type', async (req, res) => {
  try {
    const currentDate = new Date();
    const assets = await MarketingAsset.find({
      type: req.params.type,
      isActive: true,
      $or: [
        { 
          'displayPeriod.startDate': { $lte: currentDate },
          'displayPeriod.endDate': { $gte: currentDate }
        },
        {
          'displayPeriod.startDate': { $exists: false },
          'displayPeriod.endDate': { $exists: false }
        },
        {
          'displayPeriod.startDate': null,
          'displayPeriod.endDate': null
        }
      ]
    })
    .sort({ position: 1 })
    .lean()
    .exec();
    
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active marketing assets by type
router.get('/active/:type', async (req, res) => {
  try {
    const currentDate = new Date();
    const assets = await MarketingAsset.find({
      type: req.params.type,
      isActive: true,
      $or: [
        { 
          'displayPeriod.startDate': { $lte: currentDate },
          'displayPeriod.endDate': { $gte: currentDate }
        },
        {
          'displayPeriod.startDate': null,
          'displayPeriod.endDate': null
        }
      ]
    })
    .sort({ position: 1 })
    .lean();
    
    res.json(assets);
  } catch (error) {
    console.error('Error fetching active marketing assets:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update marketing asset
router.patch('/:id', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    const asset = await MarketingAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Marketing asset not found' });
    }

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (asset.image.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(asset.image.cloudinaryId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }

      // Upload new image to Cloudinary
      const cloudinaryResult = await uploadImageToCloudinary(req.file.path, 'marketing');

      // Delete local temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });

      // Set new image data
      asset.image.path = cloudinaryResult.url;
      asset.image.cloudinaryId = cloudinaryResult.public_id;
    }

    // Update other fields
    const updates = ['title', 'type', 'position', 'linkTo', 'isActive'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'isActive') {
          asset[field] = req.body[field] === 'true';
        } else if (field === 'position') {
          asset[field] = parseInt(req.body[field]) || 0;
        } else {
          asset[field] = req.body[field];
        }
      }
    });

    // Update metadata fields
    if (req.body.description !== undefined) {
      asset.metadata.description = req.body.description;
    }
    if (req.body.altText !== undefined) {
      asset.metadata.altText = req.body.altText;
    }

    // Update display period
    if (req.body.startDate !== undefined) {
      asset.displayPeriod.startDate = req.body.startDate || null;
    }
    if (req.body.endDate !== undefined) {
      asset.displayPeriod.endDate = req.body.endDate || null;
    }

    await asset.save();
    res.json(asset);
  } catch (error) {
    console.error('Error updating marketing asset:', error);
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete marketing asset
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const asset = await MarketingAsset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Delete image from Cloudinary
    if (asset.image.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(asset.image.cloudinaryId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }

    await MarketingAsset.deleteOne({ _id: req.params.id });
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

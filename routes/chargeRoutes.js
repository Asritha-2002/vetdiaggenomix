const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Charge = require('../models/Charge');

// Get all active charges
router.get('/', auth, async (req, res) => {
    try {
        const charges = await Charge.find({ isActive: true });
        res.json(charges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

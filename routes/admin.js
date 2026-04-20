const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const ShopDetails = require('../models/ShopDetails');

// ...existing code...

// Shop Details Management Routes
router.get('/shop-details', auth, adminAuth, async (req, res) => {
    try {
        const details = await ShopDetails.find();
        res.render('admin/shop-details', { details });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/shop-details/add', auth, adminAuth, (req, res) => {
    res.render('admin/add-shop-details');
});

router.get('/shop-details/edit/:id', auth, adminAuth, async (req, res) => {
    try {
        const detail = await ShopDetails.findById(req.params.id);
        res.render('admin/edit-shop-details', { detail });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...existing code...

module.exports = router;
const router = require('express').Router();
const ShopDetails = require('../models/ShopDetails');
const { auth, adminAuth } = require('../middleware/auth');


router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { name, category, value } = req.body;
        const newDetail = new ShopDetails({
            name,
            category,
            value
        });
        await newDetail.save();
        res.json({ success: true, message: 'Shop detail added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const details = await ShopDetails.find();
        res.json({ success: true, details });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const detail = await ShopDetails.findById(id);
        if (!detail) {
            return res.status(404).json({ success: false, message: 'Shop detail not found' });
        }
        res.json({ success: true, detail });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, value } = req.body;
        await ShopDetails.findByIdAndUpdate(id, {
            name,
            category,
            value
        });
        res.json({ success: true, message: 'Shop detail updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await ShopDetails.findByIdAndDelete(id);
        res.json({ success: true, message: 'Shop detail deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/cat/:category', async (req, res) => {

    try {
        const { category } = req.params;    
        await ShopDetails.find({ category })
            .then((details) => {
                if (!details.length) {
                    return res.status(404).json({ success: false, message: 'No details found for this category' });
                }
                res.json({ success: true, details });
            })
            .catch((error) => {
                res.status(500).json({ success: false, message: error.message });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}
);

module.exports = router;

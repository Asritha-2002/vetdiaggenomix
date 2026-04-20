const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Voucher = require('../models/Voucher');
const Order = require('../models/Order');


// Get all vouchers
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const vouchers = await Voucher.find()
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vouchers for specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const vouchers = await Voucher.find({
      $or: [
        { applicationType: 'cart', isActive: true },
        {
          applicationType: 'product',
          productId: req.params.productId,
          isActive: true
        }
      ],
      expiryDate: { $gt: new Date() }
    });

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available vouchers for current user
router.get('/available', auth, async (req, res) => {
  try {
    const vouchers = await Voucher.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
      $or: [
        { maxUses: null },
        { $expr: { $lt: ["$usedCount", "$maxUses"] } }
      ]
    });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:code/validate', auth, async (req, res) => {
  try {
    console.log(req.user)
    const userId = req.user.id;
    const voucherCode = req.params.code.toUpperCase();

    const voucher = await Voucher.findOne({
      code: voucherCode,
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!voucher) {
      return res.status(400).json({ message: 'Invalid voucher code' });
    }

    const alreadyUsed = await Order.find({
      user: userId,
      'appliedVoucher.code': voucherCode,
      status: { $nin: ['cancelled', 'refund-completed'] }
    }).select('_id');

    console.log('Voucher validation:', {
      userId,
      voucherCode,
      alreadyUsed
    });

    if (alreadyUsed.length >= voucher.maxUses && voucher.maxUses !== null) {
      return res.status(400).json({ message: 'You have already used this voucher' });
    }

    const { items, subtotal } = req.body;

    if (voucher.minPurchase > subtotal) {
      return res.status(400).json({
        message: `Minimum purchase amount of ₹${voucher.minPurchase} required`
      });
    }

    if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) {
      return res.status(400).json({
        message: 'Voucher usage limit reached'
      });
    }

    res.json(voucher);
  } catch (error) {
    console.error('Voucher validation error:', error);
    res.status(400).json({ message: 'Failed to validate voucher' });
  }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Temporarily unprotected for guest checkout test flow, in real app use: router.post('/create-order', protect, createRazorpayOrder);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;

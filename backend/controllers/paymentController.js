const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_dummy',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    // amount is in INR, Razorpay expects paise (amount * 100)
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ success: false, message: 'Some error occurred with Razorpay' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_dummy')
      .update(sign.toString())
      .digest('hex');

    if (razorpaySignature === expectedSign) {
      // Payment is successful, update order in DB
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: 'Successful'
        };
        await order.save();
        return res.json({ success: true, message: 'Payment verified successfully' });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest checkout initially
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  orderItems: [orderItemSchema],
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'RAZORPAY', 'WALLET'],
    default: 'COD'
  },
  paymentResult: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String }
  },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true, default: 0.0 }, // GST
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

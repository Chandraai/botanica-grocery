const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Cart', cartSchema);

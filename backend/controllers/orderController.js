const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      phone, 
      address,
      city,
      zipCode,
      items, 
      subtotal, 
      deliveryFee, 
      totalAmount,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    const order = await Order.create({
      orderId,
      customerName,
      phone,
      shippingAddress: {
        address,
        city,
        state: 'N/A', // Update frontend to send state later
        pincode: zipCode
      },
      orderItems: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price
      })),
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: subtotal,
      shippingPrice: deliveryFee,
      totalPrice: totalAmount,
      isPaid: false
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        id: order.orderId,
        ...order.toObject()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        id: order.orderId, // Map for frontend
        subtotal: order.itemsPrice,
        deliveryFee: order.shippingPrice,
        totalAmount: order.totalPrice,
        customerName: order.customerName,
        address: order.shippingAddress.address,
        phone: order.phone,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById
};

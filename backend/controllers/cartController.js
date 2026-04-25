const Cart = require('../models/Cart');

// Helper to get or create cart for a session
const getCartForSession = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [], totalPrice: 0, totalItems: 0 });
  }
  return cart;
};

// Recalculate totals
const recalculate = (cart) => {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return cart;
};

// @desc    Get cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    const cart = await getCartForSession(sessionId);
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    const cart = await getCartForSession(sessionId);
    const item = req.body;

    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }

    recalculate(cart);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quantity
// @route   PUT /api/cart/update
const updateQuantity = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    const cart = await getCartForSession(sessionId);
    const { productId, quantity } = req.body;

    const itemIndex = cart.items.findIndex(i => i.productId === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      recalculate(cart);
      await cart.save();
      res.json({ success: true, data: cart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/remove/:id
const removeFromCart = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    const cart = await getCartForSession(sessionId);
    const productId = req.params.id;

    cart.items = cart.items.filter(i => i.productId !== productId);
    recalculate(cart);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const sessionId = req.headers['session-id'] || 'default-session';
    let cart = await getCartForSession(sessionId);
    
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
};

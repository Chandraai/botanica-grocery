import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleDecrease = (item) => {
    updateQuantity(item.productId, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any groceries to your cart yet. Browse our categories and discover fresh products!
        </p>
        <Link to="/shop" className="btn-primary text-lg px-8 py-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
            
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-6 items-center gap-4 hover:bg-gray-50 transition-colors">
                  {/* Product Info */}
                  <div className="col-span-3 flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.productId}`} className="font-semibold text-lg text-gray-900 hover:text-botanica-green transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-gray-500 text-sm">{item.unit}</div>
                      
                      {/* Mobile view only: Price and controls */}
                      <div className="sm:hidden mt-2 flex justify-between items-center w-full">
                        <div className="font-medium">₹{item.price.toFixed(2)}</div>
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button onClick={() => handleDecrease(item)} className="px-3 py-1 text-gray-500 hover:text-botanica-green transition-colors">-</button>
                          <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                          <button onClick={() => handleIncrease(item)} className="px-3 py-1 text-gray-500 hover:text-botanica-green transition-colors">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop view: Price */}
                  <div className="hidden sm:block text-center font-medium text-gray-600">
                    ₹{item.price.toFixed(2)}
                  </div>
                  
                  {/* Desktop view: Quantity */}
                  <div className="hidden sm:flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm">
                      <button 
                        onClick={() => handleDecrease(item)} 
                        className="px-3 py-2 text-gray-500 hover:text-botanica-green transition-colors hover:bg-gray-50 rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrease(item)} 
                        className="px-3 py-2 text-gray-500 hover:text-botanica-green transition-colors hover:bg-gray-50 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total and Remove */}
                  <div className="flex justify-between sm:justify-end items-center w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="sm:hidden text-gray-500">Total:</div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-botanica-dark">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Items ({cart.totalItems})</span>
                <span>₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-botanica-green font-medium">
                  {cart.totalPrice > 50 ? 'Free' : '₹5.00'}
                </span>
              </div>
              {cart.totalPrice > 0 && cart.totalPrice <= 50 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  Add ₹{(50 - cart.totalPrice).toFixed(2)} more to your cart for free shipping!
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-2xl text-botanica-dark">
                  ₹{(cart.totalPrice + (cart.totalPrice > 50 ? 0 : 5)).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3 text-lg rounded-xl flex justify-center items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>🔒</span> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

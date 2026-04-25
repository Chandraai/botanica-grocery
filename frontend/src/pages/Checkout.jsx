import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import axios from 'axios';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  if (cart.items.length === 0 && !loading) {
    navigate('/cart');
    return null;
  }

  const shipping = cart.totalPrice > 50 ? 0 : 5;
  const total = cart.totalPrice + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRazorpayPayment = async (orderDataResponse) => {
    try {
      // Create Razorpay Order on backend
      const { data: rzpOrder } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: total,
        receipt: orderDataResponse.data.id
      });

      if (!rzpOrder.success) throw new Error('Failed to create Razorpay order');

      const options = {
        key: 'rzp_test_dummy', // Replace with real key in production
        amount: rzpOrder.data.amount,
        currency: 'INR',
        name: 'Botanica Grocery',
        description: 'Premium Groceries',
        order_id: rzpOrder.data.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const { data: verifyData } = await axios.post('http://localhost:5000/api/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderDataResponse.data._id
            });

            if (verifyData.success) {
              await clearCart();
              navigate(`/success/${orderDataResponse.data.id}`);
            } else {
              setError('Payment verification failed');
              setLoading(false);
            }
          } catch (err) {
            setError('Payment verification error');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.customerName,
          contact: formData.phone
        },
        theme: {
          color: '#2e7d32' // botanica-green
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      setError('Error initializing Razorpay');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        fullAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        items: cart.items,
        subtotal: cart.totalPrice,
        deliveryFee: shipping,
        totalAmount: total,
        paymentMethod
      };

      const { data } = await createOrder(orderData);
      
      if (data.success) {
        if (paymentMethod === 'RAZORPAY') {
          // Open Razorpay
          await handleRazorpayPayment(data);
        } else {
          // COD Success
          await clearCart();
          navigate(`/success/${data.data.id}`);
        }
      } else {
        setError(data.message || 'Failed to place order');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while placing your order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="input-field"
                  placeholder="Rahul Sharma"
                  value={formData.customerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="input-field"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                name="address"
                required
                className="input-field"
                placeholder="123 Link Road, Andheri West"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="input-field"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  className="input-field"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  className="input-field"
                  placeholder="400053"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 pt-6 border-t border-gray-100">Payment Method</h2>
            
            <div className="space-y-4 mb-4">
              <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors ${paymentMethod === 'RAZORPAY' ? 'bg-botanica-light border-botanica-accent' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="RAZORPAY" 
                  checked={paymentMethod === 'RAZORPAY'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-botanica-green focus:ring-botanica-green" 
                />
                <div>
                  <span className="block font-medium text-botanica-dark">Pay Online (UPI, Cards, Wallets)</span>
                  <span className="text-sm text-gray-600">Secure online payment via Razorpay.</span>
                </div>
              </label>

              <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'bg-botanica-light border-botanica-accent' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1 text-botanica-green focus:ring-botanica-green" 
                />
                <div>
                  <span className="block font-medium text-botanica-dark">Cash on Delivery (COD)</span>
                  <span className="text-sm text-gray-600">Pay when your order arrives at your door.</span>
                </div>
              </label>
            </div>
            
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <ul className="divide-y divide-gray-100 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.items.map(item => (
                <li key={item.id} className="py-3 flex justify-between">
                  <div className="flex gap-3">
                    <span className="text-gray-500">{item.quantity}x</span>
                    <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                  </div>
                  <span className="text-gray-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="space-y-3 pt-4 border-t border-gray-100 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Total to Pay</span>
                <span className="font-bold text-2xl text-botanica-dark">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className={`w-full btn-primary py-4 text-lg rounded-xl flex justify-center items-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : (paymentMethod === 'RAZORPAY' ? 'Pay Now' : 'Place Order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

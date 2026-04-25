import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(id);
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanica-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-botanica-light rounded-full flex items-center justify-center text-5xl mb-6 text-botanica-green border-4 border-white shadow-lg relative z-10">
        ✓
      </div>
      
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-xl text-gray-600 mb-8">Thank you for shopping with Botanica Grocery.</p>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg mb-8 text-left">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="font-bold text-gray-900">{id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-900">
              {order ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
            </p>
          </div>
        </div>
        
        {order && (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
              <p className="text-gray-600">{order.customerName}</p>
              <p className="text-gray-600">{order.address}</p>
              <p className="text-gray-600">{order.phone}</p>
            </div>
            
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg">
                <span>Total Paid (COD)</span>
                <span className="text-botanica-dark">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="flex gap-4">
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
        <Link to="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would verify admin token here
  // For V1, we'll just mock a simple dashboard

  useEffect(() => {
    // This assumes there's an endpoint /api/orders (we'd need an admin route, but for now we'll just show the UI)
    // As V1, this is a placeholder. Real implementation needs token in headers
    setLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="bg-botanica-dark text-white rounded-2xl p-8 mb-8 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-gray-300">Manage orders, products, and customers</p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
          <span className="text-botanica-light font-medium">Logged in as Admin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
          <span className="text-4xl font-bold text-botanica-green mb-2">12</span>
          <span className="text-gray-600 font-medium">New Orders</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
          <span className="text-4xl font-bold text-botanica-green mb-2">₹4,520</span>
          <span className="text-gray-600 font-medium">Today's Sales</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
          <span className="text-4xl font-bold text-botanica-green mb-2">28</span>
          <span className="text-gray-600 font-medium">Active Products</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders (Demo Data)</h3>
          <button className="text-botanica-green font-medium hover:text-botanica-dark transition-colors">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-1A2B3C4D</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rahul Sharma</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹1,250.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-botanica-green hover:text-botanica-dark">Manage</a>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-9X8Y7Z6W</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Priya Patel</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹840.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-botanica-green hover:text-botanica-dark">Manage</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;

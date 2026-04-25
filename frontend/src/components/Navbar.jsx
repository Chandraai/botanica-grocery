import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-xl text-botanica-dark tracking-tight">Botanica</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-600 hover:text-botanica-green px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-botanica-green px-3 py-2 rounded-md text-sm font-medium">Shop All</Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-2 md:px-6 lg:px-12">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  className="input-field pl-10 bg-gray-50 border-gray-200"
                  placeholder="Search groceries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-botanica-green transition-colors">
              <span className="text-2xl">🛒</span>
              {cart.totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-botanica-green rounded-full">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

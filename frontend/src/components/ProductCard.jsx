import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product);
    setTimeout(() => setAdding(false), 500); // Visual feedback
  };

  const discount = product.price > product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="card flex flex-col h-full group relative">
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {discount}% OFF
        </div>
      )}
      
      <Link to={`/product/${product.id}`} className="block relative bg-gray-50 pt-[100%] overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/product/${product.id}`} className="hover:text-botanica-green transition-colors">
          <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center text-sm text-yellow-500 mb-2">
          <span>★</span> <span className="text-gray-600 ml-1">{product.rating}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">{product.unit}</div>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div>
            <span className="font-bold text-lg text-botanica-dark">₹{product.discountPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={adding}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              adding ? 'bg-botanica-accent text-white' : 'bg-botanica-light text-botanica-green hover:bg-botanica-green hover:text-white'
            }`}
            aria-label="Add to cart"
          >
            {adding ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

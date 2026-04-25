import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        if (data.success) {
          setProduct(data.data);
        } else {
          navigate('/shop');
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product);
    setTimeout(() => setAdding(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanica-green"></div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.price > product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="mb-6">
        <Link to="/shop" className="text-gray-500 hover:text-botanica-green flex items-center gap-2 w-max">
          <span>&larr;</span> Back to Shop
        </Link>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image area */}
          <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-12 flex items-center justify-center relative min-h-[400px]">
            {discount > 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-lg shadow-md z-10">
                {discount}% OFF
              </div>
            )}
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          
          {/* Product Details area */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="uppercase tracking-widest text-sm text-botanica-green font-bold mb-2">
              {product.category}
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500">
                <span className="text-xl">★</span>
                <span className="text-gray-700 ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">Unit: {product.unit}</span>
              <span className="text-gray-300">|</span>
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-extrabold text-botanica-dark">
                ₹{product.discountPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-2xl text-gray-400 line-through mb-1">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mt-auto">
              <button 
                onClick={handleAdd}
                disabled={adding || product.stock === 0}
                className={`w-full py-4 text-xl rounded-xl flex justify-center items-center gap-3 transition-all font-bold shadow-md ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : adding 
                      ? 'bg-botanica-dark text-white' 
                      : 'bg-botanica-green hover:bg-botanica-dark text-white'
                }`}
              >
                <span className="text-2xl">{adding ? '✓' : '🛒'}</span>
                {product.stock === 0 ? 'Out of Stock' : adding ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
            
            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-gray-100 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-botanica-green text-xl">✓</span> Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <span className="text-botanica-green text-xl">✓</span> Fresh Guarantee
              </div>
              <div className="flex items-center gap-2">
                <span className="text-botanica-green text-xl">✓</span> Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <span className="text-botanica-green text-xl">✓</span> Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

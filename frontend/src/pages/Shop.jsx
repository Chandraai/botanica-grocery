import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('');

  // Sync state with URL when it changes externally
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts(searchTerm, sortBy);
        if (data.success) {
          let filteredData = data.data;
          
          if (activeCategory !== 'all') {
            filteredData = filteredData.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
          }
          
          setProducts(filteredData);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm, sortBy]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (!val) {
      params.delete('search');
    } else {
      params.set('search', val);
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {searchTerm ? `Search: "${searchTerm}"` : activeCategory !== 'all' ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}` : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1">{products.length} items found</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            {searchTerm && (
              <button 
                onClick={() => handleSearchChange({target: {value: ''}})}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <select 
            className="input-field w-auto bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                    activeCategory === 'all' 
                      ? 'bg-botanica-light text-botanica-dark font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
              </li>
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center capitalize ${
                      activeCategory.toLowerCase() === cat.name.toLowerCase() 
                        ? 'bg-botanica-light text-botanica-dark font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
                  <div className="bg-gray-200 h-48 w-full rounded-t-xl"></div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any items matching your search or category.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  handleCategoryChange('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

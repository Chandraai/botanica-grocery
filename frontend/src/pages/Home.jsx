import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts();
        if (data.success) {
          // Select 8 random products to feature
          const shuffled = data.data.sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, []);

  const categories = [
    { title: 'Vegetables', emoji: '🥦', link: '/shop?category=vegetables' },
    { title: 'Fruits', emoji: '🍎', link: '/shop?category=fruits' },
    { title: 'Dairy & Eggs', emoji: '🥚', link: '/shop?category=dairy' },
    { title: 'Bakery', emoji: '🥖', link: '/shop?category=bakery' },
    { title: 'Beverages', emoji: '🧃', link: '/shop?category=beverages' },
    { title: 'Essentials', emoji: '🫒', link: '/shop?category=essentials' },
  ];

  return (
    <div className="min-h-screen pb-12">
      <Hero />
      
      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-gray-600">Fresh from farm to your door</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} title={cat.title} emoji={cat.emoji} link={cat.link} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
            <p className="mt-2 text-gray-600">Handpicked for you today</p>
          </div>
          <Link to="/shop" className="text-botanica-green hover:text-botanica-dark font-medium pb-1 border-b border-transparent hover:border-botanica-dark transition-colors">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
                <div className="bg-gray-200 h-48 w-full rounded-t-xl"></div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-10">
        <div className="bg-gradient-to-r from-botanica-green to-botanica-dark rounded-2xl p-8 sm:p-12 text-center text-white flex flex-col items-center shadow-lg">
          <span className="text-5xl mb-4">🚚</span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Free Delivery on Orders Over ₹50</h2>
          <p className="text-botanica-light mb-8 max-w-2xl">
            Get your groceries delivered fresh and fast right to your doorstep. We ensure the highest quality packaging so your food arrives perfectly.
          </p>
          <Link to="/shop" className="bg-white text-botanica-dark font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-md">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

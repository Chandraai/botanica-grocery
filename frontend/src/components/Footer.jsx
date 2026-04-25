import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-botanica-dark text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-xl tracking-tight">Botanica</span>
            </div>
            <p className="text-botanica-light text-sm mb-4">
              Premium quality groceries delivered fresh to your door. We partner with local farmers to bring you the best.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-botanica-light">
              <li><a href="/shop" className="hover:text-white transition">All Products</a></li>
              <li><a href="/shop?category=vegetables" className="hover:text-white transition">Fresh Vegetables</a></li>
              <li><a href="/shop?category=fruits" className="hover:text-white transition">Fresh Fruits</a></li>
              <li><a href="/shop?category=dairy" className="hover:text-white transition">Dairy & Eggs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-botanica-light">
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-botanica-light">
              <li>📍 123 Grocery Lane, Food City</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ hello@botanica.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-botanica-light">
            &copy; {new Date().getFullYear()} Botanica Grocery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

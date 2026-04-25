import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-botanica-light rounded-3xl overflow-hidden mb-12 my-6 mx-4 sm:mx-6 lg:mx-8 shadow-sm border border-green-100">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-20">
          <main className="mx-auto max-w-7xl">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Fresh groceries </span>
                <span className="block text-botanica-green xl:inline">delivered to you</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Premium quality fruits, vegetables, and daily essentials sourced directly from local farms. Experience the natural difference with Botanica.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/shop"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-botanica-green hover:bg-botanica-dark md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#categories"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-botanica-green bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors shadow-sm"
                  >
                    Browse Categories
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center bg-botanica-accent bg-opacity-20 hidden lg:flex">
        <div className="text-[200px] leading-none transform rotate-12 select-none animate-float">
          🥬🍅🥕
        </div>
      </div>
    </div>
  );
};

export default Hero;

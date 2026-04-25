import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, emoji, link }) => {
  return (
    <Link 
      to={link}
      className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-botanica-accent transition-all duration-300 group flex flex-col items-center justify-center gap-4 h-full"
    >
      <div className="w-20 h-20 bg-botanica-light rounded-full flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-botanica-accent group-hover:bg-opacity-30 transition-all duration-300">
        {emoji}
      </div>
      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-botanica-green transition-colors">{title}</h3>
    </Link>
  );
};

export default CategoryCard;

import React from 'react';

const CategoryCard = ({ data }) => {
  return (
    <div className="w-32 h-30 md:w-45 md:h-45 rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-lg shadow-gray-200/80 hover:shadow-xl hover:shadow-gray-200/90 transition-all duration-300 relative group">
      <img
        src={data.image}
        alt={data.category}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
      />
      <div className="absolute bottom-0 left-0 w-full bg-white/90 bg-opacity-95 py-2 px-3 rounded-t-xl text-center border-t border-[#ff4d2d]/10">
        <span className="text-sm font-semibold text-gray-800 tracking-tight truncate block">
          {data.category}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;

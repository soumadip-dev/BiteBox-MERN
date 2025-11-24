import React from 'react';

const CategoryCard = ({ data }) => {
  return (
    <div className="min-w-[160px] bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-orange-200 group cursor-pointer">
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        <img
          src={data.image}
          alt={data.category}
          className="w-40 h-32 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-4 text-center">
        <span className="text-sm font-semibold text-gray-900 tracking-tight truncate block">
          {data.category}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;

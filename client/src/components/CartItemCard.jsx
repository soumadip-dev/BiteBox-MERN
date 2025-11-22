import React from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

const CartItemCard = ({ data }) => {
  return (
    <div className="w-full bg-white shadow-xl rounded-3xl p-6 border border-orange-100/50 hover:shadow-2xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <img
            src={data.image}
            alt={data.name}
            className="w-24 h-24 object-cover rounded-2xl border-2 border-orange-100 shadow-sm"
          />
          <div className="space-y-2">
            <h1 className="font-bold text-gray-900 text-lg">{data.name}</h1>
            <p className="text-gray-600 text-base">
              ₹{data.price} × {data.quantity}
            </p>
            <p className="font-bold text-gray-900 text-xl">₹{data.price * data.quantity}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-orange-200/50 hover:scale-105 active:scale-95">
            <FaMinus size={16} className="text-[#ff4d2d]" />
          </button>
          <span className="font-bold text-gray-900 min-w-8 text-center text-lg mx-2">
            {data.quantity}
          </span>
          <button className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-orange-200/50 hover:scale-105 active:scale-95">
            <FaPlus size={16} className="text-[#ff4d2d]" />
          </button>
          <button className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-red-200/50 hover:scale-105 active:scale-95 ml-3">
            <FaTrash size={16} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;

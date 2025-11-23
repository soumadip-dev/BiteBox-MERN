import React from 'react';
import { useDispatch } from 'react-redux';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { updateQuantity, removeFromCart } from '../redux/userSlice';

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();

  const handleDecreaseQuantity = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    } else {
      // Remove item if quantity becomes 0
      dispatch(removeFromCart(id));
    }
  };

  const handleIncreaseQuantity = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleRemoveItem = id => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-orange-100/50 hover:shadow-2xl transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-5">
          <img
            src={data.image}
            alt={data.name}
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-xl sm:rounded-2xl border-2 border-orange-100 shadow-sm"
          />
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-base sm:text-lg truncate">{data.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              ₹{data.price} × {data.quantity}
            </p>
            <p className="font-bold text-gray-900 text-lg sm:text-xl">
              ₹{data.price * data.quantity}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-orange-200/50 hover:scale-105 active:scale-95"
              onClick={() => handleDecreaseQuantity(data.id, data.quantity)}
            >
              <FaMinus size={14} className="sm:w-4 sm:h-4 text-[#ff4d2d]" />
            </button>
            <span className="font-bold text-gray-900 min-w-6 sm:min-w-8 text-center text-base sm:text-lg mx-1 sm:mx-2">
              {data.quantity}
            </span>
            <button
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-orange-200/50 hover:scale-105 active:scale-95"
              onClick={() => handleIncreaseQuantity(data.id, data.quantity)}
            >
              <FaPlus size={14} className="sm:w-4 sm:h-4 text-[#ff4d2d]" />
            </button>
          </div>
          <button
            className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-50 hover:bg-red-100 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-red-200/50 hover:scale-105 active:scale-95 ml-2 sm:ml-3"
            onClick={() => handleRemoveItem(data.id)}
          >
            <FaTrash size={14} className="sm:w-4 sm:h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;

import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector(state => state.user);

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-2xl shadow-inner mb-4 border border-orange-200/30">
            <div className="text-3xl">🛒</div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Your Cart
          </h1>
        </div>

        {/* Cart Content */}
        {cartItems?.length === 0 ? (
          <div className="max-w-lg w-full mx-auto bg-white rounded-2xl p-8 border border-orange-100/50 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-400 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100/50">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items ({cartItems?.length})
                </h2>
                <span className="text-orange-600 font-medium">
                  Total: $
                  {cartItems
                    ?.reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="space-y-4">
                {cartItems?.map(item => (
                  <CartItemCard key={item._id} data={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

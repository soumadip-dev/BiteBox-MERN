import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useSelector(state => state.user);

  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <button
        className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-3 sm:p-4 rounded-2xl shadow-inner mb-3 sm:mb-4 border border-orange-200/30">
            <div className="text-2xl sm:text-3xl">🛒</div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center">
            Your Cart
          </h1>
        </div>

        {cartItems?.length === 0 ? (
          <div className="max-w-lg w-full mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-orange-100/50 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
            <p className="text-gray-600 text-lg sm:text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base cursor-pointer"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-100/50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Cart Items ({cartItems?.length})
                </h2>
                <span className="text-orange-600 font-medium text-base sm:text-lg">
                  Total: ₹
                  {cartItems
                    ?.reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {cartItems?.map((item, index) => (
                  <CartItemCard key={index} data={item} />
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 sm:p-6 shadow-lg border border-orange-200/50">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-gray-700 font-medium text-sm sm:text-base">Subtotal</span>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-gray-700 font-medium text-sm sm:text-base">Shipping</span>
                <span className="text-base sm:text-lg font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-orange-200/50">
                <span className="text-lg sm:text-xl font-bold text-gray-900">Total</span>
                <span className="text-lg sm:text-xl font-bold text-orange-600">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

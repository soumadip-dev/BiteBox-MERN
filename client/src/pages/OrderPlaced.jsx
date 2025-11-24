import { FaCircleCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <FaCircleCheck className="text-green-500 text-6xl sm:text-7xl mb-6 animate-pulse" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
        Order Placed!
      </h1>
      <p className="text-gray-600 text-lg sm:text-xl text-center max-w-md mb-8 leading-relaxed">
        Thank you for your purchase. Your order is being prepared. You can track your order in "My
        Orders" section.
      </p>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        onClick={() => navigate('/my-orders')}
      >
        Back to my orders
      </button>
    </div>
  );
};

export default OrderPlaced;

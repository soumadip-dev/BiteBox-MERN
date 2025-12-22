import { FaCircleCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

const OrderPlaced = () => {
  const navigate = useNavigate();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds to save performance
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={100}
          gravity={0.3}
          colors={['#FF6B35', '#FFA235', '#FFD166', '#06D6A0', '#118AB2', '#EF476F']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 10 }}
        />
      )}

      <div className="flex flex-col items-center">
        <FaCircleCheck className="text-green-500 text-6xl sm:text-7xl mb-6 animate-pulse" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
          Order Placed!
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl text-center mb-8 leading-relaxed">
          Thank you for your purchase. Your order is being prepared. You can track your order in "My
          Orders" section.
        </p>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 w-full sm:w-auto cursor-pointer"
          onClick={() => navigate('/my-orders')}
        >
          Back to my orders
        </button>
      </div>
    </div>
  );
};

export default OrderPlaced;

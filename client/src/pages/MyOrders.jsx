import React, { useEffect } from 'react';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaReceipt } from 'react-icons/fa6';

const MyOrders = () => {
  const { userData, myOrders } = useSelector(state => state.user);
  const navigate = useNavigate();

  // Debug logging to check data structure
  useEffect(() => {
    console.log('MyOrders component mounted');
    console.log('User data:', userData);
    console.log('All orders in Redux:', myOrders);
    console.log(
      'Orders with IDs:',
      myOrders.filter(order => order && order._id)
    );
  }, [myOrders, userData]);

  // Filter out invalid orders and sort by date (newest first)
  const validOrders = React.useMemo(() => {
    if (!Array.isArray(myOrders)) {
      console.error('myOrders is not an array:', myOrders);
      return [];
    }

    return myOrders
      .filter(order => {
        // Check if order exists and has an _id
        const isValid = order && typeof order === 'object' && order._id;
        if (!isValid) {
          console.warn('Invalid order found:', order);
        }
        return isValid;
      })
      .sort((a, b) => {
        // Sort by date (newest first)
        const dateA = a.createdAt || a.orderDate || a.date || new Date(0);
        const dateB = b.createdAt || b.orderDate || b.date || new Date(0);
        return new Date(dateB) - new Date(dateA);
      });
  }, [myOrders]);

  // Get the appropriate message based on user role
  const getNoOrdersMessage = () => {
    if (userData?.role === 'user') {
      return {
        title: 'No Orders Found',
        message:
          'Your order history is empty. Discover delicious meals and place your first order!',
        buttonText: 'Explore Menu',
        buttonAction: () => navigate('/'),
      };
    } else if (userData?.role === 'owner') {
      return {
        title: 'No Orders Yet',
        message:
          'No orders have been received yet. Orders will appear here when customers start ordering from your restaurant.',
        buttonText: 'Go to Dashboard',
        buttonAction: () => navigate('/owner-dashboard'),
      };
    }
    return {
      title: 'No Orders',
      message: 'Please login to view your orders.',
      buttonText: 'Go to Home',
      buttonAction: () => navigate('/'),
    };
  };

  const noOrdersConfig = getNoOrdersMessage();

  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group z-10"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-6 mt-4 sm:mt-0">
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-2xl shadow-inner mb-4 border border-orange-200/30">
          <FaReceipt className="text-[#ff4d2d] w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center">
          {userData?.role === 'owner' ? 'Restaurant Orders' : 'My Orders'}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {validOrders.length} order{validOrders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Orders List or Empty State */}
      {validOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 text-center max-w-md w-full">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 p-8 rounded-2xl shadow-sm border border-gray-200/50 mb-6 w-full">
            <h2 className="text-2xl font-bold text-gray-500 mb-4">{noOrdersConfig.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{noOrdersConfig.message}</p>
          </div>
          <button
            onClick={noOrdersConfig.buttonAction}
            className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
          >
            {noOrdersConfig.buttonText}
          </button>
        </div>
      ) : (
        <div className="space-y-6 w-full max-w-4xl">
          {validOrders.map(order => {
            // Additional safety check
            if (!order || !order._id) {
              console.error('Invalid order in validOrders:', order);
              return null;
            }

            try {
              return userData?.role === 'user' ? (
                <UserOrderCard key={order._id} order={order} />
              ) : userData?.role === 'owner' ? (
                <OwnerOrderCard key={order._id} order={order} />
              ) : null;
            } catch (error) {
              console.error('Error rendering order card:', error, order);
              return (
                <div
                  key={order._id || `error-${Math.random()}`}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"
                >
                  <p className="text-red-600 font-medium">Error loading order</p>
                  <p className="text-red-400 text-sm mt-1">Order ID: {order._id || 'Unknown'}</p>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

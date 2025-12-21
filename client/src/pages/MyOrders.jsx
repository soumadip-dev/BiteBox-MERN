import React, { useEffect, useMemo, useState } from 'react';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaReceipt } from 'react-icons/fa6';
import { setMyOrders, addMyOrder, updateShopOrderStatusRealTime } from '../redux/userSlice.js';
import { getOrders } from '../api/orderApi';

const MyOrders = () => {
  const { userData, myOrders, socket } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getOrders();
        if (response.success && Array.isArray(response.orders)) {
          dispatch(setMyOrders(response.orders));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    if (socket && userData?._id) {
      const handleIncomingOrder = orderData => {
        if (!orderData || !orderData._id) {
          return;
        }

        const normalizedOrder = {
          ...orderData,

          shopOrders: Array.isArray(orderData.shopOrders)
            ? orderData.shopOrders
            : orderData.shopOrders
            ? [orderData.shopOrders]
            : [],
        };

        const isForCurrentUser = () => {
          if (userData.role === 'user') {
            return normalizedOrder.user?._id === userData._id;
          } else if (userData.role === 'owner') {
            return normalizedOrder.shopOrders.some(
              shopOrder => shopOrder?.owner?._id === userData._id
            );
          }
          return false;
        };

        if (isForCurrentUser()) {
          dispatch(addMyOrder(normalizedOrder));
        }
      };

      const handleUpdateOrderStatus = ({ orderId, shopId, status, userId }) => {
        if (userId.toString() === userData._id.toString()) {
          dispatch(updateShopOrderStatusRealTime({ orderId, shopId, status }));
        }
      };

      socket?.on('newOrder', handleIncomingOrder);
      socket?.on('orderUpdated', handleIncomingOrder);
      socket?.on('updateOrderStatus', handleUpdateOrderStatus);

      return () => {
        socket?.off('newOrder', handleIncomingOrder);
        socket?.off('orderUpdated', handleIncomingOrder);
        socket?.off('updateOrderStatus', handleUpdateOrderStatus);
      };
    }
  }, [socket, userData, dispatch]);

  const validOrders = useMemo(() => {
    if (!myOrders || !Array.isArray(myOrders)) {
      return [];
    }

    return myOrders
      .filter(order => {
        const isValid =
          order &&
          typeof order === 'object' &&
          order._id &&
          (order.user || (order.shopOrders && Array.isArray(order.shopOrders))) &&
          !order._destroyed;

        return isValid;
      })
      .map(order => ({
        ...order,
        shopOrders: Array.isArray(order.shopOrders)
          ? order.shopOrders
          : order.shopOrders
          ? [order.shopOrders]
          : [],
      }))
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
  }, [myOrders]);

  useEffect(() => {
    if (myOrders && Array.isArray(myOrders) && myOrders.some(order => !order || !order._id)) {
      const cleanedOrders = myOrders.filter(order => order && order._id);
      if (cleanedOrders.length !== myOrders.length) {
        dispatch(setMyOrders(cleanedOrders));
      }
    }
  }, [myOrders, dispatch]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group z-10"
        onClick={() => navigate('/')}
        aria-label="Go back"
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

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

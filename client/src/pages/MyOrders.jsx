import React from 'react';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FaReceipt } from 'react-icons/fa6';

const MyOrders = () => {
  const { userData, myOrders } = useSelector(state => state.user);

  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-2xl shadow-inner mb-4 border border-orange-200/30">
          <FaReceipt className="text-[#ff4d2d] w-14 h-14 drop-shadow-sm" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          My Orders
        </h1>
      </div>
      <div className="space-y-6">
        {myOrders.map(order =>
          userData?.role === 'user' ? (
            <UserOrderCard key={order._id} order={order} />
          ) : userData?.role === 'owner' ? (
            <OwnerOrderCard key={order._id} order={order} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default MyOrders;

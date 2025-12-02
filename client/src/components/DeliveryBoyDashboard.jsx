import React from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector(state => state.user);
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fff9f6] to-white px-4 sm:px-6 py-6 sm:py-8 pt-20 md:pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white rounded-xl px-4 sm:px-6 py-4 sm:py-3 shadow-sm border border-orange-100 mb-6 sm:mb-8 w-full">
            <div className="flex-1 min-w-0">
              <h1 className="text-gray-900 text-xl sm:text-2xl font-bold truncate">
                Welcome, {userData?.fullName}
              </h1>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-gray-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                  Lat:
                </span>
                <span className="bg-orange-50 px-2 py-1 rounded-md text-xs sm:text-sm font-mono truncate min-w-[60px] text-center">
                  {userData?.location?.coordinates[1] || 'N/A'}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-gray-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                  Long:
                </span>
                <span className="bg-orange-50 px-2 py-1 rounded-md text-xs sm:text-sm font-mono truncate min-w-[60px] text-center">
                  {userData?.location?.coordinates[0] || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;

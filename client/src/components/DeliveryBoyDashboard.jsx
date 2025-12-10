import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { acceptTheOrder, getDeliveryBoyAssignment } from '../api/orderApi';
import { FaMapMarkerAlt, FaBoxOpen, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DeliveryBoyDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const { userData } = useSelector(state => state.user);

  const getAssignment = async () => {
    const response = await getDeliveryBoyAssignment();
    response && setAvailableOrders(response?.assignments || []);
  };

  useEffect(() => {
    getAssignment();
  }, [userData]);
  const acceptOrder = async assignmentId => {
    try {
      const response = await acceptTheOrder(assignmentId);

      if (response?.success === true) {
        toast.success(response?.message || 'Order accepted successfully!');
      } else {
        toast.error(response?.message || 'Failed to accept order');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fff9f6] to-white px-3 xs:px-4 sm:px-6 py-4 sm:py-6 md:py-8 pt-10 sm:pt-20">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4 bg-white rounded-xl sm:rounded-2xl px-4 xs:px-5 sm:px-6 py-4 xs:py-5 shadow-sm border border-orange-100 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 xs:gap-4 mb-3 xs:mb-0">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-2.5 xs:p-3 rounded-lg xs:rounded-xl border border-orange-200">
                <FaMotorcycle className="w-5 h-5 xs:w-6 xs:h-6 text-[#ff4d2d]" />
              </div>
              <div>
                <h1 className="text-gray-900 text-lg xs:text-xl sm:text-2xl font-bold">
                  Welcome, {userData?.fullName}
                </h1>
                <p className="text-gray-600 text-xs xs:text-sm mt-0.5">
                  Ready to deliver happiness! 🚀
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 xs:flex xs:flex-row gap-2 xs:gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl border border-orange-200">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 font-medium truncate">Latitude</p>
                  <p className="text-gray-900 font-mono text-xs xs:text-sm font-semibold truncate">
                    {userData?.location?.coordinates[1]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl border border-orange-200">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 font-medium truncate">Longitude</p>
                  <p className="text-gray-900 font-mono text-xs xs:text-sm font-semibold truncate">
                    {userData?.location?.coordinates[0]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Orders Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-orange-100 px-4 xs:px-5 sm:px-6 py-3 xs:py-4">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 xs:p-2.5 rounded-lg border border-green-200">
                    <FaBoxOpen className="w-4 h-4 xs:w-5 xs:h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg xs:text-xl font-bold text-gray-900">
                      Available Deliveries
                    </h2>
                    <p className="text-xs xs:text-sm text-gray-600">
                      Pick up orders and start earning
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between xs:justify-end gap-3">
                  <span className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-3 xs:px-4 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-semibold whitespace-nowrap">
                    {availableOrders.length} {window.innerWidth < 400 ? '' : 'Orders'}
                  </span>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="p-4 xs:p-5 sm:p-6">
              {availableOrders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 xs:gap-4">
                  {availableOrders.map((order, index) => (
                    <div
                      key={order?.assignmentId || index}
                      className="group bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 p-4 xs:p-5 transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-3 xs:mb-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-2">
                            <span className="text-xs font-semibold px-2.5 xs:px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 truncate max-w-[120px] xs:max-w-none">
                              #{order?.assignmentId?.slice(-8)?.toUpperCase() || 'N/A'}
                            </span>
                            <span className="text-xs font-semibold px-2.5 xs:px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                              ₹{order?.subtotal || 0}
                            </span>
                          </div>
                          <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-1 truncate">
                            {order?.shopName || 'Restaurant'}
                          </h3>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="mb-3 xs:mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4 mt-0.5 xs:mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Delivery Address
                            </p>
                            <p className="text-gray-900 text-xs xs:text-sm leading-relaxed line-clamp-2">
                              {order?.deliveryAddress?.text || 'Address not specified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mb-4 xs:mb-5">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Items Preview</p>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2">
                          {order?.items?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex-1 min-w-[calc(50%-0.375rem)] xs:min-w-0 bg-white rounded-lg p-2 border border-gray-200"
                            >
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {item?.name || `Item ${idx + 1}`}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                Qty: {item?.quantity || 1} × ₹{item?.price || 0}
                              </p>
                            </div>
                          ))}
                          {order?.items?.length > 3 && (
                            <div className="bg-gray-100 rounded-lg p-2 border border-gray-300 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500 w-3.5 h-3.5 xs:w-4 xs:h-4" />
                          <span className="text-xs xs:text-sm text-gray-600 font-medium whitespace-nowrap">
                            Ready for pickup
                          </span>
                        </div>
                        <button
                          className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 hover:from-[#ff5c3d] hover:to-orange-600 text-white px-4 xs:px-5 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold text-xs xs:text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg w-full xs:w-auto"
                          onClick={() => acceptOrder(order?.assignmentId)}
                        >
                          Accept Delivery
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-8 xs:py-10 sm:py-12 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 xs:p-8 rounded-xl xs:rounded-2xl border border-gray-200 mb-4 xs:mb-6">
                    <FaBoxOpen className="w-12 h-12 xs:w-16 xs:h-16 text-gray-400" />
                  </div>
                  <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 text-center">
                    No deliveries available
                  </h3>
                  <p className="text-gray-600 text-center text-sm xs:text-base max-w-xs xs:max-w-md mb-4 xs:mb-6 px-2">
                    All orders have been assigned. Check back soon for new delivery opportunities!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Padding for Mobile */}
          <div className="h-8 sm:h-12"></div>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;

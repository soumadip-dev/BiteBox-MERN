import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import {
  acceptTheOrder,
  getDeliveryBoyAssignment,
  getTheCurrentOrder,
  sendDeliveryBoyOtp,
  verifyDeliveryBoyOtp,
} from '../api/orderApi';
import { FaMapMarkerAlt, FaBoxOpen, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DeliveryBoyTracking from './DeliveryBoyTracking';

const DeliveryBoyDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');

  const { userData } = useSelector(state => state.user);

  const getAssignment = async () => {
    const response = await getDeliveryBoyAssignment();
    response && setAvailableOrders(response?.assignments || []);
  };

  const getCurrentOrder = async () => {
    try {
      const response = await getTheCurrentOrder();
      setCurrentOrder(response?.data);
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  const acceptOrder = async assignmentId => {
    try {
      const response = await acceptTheOrder(assignmentId);

      if (response?.success === true) {
        toast.success(response?.message || 'Order accepted successfully!');
      } else {
        toast.error(response?.message || 'Failed to accept order');
      }
      await getCurrentOrder();
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  const sendOtp = async (orderId, shopOrderId) => {
    try {
      const response = await sendDeliveryBoyOtp(orderId, shopOrderId);
      setShowOtpBox(true);
      console.log('OTP SENT API: ', response);
      if (response?.success === true) {
        toast.success(response?.message || 'OTP sent successfully!');
      } else {
        toast.error(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  const verifyOtp = async (orderId, shopOrderId, otp) => {
    try {
      const response = await verifyDeliveryBoyOtp(orderId, shopOrderId, otp);
      console.log('OTP VERIFIED API: ', response);
      if (response?.success === true) {
        toast.success(response?.message || 'OTP verified successfully!');
      } else {
        toast.error(response?.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    getAssignment();
    getCurrentOrder();
  }, [userData]);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fff9f6] to-white px-3 xs:px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 pt-16 sm:pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4 sm:gap-6 bg-white rounded-xl sm:rounded-2xl px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 shadow-sm border border-orange-100 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 xs:gap-4 sm:gap-5 mb-3 xs:mb-0">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-2.5 xs:p-3 sm:p-3.5 rounded-lg xs:rounded-xl border border-orange-200">
                <FaMotorcycle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-[#ff4d2d]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-gray-900 text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold truncate">
                  Welcome, {userData?.fullName}
                </h1>
                <p className="text-gray-600 text-xs xs:text-sm sm:text-base mt-0.5">
                  Ready to deliver happiness!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 xs:flex xs:flex-row gap-2 xs:gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-orange-200 min-w-0">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm text-gray-600 font-medium truncate">Latitude</p>
                  <p className="text-gray-900 font-mono text-xs xs:text-sm sm:text-base font-semibold truncate">
                    {userData?.location?.coordinates[1]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-orange-200 min-w-0">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs xs:text-sm text-gray-600 font-medium truncate">Longitude</p>
                  <p className="text-gray-900 font-mono text-xs xs:text-sm sm:text-base font-semibold truncate">
                    {userData?.location?.coordinates[0]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!currentOrder && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              {/* Section Header */}
              <div className="border-b border-orange-100 px-4 xs:px-5 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 xs:p-2.5 sm:p-3 rounded-lg border border-green-200">
                      <FaBoxOpen className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 truncate">
                        Available Deliveries
                      </h2>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                        Pick up orders and start earning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between xs:justify-end gap-3">
                    <span className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 sm:py-2 rounded-full text-xs xs:text-sm sm:text-base font-semibold whitespace-nowrap">
                      {availableOrders.length} {window.innerWidth < 400 ? '' : 'Orders'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="p-4 xs:p-5 sm:p-6 md:p-8">
                {availableOrders.length > 0 ? (
                  <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                    {availableOrders.map((order, index) => (
                      <div
                        key={order?.assignmentId || index}
                        className="group bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 p-4 xs:p-5 sm:p-6 transition-all duration-300 hover:shadow-lg"
                      >
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-3 xs:mb-4 sm:mb-5">
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-1.5 xs:gap-2 sm:gap-3 mb-2">
                              <span className="text-xs xs:text-sm font-semibold px-2.5 xs:px-3 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 truncate max-w-[120px] xs:max-w-[140px] sm:max-w-none">
                                #{order?.assignmentId?.slice(-8)?.toUpperCase() || 'N/A'}
                              </span>
                              <span className="text-xs xs:text-sm font-semibold px-2.5 xs:px-3 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                                ₹{order?.subtotal || 0}
                              </span>
                            </div>
                            <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                              {order?.shopName || 'Restaurant'}
                            </h3>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mb-3 xs:mb-4 sm:mb-5">
                          <div className="flex items-start gap-2 sm:gap-3 mb-2">
                            <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mt-0.5 xs:mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs xs:text-sm font-semibold text-gray-600 mb-1">
                                Delivery Address
                              </p>
                              <p className="text-gray-900 text-xs xs:text-sm sm:text-base leading-relaxed line-clamp-2">
                                {order?.deliveryAddress?.text || 'Address not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="mb-4 xs:mb-5 sm:mb-6">
                          <p className="text-xs xs:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">
                            Items Preview
                          </p>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                            {order?.items?.slice(0, 4).map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200"
                              >
                                <p className="text-xs xs:text-sm font-medium text-gray-900 truncate">
                                  {item?.name || `Item ${idx + 1}`}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  Qty: {item?.quantity || 1} × ₹{item?.price || 0}
                                </p>
                              </div>
                            ))}
                            {order?.items?.length > 4 && (
                              <div className="bg-gray-100 rounded-lg p-2 sm:p-3 border border-gray-300 flex items-center justify-center col-span-2 xs:col-span-1">
                                <span className="text-xs xs:text-sm font-semibold text-gray-600">
                                  +{order.items.length - 4} more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 sm:gap-0">
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-500 w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs xs:text-sm sm:text-base text-gray-600 font-medium whitespace-nowrap">
                              Ready for pickup
                            </span>
                          </div>
                          <button
                            className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 hover:from-[#ff5c3d] hover:to-orange-600 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold text-xs xs:text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg w-full xs:w-auto cursor-pointer"
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
                  <div className="flex flex-col items-center justify-center py-8 xs:py-10 sm:py-12 md:py-16 px-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 xs:p-8 sm:p-10 rounded-xl xs:rounded-2xl border border-gray-200 mb-4 xs:mb-6 sm:mb-8">
                      <FaBoxOpen className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 text-gray-400" />
                    </div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                      No deliveries available
                    </h3>
                    <p className="text-gray-600 text-center text-sm xs:text-base sm:text-lg max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mb-4 xs:mb-6 sm:mb-8 px-2">
                      All orders have been assigned. Check back soon for new delivery opportunities!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentOrder && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-orange-100 overflow-hidden mb-6 sm:mb-8">
              <div className="border-b border-orange-100 px-4 xs:px-5 sm:px-6 md:px-8 py-3 xs:py-4 sm:py-5">
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-0">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 xs:p-2.5 sm:p-3 rounded-lg border border-green-200">
                      <FaBoxOpen className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 truncate">
                        Current Delivery
                      </h2>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                        Active delivery in progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 xs:p-5 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-4 xs:p-5 sm:p-6">
                      <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
                        <span className="text-xs xs:text-sm font-semibold px-2.5 xs:px-3 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                          #{currentOrder?.shopOrder?._id?.slice(-8)?.toUpperCase() || 'N/A'}
                        </span>
                        <span className="text-xs xs:text-sm font-semibold px-2.5 xs:px-3 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                          ₹{currentOrder?.shopOrder?.subtotal || 0}
                        </span>
                      </div>

                      <div className="mb-4 xs:mb-5 sm:mb-6">
                        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2">
                          {currentOrder?.shopOrder?.shop?.name || 'TEMP Restaurant'}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                          <FaMotorcycle className="text-orange-500 w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                          <span>Pickup from restaurant</span>
                        </p>
                      </div>

                      <div className="mb-4 xs:mb-5 sm:mb-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <FaMapMarkerAlt className="text-[#ff4d2d] w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs xs:text-sm font-semibold text-gray-600 mb-1">
                              Delivery Address
                            </p>
                            <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
                              {currentOrder?.deliveryAddress?.text || 'Address not specified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs xs:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">
                          Order Items ({currentOrder?.shopOrder?.shopOrderItems?.length || 0})
                        </p>
                        <div className="space-y-2 sm:space-y-3">
                          {currentOrder?.shopOrder?.shopOrderItems?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-white rounded-lg p-2 xs:p-3 sm:p-4 border border-gray-100"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                  {item?.name || `Item ${idx + 1}`}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  Qty: {item?.quantity || 1}
                                </p>
                              </div>
                              <span className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap ml-2">
                                ₹{item?.price || 0}
                              </span>
                            </div>
                          ))}
                          {currentOrder?.shopOrder?.shopOrderItems?.length > 3 && (
                            <div className="bg-gray-50 rounded-lg p-2 xs:p-3 sm:p-4 border border-gray-200 text-center">
                              <span className="text-sm sm:text-base font-medium text-gray-600">
                                +{currentOrder.shopOrder.shopOrderItems.length - 3} more items
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <DeliveryBoyTracking data={currentOrder} />
                  </div>
                </div>

                {!showOtpBox ? (
                  <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 flex justify-end">
                    <button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-5 sm:px-6 md:px-8 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg w-full xs:w-auto cursor-pointer"
                      onClick={() => sendOtp(currentOrder?._id, currentOrder?.shopOrder?._id)}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 p-4 xs:p-5 sm:p-6 md:p-8">
                    <div className="mb-4 xs:mb-5 sm:mb-6">
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Verify Delivery
                      </h3>
                      <p className="text-gray-600 text-sm xs:text-base sm:text-lg">
                        Enter the OTP sent to{' '}
                        <span className="font-semibold text-orange-600">
                          {currentOrder?.user?.fullName || 'customer'}
                        </span>{' '}
                        to complete the delivery
                      </p>
                    </div>

                    <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1.5 xs:mb-2 sm:mb-3">
                          OTP Code
                        </label>
                        <input
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                          type="number"
                          placeholder="Enter 6-digit OTP"
                          className="w-full border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 px-3 xs:px-4 sm:px-5 py-2.5 xs:py-3 sm:py-3.5 rounded-lg xs:rounded-xl text-sm xs:text-base sm:text-lg transition-all duration-200 outline-none"
                        />
                        <p className="text-xs xs:text-sm text-gray-500 mt-1.5 xs:mt-2 sm:mt-3">
                          Check customer's phone for the verification code
                        </p>
                      </div>

                      <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                        <button
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 xs:py-3 sm:py-3.5 px-4 xs:px-6 sm:px-8 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 text-sm xs:text-base sm:text-lg flex-1 cursor-pointer"
                          onClick={() =>
                            verifyOtp(currentOrder?._id, currentOrder?.shopOrder?._id, otp)
                          }
                        >
                          Submit OTP & Complete Delivery
                        </button>
                        <button
                          onClick={() => setShowOtpBox(false)}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-2.5 xs:py-3 sm:py-3.5 px-4 xs:px-6 sm:px-8 rounded-lg xs:rounded-xl border border-gray-300 hover:border-gray-400 active:scale-95 transition-all duration-200 text-sm xs:text-base sm:text-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-8 sm:h-12 md:h-16"></div>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;

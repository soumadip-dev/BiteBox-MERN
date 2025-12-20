import React, { useEffect, useState } from 'react';
import { getOrderById } from '../api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import {
  FaMotorcycle,
  FaReceipt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserCircle,
  FaShoppingBag,
} from 'react-icons/fa';
import { MdRestaurant, MdLocalShipping, MdPayments } from 'react-icons/md';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetOrder = async orderId => {
    setIsLoading(true);
    try {
      const response = await getOrderById(orderId);
      console.log(response.order.paymentMethod);

      if (response?.success === true) {
        toast.success(response?.message || 'Order details loaded successfully!');
      } else {
        toast.error(response?.message || 'Failed to load order details');
      }
      setCurrentOrder(response.order);
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      handleGetOrder(orderId);
    }
  }, [orderId]);

  return (
    <div className="flex justify-center flex-col items-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen w-full">
      {/* Updated Upper Part to match MyOrders page */}
      <button
        className="absolute top-4 sm:top-5 md:top-6 left-3 sm:left-4 md:left-6 p-1.5 sm:p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group z-10"
        onClick={() => navigate('/my-orders')}
      >
        <IoIosArrowRoundBack
          size={28}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200 sm:w-8 sm:h-8 md:w-auto md:h-auto"
        />
      </button>

      <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0 w-full max-w-6xl">
        <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-3 sm:p-4 rounded-2xl shadow-inner mb-3 sm:mb-4 border border-orange-200/30">
          <FaMotorcycle className="text-[#ff4d2d] w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-sm" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center">
          Order Tracking
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-center text-sm sm:text-base px-2">
          Real-time updates for your delivery
          <span className="ml-1 sm:ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            #{orderId?.slice(-8)?.toUpperCase() || 'ORDER'}
          </span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 w-full max-w-6xl">
          <div className="relative mb-4 sm:mb-5 md:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-200">
              <FaMotorcycle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-300 animate-bounce" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 text-center">
            Tracking Your Order...
          </h3>
          <p className="text-gray-600 text-sm sm:text-base text-center">
            Fetching real-time delivery updates
          </p>
        </div>
      ) : currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full max-w-6xl px-3 sm:px-4 md:px-0">
          {/* Order Details Cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
            {currentOrder?.shopOrders?.map((shopOrder, index) => (
              <div key={index} className="group">
                {/* Restaurant Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/70 overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-orange-300/50">
                  <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg sm:rounded-xl border border-orange-200">
                          <MdRestaurant className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#ff4d2d]" />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                            {shopOrder?.shop?.name || 'Restaurant'}
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Preparing your delicious meal
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                        <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full border border-emerald-200">
                          <p className="text-emerald-700 font-bold text-sm sm:text-base">
                            ₹{shopOrder?.subtotal?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <FaShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                          Order Items ({shopOrder?.shopOrderItems?.length || 0})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {shopOrder?.shopOrderItems?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                  {item?.name || `Item ${idx + 1}`}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Quantity: {item?.quantity || 1}
                                </p>
                              </div>
                              <span className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap shrink-0">
                                ₹{item?.price?.toLocaleString() || '0'}
                              </span>
                            </div>
                            {item?.addOns?.length > 0 && (
                              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Add-ons:</p>
                                <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                                  {item.addOns.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address - Only show if not delivered */}
                    {shopOrder?.status !== 'delivered' && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200">
                          <div className="p-2 sm:p-2.5 bg-white rounded-lg border border-blue-100 shrink-0">
                            <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                              Delivery Address
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                              {currentOrder?.deliveryAddress?.text || 'Address not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delivery Boy Info - Only show if not delivered */}
                    {shopOrder?.assignedDeliveryBoy && shopOrder?.status !== 'delivered' && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg sm:rounded-xl border border-orange-200">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-md opacity-30"></div>
                              <div className="relative p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-orange-200">
                                <FaUserCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-orange-500" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                                {shopOrder.assignedDeliveryBoy.fullName}
                              </h4>
                              <p className="text-gray-600 text-xs sm:text-sm">
                                Your delivery partner
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0">
                            <a
                              href={`tel:${shopOrder.assignedDeliveryBoy.mobile}`}
                              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 text-gray-800 font-medium transition-all duration-300 hover:shadow-md hover:border-orange-400 text-sm sm:text-base whitespace-nowrap"
                            >
                              <FaPhoneAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>Call Driver</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Waiting for delivery boy assignment - Only show if not delivered and no delivery boy assigned */}
                    {!shopOrder?.assignedDeliveryBoy && shopOrder?.status !== 'delivered' && (
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg sm:rounded-xl border border-gray-300 text-center">
                        <p className="text-gray-600 font-medium text-sm sm:text-base">
                          Waiting for delivery boy assignment...
                        </p>
                      </div>
                    )}

                    {/* Tracking Map - Only show if not delivered */}
                    {shopOrder?.assignedDeliveryBoy && shopOrder?.status !== 'delivered' && (
                      <div className="mt-4 sm:mt-5 md:mt-6">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <MdLocalShipping className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Live Tracking
                          </h3>
                        </div>
                        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-300 shadow-lg h-[250px] sm:h-[300px] md:h-[350px]">
                          <DeliveryBoyTracking
                            data={{
                              deliveryBoyLocation: {
                                lat: shopOrder?.assignedDeliveryBoy?.location?.coordinates[1],
                                lon: shopOrder?.assignedDeliveryBoy?.location?.coordinates[0],
                              },
                              customerLocation: {
                                lat: currentOrder?.deliveryAddress?.latitude,
                                lon: currentOrder?.deliveryAddress?.longitude,
                              },
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Delivered Status Message */}
                    {shopOrder?.status === 'delivered' && (
                      <div className="mt-4 sm:mt-6 md:mt-7">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <MdLocalShipping className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            Delivery Completed
                          </h3>
                        </div>
                        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border border-emerald-200 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 border-4 border-emerald-200">
                              <svg
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-700 mb-1 sm:mb-2">
                              Order Delivered Successfully!
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                              Your order has been delivered to your address. Thank you for choosing
                              us!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-6 md:top-8">
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/70 p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                  <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg border border-emerald-200">
                    <FaReceipt className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Order Summary</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Order ID</span>
                    <span className="font-mono font-bold text-gray-900 text-xs sm:text-sm md:text-base truncate ml-2">
                      #{orderId?.slice(-8)?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Total Items</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      {currentOrder?.shopOrders?.reduce(
                        (acc, order) => acc + (order?.shopOrderItems?.length || 0),
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      ₹
                      {currentOrder?.shopOrders
                        ?.reduce((acc, order) => acc + (order?.subtotal || 0), 0)
                        ?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm sm:text-base">Delivery Fee</span>
                    <span className="font-bold text-green-600 text-sm sm:text-base">FREE</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 sm:pt-3">
                    <span className="text-base sm:text-lg font-semibold text-gray-800">
                      Total Amount
                    </span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      ₹
                      {currentOrder?.shopOrders
                        ?.reduce((acc, order) => acc + (order?.subtotal || 0), 0)
                        ?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-3 sm:pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
                      <MdPayments className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                      Payment Status
                    </h4>
                  </div>
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                      (currentOrder?.paymentMethod === 'cod' &&
                        currentOrder?.shopOrders?.some(
                          shopOrder => shopOrder?.status === 'delivered'
                        )) ||
                      currentOrder?.paymentMethod !== 'cod'
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                        : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                    }`}
                  >
                    <p
                      className={`text-sm sm:text-base text-center font-semibold ${
                        (currentOrder?.paymentMethod === 'cod' &&
                          currentOrder?.shopOrders?.some(
                            shopOrder => shopOrder?.status === 'delivered'
                          )) ||
                        currentOrder?.paymentMethod !== 'cod'
                          ? 'text-emerald-700'
                          : 'text-orange-700'
                      }`}
                    >
                      {currentOrder?.paymentMethod === 'cod'
                        ? currentOrder?.shopOrders?.some(
                            shopOrder => shopOrder?.status === 'delivered'
                          )
                          ? 'PAID'
                          : 'UNPAID'
                        : 'PAID'}
                    </p>
                  </div>
                </div>
                {currentOrder?.shopOrders?.some(order => order?.status !== 'delivered') && (
                  <div className="mt-6 sm:mt-8">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg sm:rounded-xl border border-orange-200 p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-sm sm:text-base">
                        Need Help?
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                        Contact our support team for any assistance with your order
                      </p>
                      <button className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-sm sm:text-base">
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 text-center max-w-md w-full">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/50 mb-4 sm:mb-5 md:mb-6 w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-500 mb-3 sm:mb-4">
              Order Not Found
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              We couldn't find the order you're looking for. Please check the order ID and try
              again.
            </p>
          </div>
          <button
            onClick={() => navigate('/my-orders')}
            className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 shadow-md cursor-pointer text-sm sm:text-base"
          >
            View My Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;

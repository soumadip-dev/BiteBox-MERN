import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { getDeliveryBoyAssignment } from '../api/orderApi';
import { FaMapMarkerAlt, FaBoxOpen, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';

const DeliveryBoyDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const { userData } = useSelector(state => state.user);

  const getAssignment = async () => {
    const response = await getDeliveryBoyAssignment();
    response && setAvailableOrders(response?.assignments || []);
  };

  useEffect(() => {
    getAssignment();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fff9f6] to-white px-4 sm:px-6 py-6 sm:py-8 pt-20 md:pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm border border-orange-100 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-xl border border-orange-200">
                <FaMotorcycle className="w-6 h-6 text-[#ff4d2d]" />
              </div>
              <div>
                <h1 className="text-gray-900 text-2xl font-bold">Welcome, {userData?.fullName}</h1>
                <p className="text-gray-600 text-sm mt-1">Ready to deliver happiness! 🚀</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 rounded-xl border border-orange-200">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-4 h-4" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Latitude</p>
                  <p className="text-gray-900 font-mono text-sm font-semibold">
                    {userData?.location?.coordinates[1]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 rounded-xl border border-orange-200">
                <FaMapMarkerAlt className="text-[#ff4d2d] w-4 h-4" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Longitude</p>
                  <p className="text-gray-900 font-mono text-sm font-semibold">
                    {userData?.location?.coordinates[0]?.toFixed(6) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Orders Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-orange-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 rounded-lg border border-green-200">
                    <FaBoxOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Available Deliveries</h2>
                    <p className="text-sm text-gray-600">Pick up orders and start earning</p>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  {availableOrders.length} Orders
                </span>
              </div>
            </div>

            {/* Orders List */}
            <div className="p-6">
              {availableOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {availableOrders.map((order, index) => (
                    <div
                      key={order?.assignmentId || index}
                      className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 p-5 transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                              #{order?.assignmentId?.slice(-8)?.toUpperCase() || 'N/A'}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                              ₹{order?.subtotal || 0}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {order?.shopName || 'Restaurant'}
                          </h3>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <FaMapMarkerAlt className="text-[#ff4d2d] w-4 h-4 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              Delivery Address
                            </p>
                            <p className="text-gray-900 text-sm leading-relaxed">
                              {order?.deliveryAddress?.text || 'Address not specified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Items Preview</p>
                        <div className="flex gap-2">
                          {order?.items?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex-1 min-w-0 bg-white rounded-lg p-2 border border-gray-200"
                            >
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {item?.name || `Item ${idx + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item?.quantity || 1} × ₹{item?.price || 0}
                              </p>
                            </div>
                          ))}
                          {order?.items?.length > 3 && (
                            <div className="bg-gray-100 rounded-lg p-2 border border-gray-300 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{order.items.length - 3} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500 w-4 h-4" />
                          <span className="text-sm text-gray-600 font-medium">
                            Ready for pickup
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 hover:from-[#ff5c3d] hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg">
                          Accept Delivery
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200 mb-6">
                    <FaBoxOpen className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No deliveries available</h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    All orders have been assigned. Check back soon for new delivery opportunities!
                  </p>
                  <button
                    onClick={getAssignment}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300 shadow-sm"
                  >
                    Refresh Orders
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;

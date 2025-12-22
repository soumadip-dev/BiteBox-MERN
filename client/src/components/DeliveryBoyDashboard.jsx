import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import {
  acceptTheOrder,
  getDeliveryBoyAssignment,
  getTheCurrentOrder,
  getTodayDeliveries,
  sendDeliveryBoyOtp,
  verifyDeliveryBoyOtp,
} from '../api/orderApi';
import { FaMapMarkerAlt, FaBoxOpen, FaMotorcycle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DeliveryBoyTracking from './DeliveryBoyTracking';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DeliveryBoyDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [totalEarning, setTotalEarning] = useState(0);
  const [todayDeliveries, setTodayDeliveries] = useState([]);

  const { userData, socket } = useSelector(state => state.user);

  useEffect(() => {
    if (!socket || userData.role !== 'deliveryBoy') return;
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setDeliveryLocation({ lat: latitude, lon: longitude });
          socket.emit('updateLocation', { latitude, longitude, userId: userData._id });
        },
        error => {
          toast.error(error?.message || 'GeoLocation is not supported');
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

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
      if (response?.success === true) {
        toast.success(response?.message || 'OTP verified successfully!');
      } else {
        toast.error(response?.message || 'Failed to verify OTP');
      }
      location.reload();
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const response = await getTodayDeliveries();
      setTodayDeliveries(response?.stats);
      toast.success(response?.message || 'Orders fetched!');
    } catch (error) {
      toast.error(error?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    handleTodayDeliveries();
  }, []);

  useEffect(() => {
    const ratePerDelivery = 50;
    const totalEarning = todayDeliveries?.reduce(
      (sum, delivery) => sum + delivery.count * ratePerDelivery,
      0
    );
    setTotalEarning(totalEarning);
  }, [todayDeliveries]);

  useEffect(() => {
    socket.on('newOrderAssignment', data => {
      if (data.sentTo === userData._id) {
        setAvailableOrders(prev => [...prev, data]);
      }
    });

    return () => {
      socket.off('newOrderAssignment');
    };
  }, [socket]);

  useEffect(() => {
    getAssignment();
    getCurrentOrder();
  }, [userData]);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-b from-[#fff9f6] to-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-3 rounded-xl border border-orange-200">
                  <FaMotorcycle className="w-7 h-7 sm:w-8 sm:h-8 text-[#ff4d2d]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Welcome, {userData?.fullName}
                  </h1>
                  <p className="text-gray-600 mt-1">Ready to deliver happiness!</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-3 rounded-xl border border-orange-200">
                  <FaMapMarkerAlt className="text-[#ff4d2d] w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Latitude</p>
                    <p className="text-gray-900 font-mono font-semibold">
                      {deliveryLocation?.lat?.toFixed(6) ||
                        userData?.location?.coordinates[1]?.toFixed(6) ||
                        'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-3 rounded-xl border border-orange-200">
                  <FaMapMarkerAlt className="text-[#ff4d2d] w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Longitude</p>
                    <p className="text-gray-900 font-mono font-semibold">
                      {deliveryLocation?.lon?.toFixed(6) ||
                        userData?.location?.coordinates[0]?.toFixed(6) ||
                        'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Today's Performance</h2>
                <p className="text-gray-600 mt-1">Delivery statistics and earnings</p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 rounded-xl border border-orange-200">
                  <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalEarning}</p>
                </div>
              </div>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={hour => `${hour}:00`}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={count => count.toLocaleString()}
                    allowDecimals={false}
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={value => [value.toLocaleString(), 'Orders']}
                    labelFormatter={label => `${label}:00`}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #ffd1c4',
                      background: 'white',
                    }}
                  />
                  <Bar dataKey="count" fill="#ff4d2d" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {!currentOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="border-b border-orange-100 px-6 sm:px-8 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                      <FaBoxOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Available Deliveries
                      </h2>
                      <p className="text-gray-600">Pick up orders and start earning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {availableOrders.length} Orders Available
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {availableOrders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {availableOrders.map((order, index) => (
                      <div
                        key={order?.assignmentId || index}
                        className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 p-6 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                                #{order?.assignmentId?.slice(-8)?.toUpperCase() || 'N/A'}
                              </span>
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                                ₹{order?.subtotal || 0}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {order?.shopName || 'Restaurant'}
                            </h3>
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-start gap-3 mb-3">
                            <FaMapMarkerAlt className="text-[#ff4d2d] w-5 h-5 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-600 mb-1">
                                Delivery Address
                              </p>
                              <p className="text-gray-900 text-sm leading-relaxed line-clamp-2">
                                {order?.deliveryAddress?.text || 'Address not specified'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-sm font-semibold text-gray-600 mb-3">Items Preview</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {order?.items?.slice(0, 4).map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item?.name || `Item ${idx + 1}`}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  Qty: {item?.quantity || 1} × ₹{item?.price || 0}
                                </p>
                              </div>
                            ))}
                            {order?.items?.length > 4 && (
                              <div className="bg-gray-100 rounded-lg p-3 border border-gray-300 flex items-center justify-center col-span-2 sm:col-span-1">
                                <span className="text-sm font-semibold text-gray-600">
                                  +{order.items.length - 4} more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 hover:from-[#ff5c3d] hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg cursor-pointer w-full sm:w-auto"
                            onClick={() => acceptOrder(order?.assignmentId)}
                          >
                            Accept Delivery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-2xl border border-gray-200 mb-8">
                      <FaBoxOpen className="w-20 h-20 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      No deliveries available
                    </h3>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                      All orders have been assigned. Check back soon for new delivery opportunities!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="border-b border-orange-100 px-6 sm:px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                    <FaBoxOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Current Delivery
                    </h2>
                    <p className="text-gray-600">Active delivery in progress</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                          #{currentOrder?.shopOrder?._id?.slice(-8)?.toUpperCase() || 'N/A'}
                        </span>
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200">
                          ₹{currentOrder?.shopOrder?.subtotal || 0}
                        </span>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {currentOrder?.shopOrder?.shop?.name || 'TEMP Restaurant'}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaMotorcycle className="text-orange-500 w-5 h-5" />
                          <span>Pickup from restaurant</span>
                        </p>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-start gap-3">
                          <FaMapMarkerAlt className="text-[#ff4d2d] w-5 h-5 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600 mb-1">
                              Delivery Address
                            </p>
                            <p className="text-gray-900 leading-relaxed">
                              {currentOrder?.deliveryAddress?.text || 'Address not specified'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                          Order Items ({currentOrder?.shopOrder?.shopOrderItems?.length || 0})
                        </p>
                        <div className="space-y-3">
                          {currentOrder?.shopOrder?.shopOrderItems?.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-white rounded-lg p-4 border border-gray-100"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 truncate">
                                  {item?.name || `Item ${idx + 1}`}
                                </p>
                                <p className="text-sm text-gray-500">Qty: {item?.quantity || 1}</p>
                              </div>
                              <span className="font-semibold text-gray-900 whitespace-nowrap ml-4">
                                ₹{item?.price || 0}
                              </span>
                            </div>
                          ))}
                          {currentOrder?.shopOrder?.shopOrderItems?.length > 3 && (
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                              <span className="font-medium text-gray-600">
                                +{currentOrder.shopOrder.shopOrderItems.length - 3} more items
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <DeliveryBoyTracking
                      data={{
                        deliveryBoyLocation: deliveryLocation || {
                          lat: userData?.location?.coordinates[1],
                          lon: userData?.location?.coordinates[0],
                        },
                        customerLocation: {
                          lat: currentOrder?.deliveryAddress?.latitude,
                          lon: currentOrder?.deliveryAddress?.longitude,
                        },
                      }}
                    />
                  </div>
                </div>

                {!showOtpBox ? (
                  <div className="mt-8 flex justify-end">
                    <button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
                      onClick={() => sendOtp(currentOrder?._id, currentOrder?.shopOrder?._id)}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Verify Delivery</h3>
                      <p className="text-gray-600">
                        Enter the OTP sent to{' '}
                        <span className="font-semibold text-orange-600">
                          {currentOrder?.user?.fullName || 'customer'}
                        </span>{' '}
                        to complete the delivery
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          OTP Code
                        </label>
                        <input
                          value={otp}
                          onChange={e => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 6) setOtp(value);
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Enter 6-digit OTP"
                          className="w-full border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 px-4 py-3 rounded-xl text-base transition-all duration-200 outline-none"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Check customer's phone for the verification code
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex-1 cursor-pointer"
                          onClick={() =>
                            verifyOtp(currentOrder?._id, currentOrder?.shopOrder?._id, otp)
                          }
                        >
                          Submit OTP & Complete Delivery
                        </button>
                        <button
                          onClick={() => setShowOtpBox(false)}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl border border-gray-300 hover:border-gray-400 active:scale-95 transition-all duration-200 cursor-pointer"
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

          <div className="h-16"></div>
        </div>
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;

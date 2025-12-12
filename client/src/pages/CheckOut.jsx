import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { IoLocationSharp } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { TbCurrentLocation } from 'react-icons/tb';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MdDeliveryDining } from 'react-icons/md';
import { FaMobileScreenButton, FaCreditCard } from 'react-icons/fa6';

import 'leaflet/dist/leaflet.css';
import { setAddressForDelivery, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { placeOrder } from '../api/orderApi';
import { addMyOrder } from '../redux/userSlice';

//* Recenter map on drag end
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location?.lat, location?.lon], 16, { animate: true });
  }
}

//* Checkout component
const CheckOut = () => {
  const { location, address } = useSelector(state => state.map);
  const { cartItems, cartTotal } = useSelector(state => state.user);
  const [addressInput, setAddressInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subTotal = cartTotal;
  const deliveryCharge = subTotal > 500 ? 0 : 50;
  const total = subTotal + deliveryCharge;

  // Change location on drag end
  const onDragEnd = e => {
    let _lat = e.target._latlng.lat;
    let _lng = e.target._latlng.lng;
    dispatch(setLocation({ lat: _lat, lon: _lng }));
    getAddressByLatLng(_lat, _lng);
  };

  // Change address on pointer change
  const getAddressByLatLng = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${
          import.meta.env.VITE_GEOAPI_KEY
        }`
      );

      const address =
        response.data?.results?.[0].address_line2 ||
        response.data?.results?.[0].address_line1 ||
        'Unknown';

      dispatch(setAddressForDelivery(address));
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Failed to get address. Please try again.');
    }
  };

  // Get lat lng by address provided in input field
  const getLatLngByAddress = async addressInput => {
    if (!addressInput.trim()) {
      toast.error('Please enter an address');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
      );

      const feature = response.data?.features?.[0];
      if (!feature) {
        toast.error('Address not found. Please try a different address.');
        return;
      }

      // GeoJSON format: [longitude, latitude]
      const [longitude, latitude] = feature.geometry.coordinates;

      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      toast.error('Failed to search address. Please try again.');
    }
  };

  // Get currect address on click
  const getCurrentAddress = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ lat: latitude, lon: longitude }));
          getAddressByLatLng(latitude, longitude);
        },
        error => {
          console.error('Geolocation error:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true); // Start loading
    try {
      const orderData = {
        cartItems,
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon,
        },
        totalAmount: subTotal,
      };
      const response = await placeOrder(orderData);
      dispatch(addMyOrder(response.order));
      toast.success(response.message);
      navigate('/order-placed');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="flex justify-center flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group z-10"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl mt-2 sm:mt-0">
        {/* Checkout Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 border border-orange-100/50">
          {/* Page Title Inside Card */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Checkout</h1>

          {/* Location Section */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-2 rounded-xl">
                <IoLocationSharp className="text-[#ff4d2d] text-lg sm:text-xl" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Delivery Location
              </h2>
            </div>

            {/* Address Input Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="flex-1 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Enter your Delivery Address"
                onChange={e => setAddressInput(e.target.value)}
                value={addressInput}
              />
              <div className="flex gap-2">
                <button
                  className="flex-1 cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 sm:px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => getLatLngByAddress(addressInput)}
                >
                  <IoSearchOutline size={18} />
                  <span className="hidden xs:inline">Search</span>
                </button>
                <button
                  className="flex-1 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={getCurrentAddress}
                >
                  <TbCurrentLocation size={18} />
                  <span className="hidden xs:inline">Current</span>
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-inner">
              <div className="h-48 sm:h-64 w-full">
                <MapContainer
                  className={'w-full h-full'}
                  center={[location?.lat, location?.lon]}
                  zoom={16}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <RecenterMap location={location} />
                  <Marker
                    position={[location?.lat, location?.lon]}
                    draggable
                    eventHandlers={{
                      dragend: onDragEnd,
                    }}
                  />
                </MapContainer>
              </div>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-2 rounded-xl">
                <FaCreditCard className="text-[#ff4d2d] text-lg sm:text-xl" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Cash on Delivery Option */}
              <div
                className={`flex items-center gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#ff4d2d] bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-100">
                  <MdDeliveryDining className="text-green-600 text-lg sm:text-xl" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pay with cash when the order arrives</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-[#ff4d2d] bg-[#ff4d2d]' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* UPI/Card Option */}
              <div
                className={`flex items-center gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                  paymentMethod === 'online'
                    ? 'border-[#ff4d2d] bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setPaymentMethod('online')}
              >
                <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-purple-100">
                  <FaMobileScreenButton className="text-purple-600 text-base sm:text-lg" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    UPI / Credit / Debit Card
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pay Securely Online</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'online' ? 'border-[#ff4d2d] bg-[#ff4d2d]' : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'online' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Order Summary Section */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-2 rounded-xl">
                <div className="text-base sm:text-lg">🧾</div>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
              {/* Cart Items */}
              <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-48 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base whitespace-nowrap min-w-[80px] text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="relative py-1 sm:py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200/50"></div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 font-medium text-sm sm:text-base">Subtotal</span>

                  <span className="font-semibold text-gray-800 text-sm sm:text-base whitespace-nowrap min-w-[80px] text-right">
                    ₹{subTotal}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Delivery Charge
                  </span>
                  <span
                    className={`font-semibold text-sm sm:text-base whitespace-nowrap min-w-[80px] text-right ${
                      deliveryCharge === 0 ? 'text-green-600' : 'text-gray-800'
                    }`}
                  >
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-3 sm:pt-4 mt-1 sm:mt-2 border-t-2 border-orange-200/70">
                  <div>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent whitespace-nowrap min-w-[80px] text-right">
                    ₹{total}
                  </span>
                </div>

                {/* Free Delivery Message */}
                {subTotal < 500 && (
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Add ₹{500 - subTotal} more for{' '}
                      <span className="text-green-600 font-semibold">FREE delivery</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Place Order Button */}
          <button
            className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 transform ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:-translate-y-0.5 hover:shadow-lg hover:from-orange-600 hover:to-red-600 cursor-pointer'
            }`}
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Placing Order...</span>
              </div>
            ) : paymentMethod === 'cod' ? (
              'Place Order'
            ) : (
              'Pay and Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;

import { MdPhone } from 'react-icons/md';
import { updateOrderStatus } from '../api/orderApi';
import { updateShopOrderStatus } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const OwnerOrderCard = ({ order }) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const response = await updateOrderStatus(orderId, shopId, status);
      dispatch(updateShopOrderStatus({ orderId, shopId, status }));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Status color mapping
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'border-orange-300 bg-orange-50 text-orange-700';
      case 'preparing':
        return 'border-blue-300 bg-blue-50 text-blue-700';
      case 'out for delivery':
        return 'border-purple-300 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 mx-2 sm:mx-0">
      {/* Customer Info */}
      <div className="border-b border-gray-200 pb-4 sm:pb-5">
        <h2 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent break-words">
          {order?.user?.fullName}
        </h2>
        <p className="text-sm text-gray-500 font-medium mt-1 break-words">{order?.user?.email}</p>
        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg w-full sm:w-fit">
          <MdPhone className="text-blue-500 flex-shrink-0" />
          <span className="font-medium truncate">{order?.user?.mobile}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start gap-2 flex-col text-gray-600 text-sm bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-3 sm:px-4 py-3 border border-gray-200">
        <p className="font-medium text-gray-900">Delivery Address</p>
        <p className="break-words w-full">{order?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500 font-mono mt-1 break-all">
          Lat: {order?.deliveryAddress?.latitude}, Lng: {order?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* Order Items Grid */}
      <div className="space-y-4 sm:space-y-6">
        {order?.shopOrders?.map((shopOrder, shopIndex) => (
          <div key={shopOrder._id || shopIndex} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {shopOrder.shopOrderItems?.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <img
                    src={item.item?.image}
                    alt={item.item?.name}
                    className="w-full h-16 sm:h-20 aspect-square object-cover rounded-md mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-200 relative z-10"
                  />
                  <p
                    className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2rem] leading-tight tracking-tight relative z-10 break-words"
                    title={item.item?.name}
                  >
                    {item.item?.name}
                  </p>
                  <p className="text-xs text-gray-600 font-medium relative z-10">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-3 sm:px-4 py-3 border border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Order Status:
                </span>
                <span
                  className={`font-semibold px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm capitalize shadow-xs whitespace-nowrap ${getStatusColor(
                    shopOrder?.status
                  )}`}
                >
                  {shopOrder?.status}
                </span>
              </div>

              {/* Enhanced Select */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={shopOrder?.status}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm appearance-none pr-10 cursor-pointer"
                  onChange={e => handleUpdateStatus(order._id, shopOrder.shop._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out for delivery">Out for delivery</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4 sm:pt-5 space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Total Amount:</span>
          <span className="font-bold text-lg text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ₹{order?.totalAmount}
          </span>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-gray-600 font-medium text-sm sm:text-base">Payment Method:</span>
          <span className="font-medium text-gray-700 bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm uppercase border border-gray-200 whitespace-nowrap">
            {order?.paymentMethod}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;

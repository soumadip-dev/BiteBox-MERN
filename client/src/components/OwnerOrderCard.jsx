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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
      {/* Customer Info */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {order?.user?.fullName}
        </h2>
        <p className="text-sm text-gray-500 font-medium mt-1">{order?.user?.email}</p>
        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg w-fit">
          <MdPhone className="text-blue-500" />
          <span className="font-medium">{order?.user?.mobile}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div className="flex items-start gap-2 flex-col text-gray-600 text-sm bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-4 py-3 border border-gray-200">
        <p className="font-medium text-gray-900">Delivery Address</p>
        <p>{order?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Lat: {order?.deliveryAddress?.latitude}, Lng: {order?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* Order Items Grid */}
      <div className="space-y-6">
        {order?.shopOrders?.map((shopOrder, shopIndex) => (
          <div key={shopOrder._id || shopIndex} className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {shopOrder.shopOrderItems?.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <img
                    src={item.item?.image}
                    alt={item.item?.name}
                    className="w-full h-20 aspect-square object-cover rounded-md mb-2 group-hover:scale-105 transition-transform duration-200 relative z-10"
                  />
                  <p
                    className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2rem] leading-tight tracking-tight relative z-10"
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
            <div className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-4 py-3 border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Order Status:</span>
                <span className="font-semibold text-blue-600 px-3 py-1.5 bg-white rounded-full border border-blue-200 text-sm capitalize shadow-xs">
                  {shopOrder?.status}
                </span>
              </div>
              <select
                value={shopOrder?.status}
                className="rounded-lg border border-blue-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 font-medium bg-white hover:bg-blue-50 transition-all duration-200 shadow-xs appearance-none pr-10"
                onChange={e => handleUpdateStatus(order._id, shopOrder.shop._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out for delivery">Out for delivery</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Amount:</span>
          <span className="font-bold text-lg text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ₹{order?.totalAmount}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Payment Method:</span>
          <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm uppercase border border-gray-200">
            {order?.paymentMethod}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OwnerOrderCard;

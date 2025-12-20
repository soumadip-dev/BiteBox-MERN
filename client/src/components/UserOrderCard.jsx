import { useNavigate } from 'react-router-dom';

const UserOrderCard = ({ order }) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const navigate = useNavigate();

  const paymentStatus =
    order?.paymentMethod === 'cod'
      ? order?.shopOrders?.some(shopOrder => shopOrder?.status === 'delivered')
        ? 'PAID'
        : 'UNPAID'
      : 'PAID';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4">
        <div className="space-y-1 mb-3 sm:mb-0">
          <p className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col sm:items-end space-y-1">
          <p className="text-xs sm:text-sm text-gray-600 font-medium capitalize">{paymentStatus}</p>
          <p className="font-semibold text-blue-600 text-sm sm:text-base tracking-wide capitalize">
            {order.shopOrders[0]?.status}
          </p>
        </div>
      </div>

      {order.shopOrders.map((shopOrder, index) => (
        <div key={shopOrder._id || index} className="space-y-4 sm:space-y-5">
          <div className="border-l-3 sm:border-l-4 border-blue-500 pl-3 sm:pl-4 py-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base tracking-wide truncate">
              {shopOrder.shop.name}
            </p>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {shopOrder.shopOrderItems?.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150 group flex flex-col"
              >
                <div className="relative w-full pt-[100%] mb-2 overflow-hidden rounded-md">
                  <img
                    src={item.item?.image}
                    alt={item.item?.name}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p
                  className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2rem] leading-tight tracking-tight flex-grow"
                  title={item.item?.name}
                >
                  {item.item?.name}
                </p>
                <p className="text-xs text-gray-600 font-medium mt-auto">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 rounded-lg px-3 sm:px-4 py-3 border border-gray-200 gap-2 sm:gap-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-base tracking-wide">
              Subtotal: ₹{shopOrder.subtotal}
            </p>
            <span className="text-xs sm:text-sm font-medium text-blue-600 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 tracking-wide capitalize whitespace-nowrap">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 pt-4 gap-3 sm:gap-0">
        <div>
          <p className="font-bold text-gray-900 text-base sm:text-lg tracking-wide">
            Total: ₹{order.totalAmount}
          </p>
        </div>
        <button
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          onClick={() => navigate(`/track-order/${order._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;

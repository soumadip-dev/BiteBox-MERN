import React from 'react';

const UserOrderCard = ({ order }) => {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100 hover:shadow-md transition-all duration-200 ease-in-out">
      {/* Order Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-5">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900 text-lg leading-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-600 font-medium capitalize">{order.paymentMethod}</p>
          <p className="font-semibold text-blue-600 text-base tracking-wide capitalize">
            {order.shopOrders[0]?.status}
          </p>
        </div>
      </div>

      {/* Shop Orders */}
      {order.shopOrders.map((shopOrder, index) => (
        <div key={shopOrder._id || index} className="space-y-5">
          {/* Shop Header */}
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <p className="font-semibold text-gray-900 text-base tracking-wide">
              {shopOrder.shop.name}
            </p>
          </div>

          {/* Order Items Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {shopOrder.shopOrderItems?.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150 group"
              >
                <img
                  src={item.item?.image}
                  alt={item.item?.name}
                  className="w-full h-20 aspect-square object-cover rounded-md mb-2 group-hover:scale-105 transition-transform duration-200"
                />
                <p
                  className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2rem] leading-tight tracking-tight"
                  title={item.item?.name}
                >
                  {item.item?.name}
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* Shop Order Summary */}
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="font-semibold text-gray-900 text-base tracking-wide">
              Subtotal: ₹{shopOrder.subtotal}
            </p>
            <span className="text-sm font-medium text-blue-600 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 tracking-wide capitalize">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      {/* Order Footer */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-5">
        <div>
          <p className="font-bold text-gray-900 text-lg tracking-wide">
            Total: ₹{order.totalAmount}
          </p>
        </div>
        <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95">
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;

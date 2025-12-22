import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitRating } from '../api/orderApi';
import toast from 'react-hot-toast';

const UserOrderCard = ({ order }) => {
  const [selectedRating, setSelectedRating] = useState({});
  const [hoveredRating, setHoveredRating] = useState({});
  const navigate = useNavigate();

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const paymentStatus =
    order?.paymentMethod === 'cod'
      ? order?.shopOrders?.some(shopOrder => shopOrder?.status === 'delivered')
        ? 'PAID'
        : 'UNPAID'
      : 'PAID';

  const handleRating = async (itemId, rating) => {
    try {
      const response = await submitRating(itemId, rating);
      setSelectedRating(prev => ({ ...prev, [itemId]: rating }));
      console.log(response);
      toast.success('Rating submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit rating');
    }
  };

  const handleMouseEnter = (itemId, rating) => {
    setHoveredRating(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleMouseLeave = itemId => {
    setHoveredRating(prev => ({ ...prev, [itemId]: 0 }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200">
        <div className="space-y-1 mb-4 sm:mb-0">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            Order #{order._id.slice(-6).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className="text-sm text-gray-600 font-medium capitalize">{paymentStatus}</span>
          <span className="font-semibold text-blue-600 text-base capitalize">
            {order.shopOrders[0]?.status}
          </span>
        </div>
      </div>

      {order.shopOrders.map((shopOrder, index) => (
        <div key={shopOrder._id || index} className="space-y-5">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900 text-base truncate">
              {shopOrder.shop.name}
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {shopOrder.shopOrderItems?.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-150 group flex flex-col"
              >
                <div className="relative w-full pt-[100%] mb-3 overflow-hidden rounded-md">
                  <img
                    src={item.item?.image}
                    alt={item.item?.name}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="flex-grow">
                  <p
                    className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight"
                    title={item.item?.name}
                  >
                    {item.item?.name}
                  </p>
                  <p className="text-sm text-gray-600 font-medium mt-auto">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>

                {shopOrder.status === 'delivered' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isActive = selectedRating[item?.item?._id] >= star;
                        const isHovered = hoveredRating[item?.item?._id] >= star;
                        const shouldShowYellow = isActive || isHovered;

                        return (
                          <button
                            key={star}
                            className={`
                              relative text-2xl transition-all duration-300
                              ${
                                shouldShowYellow
                                  ? 'text-yellow-500 scale-110'
                                  : 'text-gray-300 hover:text-gray-400'
                              }
                              hover:scale-125 active:scale-95
                            `}
                            onClick={() => handleRating(item?.item?._id, star)}
                            onMouseEnter={() => handleMouseEnter(item?.item?._id, star)}
                            onMouseLeave={() => handleMouseLeave(item?.item?._id)}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <span className="relative z-10 block transition-all duration-300">
                              ★
                            </span>
                            {shouldShowYellow && (
                              <span className="absolute inset-0 text-yellow-300 blur-[2px] opacity-70">
                                ★
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <span className="inline-block text-sm font-medium text-blue-600 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 capitalize">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-200 gap-4">
        <div>
          <p className="font-bold text-gray-900 text-lg">Total: ₹{order.totalAmount}</p>
        </div>
        <button
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow hover:shadow-md active:scale-95 cursor-pointer"
          onClick={() => navigate(`/track-order/${order._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;

import { useState } from 'react';
import { FaDrumstickBite, FaLeaf, FaMinus, FaPlus, FaRegStar, FaStar } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(1);

  const renderStars = rating => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-500 text-sm drop-shadow-sm" key={i} />
        ) : (
          <FaRegStar className="text-yellow-500 text-sm opacity-70" key={i} />
        )
      );
    }
    return stars;
  };

  const handleQuantityIncrement = () => setQuantity(prevQuantity => prevQuantity + 1);
  const handleQuantityDecrement = () => {
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-orange-200 group">
      <div className="relative h-40 overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border backdrop-blur-sm ${
              data.foodType === 'veg'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {data.foodType === 'veg' ? (
              <FaLeaf size={12} className="text-emerald-600" />
            ) : (
              <FaDrumstickBite size={12} className="text-rose-600" />
            )}
            <span className="text-xs font-semibold capitalize">{data.foodType}</span>
          </div>
        </div>

        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
            {data.name}
          </h3>

          <div className="flex items-center gap-1">{renderStars(data.rating?.average || 0)}</div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">₹{data.price}</span>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-orange-200 rounded-lg overflow-hidden bg-orange-50">
                <button
                  className="px-3 py-2 hover:bg-orange-100 transition-colors text-gray-700"
                  onClick={handleQuantityDecrement}
                >
                  <FaMinus size={12} />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  className="px-3 py-2 hover:bg-orange-100 transition-colors text-gray-700"
                  onClick={handleQuantityIncrement}
                >
                  <FaPlus size={12} />
                </button>
              </div>

              <button className="bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white p-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95">
                <FaShoppingCart size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

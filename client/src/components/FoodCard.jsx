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
          <FaStar className="text-yellow-500 text-lg drop-shadow-sm" key={i} />
        ) : (
          <FaRegStar className="text-yellow-500 text-lg opacity-70" key={i} />
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
    <div className="w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-sm shadow-sm ${
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
            <span className="text-xs font-semibold capitalize tracking-wide">{data.foodType}</span>
          </div>
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 text-center flex flex-col gap-2">
        <span className="text-sm font-bold text-gray-900 tracking-tight truncate line-clamp-2 leading-tight">
          {data.name}
        </span>
        <div className="flex items-center justify-center gap-1">
          {renderStars(data.rating?.average || 0)}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3">
          <span>₹{data.price}</span>
          <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
            <button
              className="px-2 py-1 hover:bg-gray-100 transition"
              onClick={() => handleQuantityDecrement()}
            >
              <FaMinus size={12} />
            </button>
            <span>{quantity}</span>
            <button
              className="px-2 py-1 hover:bg-gray-100 transition"
              onClick={() => handleQuantityIncrement()}
            >
              <FaPlus size={12} />
            </button>
            <button className="bg-[#ff4d2d] text-white px-3 py-2 transition-colors">
              <FaShoppingCart size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

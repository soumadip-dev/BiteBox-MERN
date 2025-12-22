import { useParams } from 'react-router-dom';
import { getItemByRestaurant } from '../api/shopApi';
import { useEffect } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FaLocationDot, FaStore, FaUtensils } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import FoodCard from '../components/FoodCard';

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await getItemByRestaurant(restaurantId);
      console.log(response);

      if (response.message) {
        toast.success(response.message);
      }

      setRestaurantData(response.restaurant);
      setItems(response.items);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchShopDetails();
  }, []);

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-gray-200"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white min-h-screen">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-7xl mb-8">
            <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-300 rounded-2xl animate-pulse">
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full mb-4"></div>
                <div className="h-10 bg-gray-400 rounded w-64 mb-4"></div>
                <div className="h-6 bg-gray-400 rounded w-80"></div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl w-full mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="h-8 bg-gray-300 rounded w-48"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-800 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowRoundBack
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          {restaurantData && (
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
              <img
                src={restaurantData.image}
                alt={restaurantData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
                <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-10 md:pb-16">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                      <FaStore className="text-white text-3xl md:text-4xl" />
                    </div>
                    <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">
                      {restaurantData.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-3 rounded-xl w-fit">
                    <FaLocationDot className="text-red-400 text-lg" />
                    <p className="text-lg font-medium text-gray-200">
                      {restaurantData?.address}, {restaurantData?.city}, {restaurantData?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="flex items-center justify-center gap-4 mb-10 md:mb-16">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md">
                <FaUtensils className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Menu Items <span className="text-orange-600">({items.length})</span>
              </h2>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-3xl shadow-sm border border-orange-100">
                <div className="text-8xl mb-6">🍕</div>
                <p className="text-2xl font-medium text-gray-600 mb-2">No items available</p>
                <p className="text-gray-500">This restaurant hasn't added any menu items yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((item, index) => (
                  <div
                    key={item._id}
                    className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FoodCard data={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;

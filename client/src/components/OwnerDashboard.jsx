import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { FaPen, FaUtensils, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector(state => state.owner);

  return (
    <>
      <Navbar />
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6 min-h-[70vh]">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-sm">
                <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Start Your Restaurant Journey</h2>
                <p className="text-gray-600 leading-relaxed">
                  Join our platform and showcase your culinary creations to food lovers.
                </p>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
                onClick={() => navigate('/create-edit-shop')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-sm border border-orange-100">
              <FaUtensils className="text-[#ff4d2d] w-6 h-6" />
              <h1 className="text-2xl font-bold text-gray-900">Welcome to {myShopData.name}</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
            <div className="relative group">
              <div className="absolute top-4 right-4 z-20">
                <button
                  className="bg-white/95 backdrop-blur-sm text-[#ff4d2d] p-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-orange-200 cursor-pointer"
                  onClick={() => navigate('/create-edit-shop')}
                >
                  <FaPen size={14} />
                </button>
              </div>

              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    myShopData.image
                      ? myShopData.image
                      : 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png'
                  }
                  alt={`${myShopData.name} image`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{myShopData.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-[#ff4d2d] text-base">📍</span>
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-gray-900 font-medium text-sm">
                        {myShopData.city}, {myShopData.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-[#ff4d2d] text-base">🏠</span>
                    <div>
                      <p className="text-xs text-gray-600">Address</p>
                      <p className="text-gray-900 font-medium text-sm">{myShopData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu Items</h2>
          </div>

          {myShopData.items.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-xl p-6 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                  <FaUtensils className="text-[#ff4d2d] w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">Create Your Menu</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Add your signature dishes and start serving customers today.
                  </p>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  onClick={() => navigate('/add-food')}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Food Items
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myShopData &&
                myShopData.items.map(item => <OwnerItemCard key={item._id} data={item} />)}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OwnerDashboard;

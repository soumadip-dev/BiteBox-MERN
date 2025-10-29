import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden w-full transition-all duration-300 hover:shadow-md hover:border-orange-200">
      {/* Image Container */}
      <div className="w-28 h-28 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 relative m-4 rounded-xl overflow-hidden">
        <img
          src={
            data.image ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
          }
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Enhanced Food Type Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border backdrop-blur-sm ${
              data.foodType === 'veg'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                data.foodType === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></div>
            <span className="text-xs font-semibold capitalize">{data.foodType}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 items-center justify-between pr-6 py-6">
        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{data.name}</h3>
            <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 whitespace-nowrap flex-shrink-0">
              {data.category}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-gray-900">₹{data.price}</span>
            <span className="text-gray-400 text-sm line-through">₹{data.price + 50}</span>
          </div>
        </div>

        {/* Enhanced Actions */}
        <div className="flex gap-2 ml-6">
          <button
            className="p-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            onClick={() => navigate(`/edit-food/${data._id}`)}
          >
            <FaEdit size={16} />
          </button>
          <button className="p-3.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300 cursor-pointer">
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;

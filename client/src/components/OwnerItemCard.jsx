import { FaEdit, FaTrash, FaLeaf, FaDrumstickBite } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteFoodItem } from '../api/shopApi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);

    try {
      const result = await deleteFoodItem(data._id);
      toast.success('Item deleted successfully!');
      dispatch(setMyShopData(result.shop));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred while deleting the item');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex items-center bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden w-full transition-all duration-300 hover:shadow-md hover:border-orange-200">
        <div className="w-28 h-28 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 relative m-4 rounded-xl overflow-hidden">
          <img
            src={
              data.image ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
            }
            alt={data.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3">
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
        </div>

        <div className="flex flex-1 items-center justify-between pr-6 py-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{data.name}</h3>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700 shadow-sm">
                {data.category}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-gray-900">₹{data.price}</span>
              <span className="text-gray-400 text-sm line-through">₹{data.price + 50}</span>
            </div>
          </div>

          <div className="flex gap-2 ml-6">
            <button
              className="p-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => navigate(`/edit-food/${data._id}`)}
            >
              <FaEdit size={16} />
            </button>
            <button
              className={`p-3.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-gray-200 hover:border-gray-300 cursor-pointer ${
                isDeleting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-gray-100 hover:to-gray-200'
              } cursor-pointer`}
              onClick={openDeleteModal}
              disabled={isDeleting}
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeDeleteModal}
          />

          <div className="relative bg-white rounded-2xl border border-orange-100 shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-orange-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-xl border border-red-200">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Food Item</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-900">"{data.name}"</span>? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-orange-100">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md relative cursor-pointer"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  'Delete Item'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerItemCard;

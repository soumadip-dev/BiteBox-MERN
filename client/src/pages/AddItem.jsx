import { useState } from 'react';
import { FaUtensils } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { addFoodItem } from '../api/shopApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [price, setPrice] = useState('');
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { myShopData } = useSelector(state => state.owner);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('foodType', foodType);
    formData.append('price', price);
    if (backendImage) {
      formData.append('image', backendImage);
    }

    try {
      const result = await addFoodItem(formData);
      if (result.success) {
        dispatch(setMyShopData(result.shop));
        navigate('/');
        toast.success('Item added successfully!');
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Category options for dropdown
  const categoryOptions = [
    'Snacks',
    'Main Course',
    'Desserts',
    'Pizza',
    'Burgers',
    'Sandwiches',
    'South Indian',
    'North Indian',
    'Chinese',
    'Fast Food',
    'Others',
  ];

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        onClick={() => navigate(-1)}
        disabled={isSubmitting}
      >
        <IoIosArrowRoundBack
          size={32}
          className="text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200"
        />
      </button>

      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-6 border border-orange-100/50">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-2xl shadow-inner mb-4 border border-orange-200/30">
            <FaUtensils className="text-[#ff4d2d] w-14 h-14 drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Add New Item
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Add a new food item to your shop: {myShopData?.name}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Food Name
            </label>
            <input
              type="text"
              placeholder="Enter Item Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white pr-10"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800 tracking-wide">
                Food Type
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white pr-10"
                value={foodType}
                onChange={e => setFoodType(e.target.value)}
                required
              >
                <option value="veg">Vegetarian</option>
                <option value="non veg">Non-Vegetarian</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800 tracking-wide">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter Price"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Food Image
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff4d2d] hover:file:bg-orange-100 cursor-pointer"
              accept="image/*"
              onChange={handleImageChange}
            />
            {frontendImage && (
              <div className="mt-3">
                <img
                  src={frontendImage}
                  alt="Item Preview"
                  className="w-full h-40 object-cover rounded-xl border border-orange-100 shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Item...
              </>
            ) : (
              'Add Item'
            )}
          </button>
        </form>
      </div>

      {/* Custom dropdown arrow styling */}
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        select:focus {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ff4d2d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default AddItem;

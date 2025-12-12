import { useState } from 'react';
import { FaUtensils } from 'react-icons/fa6';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEditShop } from '../api/shopApi';
import { setMyShopData } from '../redux/ownerSlice';
import toast from 'react-hot-toast';

const CreateEditShop = () => {
  const navigate = useNavigate();
  const {
    city: userCity,
    state: userState,
    address: userAddress,
  } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);

  const [name, setName] = useState(myShopData?.name || '');
  const [city, setCity] = useState(myShopData?.city || userCity || '');
  const [state, setState] = useState(myShopData?.state || userState || '');
  const [address, setAddress] = useState(myShopData?.address || userAddress || '');
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

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
    formData.append('city', city);
    formData.append('state', state);
    formData.append('address', address);
    if (backendImage) {
      formData.append('image', backendImage);
    }

    try {
      const result = await createEditShop(formData);
      console.log(result);

      if (result.success) {
        dispatch(setMyShopData(result.shop));
        toast.success(result.message);

        // Navigate back to home page after successful submission
        navigate('/');
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error creating/editing shop:', error);
      toast.error('Failed to save shop details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        onClick={() => navigate('/')}
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
            {myShopData ? 'Edit Shop' : 'Add Shop'}
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Shop Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Shop Image
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
                  alt="Shop Preview"
                  className="w-full h-40 object-cover rounded-xl border border-orange-100 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800 tracking-wide">
                City
              </label>
              <input
                type="text"
                placeholder="Enter City"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-800 tracking-wide">
                State
              </label>
              <input
                type="text"
                placeholder="Enter State"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
                value={state}
                onChange={e => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-800 tracking-wide">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#ff4d2d] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 cursor-pointer active:scale-95 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
            } cursor-pointer`}
          >
            {isSubmitting ? 'Saving...' : 'Save Shop Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;

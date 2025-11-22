import { FaLocationDot, FaP, FaPlus } from 'react-icons/fa6';
import { TbReceipt2 } from 'react-icons/tb';
import { IoIosSearch } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { logoutUser } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function getProfileImage(fullName) {
  if (!fullName) return '';
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .map(t => t.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);
  if (tokens.length === 0) return '';
  if (tokens.length === 1) return tokens[0][0].toUpperCase();
  return (tokens[0][0] + tokens.at(-1)[0]).toUpperCase();
}

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, city, cartItems } = useSelector(state => state.user);
  const { myShopData } = useSelector(state => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logoutUser();
      toast.success(response.message);
      window.location.reload();
      dispatch(setUserData(null));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show location for user, AND owner roles
  const shouldShowLocation = userData?.role === 'user' || userData?.role === 'owner';
  // Show search only for users
  const shouldShowSearch = userData?.role === 'user';

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="w-full h-16 md:h-20 flex items-center justify-between md:justify-center gap-4 md:gap-8 px-4 md:px-6 fixed top-0 z-[9999] bg-[#fff9f6] backdrop-blur-sm border-b border-gray-100">
        {showSearch && (
          <div className="w-[calc(100%-2rem)] h-16 md:h-[70px] bg-white shadow-2xl rounded-xl items-center gap-4 md:gap-6 flex fixed top-16 md:top-20 left-4 md:left-[5%] z-[10000] px-4 md:px-5 border border-gray-100">
            {shouldShowLocation && (
              <div className="flex items-center w-[30%] overflow-hidden gap-2 md:gap-3 pr-2 md:pr-3 border-r-2 border-gray-200">
                <FaLocationDot size={20} className="md:size-6 text-[#ff4d2d] flex-shrink-0" />
                <div className="w-[80%] truncate text-gray-700 text-xs md:text-sm font-medium">
                  {city || 'India'}
                </div>
              </div>
            )}
            {shouldShowSearch && (
              <div className="w-[70%] flex items-center gap-2 md:gap-3">
                <IoIosSearch size={20} className="md:size-6 text-[#ff4d2d] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search delicious food"
                  className="px-2 md:px-3 text-gray-800 outline-0 w-full bg-transparent placeholder-gray-500 font-medium text-sm md:text-base"
                />
              </div>
            )}
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-black text-[#ff4d2d] tracking-tight min-w-[100px]">
          BiteBox
        </h1>

        {/* Main search and location bar - hidden on mobile */}
        {shouldShowLocation && (
          <div
            className={`${
              shouldShowSearch ? 'md:w-[60%] lg:w-[40%]' : 'md:w-[40%] lg:w-[30%]'
            } h-[70px] rounded-xl items-center gap-6 hidden md:flex px-5`}
          >
            <div className="flex items-center w-full overflow-hidden gap-3 pr-3 border-r-2 border-gray-200">
              <FaLocationDot size={26} className="text-[#ff4d2d] flex-shrink-0" />
              <div className="w-[80%] truncate text-gray-700 text-sm font-medium">
                {city || 'India'}
              </div>
            </div>
            {shouldShowSearch && (
              <div className="w-[70%] flex items-center gap-3">
                <IoIosSearch size={26} className="text-[#ff4d2d] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search delicious food"
                  className="px-3 text-gray-800 outline-0 w-full bg-transparent placeholder-gray-500 font-medium"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 lg:gap-5 flex-shrink-0">
          {/* Mobile search toggle */}
          {showSearch && shouldShowSearch ? (
            <RxCross2
              onClick={() => setShowSearch(false)}
              size={20}
              className="md:size-6 text-[#ff4d2d] md:hidden cursor-pointer flex-shrink-0 hover:scale-110 transition-transform"
            />
          ) : (
            shouldShowSearch && (
              <IoIosSearch
                size={20}
                className="md:size-6 text-[#ff4d2d] md:hidden cursor-pointer flex-shrink-0 hover:scale-110 transition-transform"
                onClick={() => setShowSearch(true)}
              />
            )
          )}

          {userData?.role === 'owner' ? (
            <>
              {myShopData && (
                <>
                  <button
                    className="hidden md:flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 cursor-pointer rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                    onClick={() => navigate('/add-food')}
                  >
                    <FaPlus size={18} className="lg:size-5 flex-shrink-0" />
                    <span className="text-sm font-semibold">Add Food Item</span>
                  </button>
                  <button
                    className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => navigate('/add-food')}
                  >
                    <FaPlus size={18} className="flex-shrink-0" />
                  </button>
                </>
              )}

              <button className="hidden md:flex items-center gap-2 lg:gap-3 cursor-pointer relative px-3 lg:px-4 py-2 lg:py-3 rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:bg-[#ff4d2d]/20 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                <TbReceipt2 size={20} className="lg:size-5 flex-shrink-0" />
                <span className="text-sm lg:text-base">My Orders</span>
                <span className="absolute -right-2 -top-2 text-xs font-black text-white bg-[#ff4d2d] rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center shadow-lg">
                  0
                </span>
              </button>
              <div className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer relative rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] font-semibold hover:bg-[#ff4d2d]/20 transition-all duration-300 shadow-lg hover:shadow-xl">
                <TbReceipt2 size={18} className="flex-shrink-0" />
                <span className="absolute -right-1 -top-1 text-xs font-black text-white bg-[#ff4d2d] rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                  0
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                className="relative cursor-pointer p-2 hover:scale-110 transition-transform flex-shrink-0"
                onClick={() => navigate('/cart')}
              >
                <FiShoppingCart size={20} className="md:size-6 text-[#ff4d2d]" />
                <span className="absolute -right-1 -top-1 text-[#ff4d2d] text-xs font-black bg-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-[#ff4d2d]/20 shadow-sm">
                  {cartItems.length}
                </span>
              </div>

              <button className="hidden md:block px-3 lg:px-4 py-2 lg:py-3 rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-semibold cursor-pointer hover:bg-[#ff4d2d]/20 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                My orders
              </button>
            </>
          )}

          <div className="relative flex-shrink-0">
            <button
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-xs md:text-sm font-black cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 flex-shrink-0 hover:scale-105 min-w-[32px] md:min-w-[40px]"
              onClick={() => setShowInfo(!showInfo)}
            >
              {getProfileImage(userData?.fullName)}
            </button>

            {showInfo && (
              <div className="absolute top-full right-0 mt-2 w-48 md:w-52 bg-white shadow-2xl rounded-2xl p-4 md:p-5 flex flex-col gap-3 md:gap-4 z-[10000] border border-gray-100 backdrop-blur-sm">
                <div className="text-sm md:text-base font-bold truncate text-gray-900">
                  {userData?.fullName}
                </div>
                <div className="text-xs md:text-sm text-gray-600 truncate capitalize">
                  {userData?.role}
                </div>
                {userData?.role === 'user' && (
                  <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer hover:text-[#ff4d2d]/80 transition-colors duration-200 text-sm">
                    My orders
                  </div>
                )}
                <div
                  className={`text-[#ff4d2d] font-semibold text-sm md:text-base ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:text-[#ff4d2d]/80 transition-colors duration-200'
                  }`}
                  onClick={() => !isLoading && handleLogout()}
                >
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;

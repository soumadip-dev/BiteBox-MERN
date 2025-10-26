import { FaLocationDot } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { logoutUser } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function getProfileImage(fullName) {
  if (!fullName) return '';
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .map(t => t.replace(/[^A-Za-z]/g, '')) // remove punctuation
    .filter(Boolean);
  if (tokens.length === 0) return '';
  if (tokens.length === 1) return tokens[0][0].toUpperCase();
  return (tokens[0][0] + tokens.at(-1)[0]).toUpperCase();
}
const Navbar = () => {
  const { userData, city } = useSelector(state => state.user);
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

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999]bg-[#fff9f6] overflow-visible">
      {showSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%]">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">BiteBox</h1>
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">{city}</div>
        </div>
        <div className="w-[80%] flex items-center gap-[10px]">
          <IoIosSearch size={25} className="text-[#ff4d2d]" />
          <input
            type="text"
            placeholder="Search delicious food"
            className="px-[10px] text-gray-700 outline-0 w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {showSearch ? (
          <RxCross2
            onClick={() => setShowSearch(false)}
            size={25}
            className="text-[#ff4d2d] md:hidden"
          />
        ) : (
          <IoIosSearch
            size={25}
            className="text-[#ff4d2d] md:hidden"
            onClick={() => setShowSearch(true)}
          />
        )}
        <div className="relative cursor-pointer">
          <FiShoppingCart size={25} className="text-[#ff4d2d]" />
          <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">0</span>
        </div>
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer">
          My orders
        </button>
        <div
          className="w-[35px] h-[35px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        >
          {getProfileImage(userData?.fullName)}
        </div>
        {showInfo && (
          <div className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z[9999]">
            <div className="text-[17px] font-semibold">{userData?.fullName}</div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">My orders</div>
            <div
              className={`text-[#ff4d2d] font-semibold ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => !isLoading && handleLogout()}
            >
              {isLoading ? 'Logging out...' : 'Log Out'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;

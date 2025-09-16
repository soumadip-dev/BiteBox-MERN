import { FaLocationDot } from 'react-icons/fa6';
import { IoIosSearch } from 'react-icons/io';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';

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
  const { userData } = useSelector(state => state.user);
  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999]bg-[#fff9f6] overflow-visible">
      <h1 className="text-3x1 font-bold mb-2 text-[#ff4d2d]">BiteBox</h1>
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot size={25} className="text-[#ff4d2d]" />
          <div className="w-[80%] truncate text-gray-600">Durgapur</div>
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
      <div className="relative cursor-pointer">
        <FiShoppingCart size={25} className="text-[#ff4d2d]" />
        <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">0</span>
      </div>
      <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer">
        My orders
      </button>
      <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer">
        {getProfileImage(userData?.fullName)}
      </div>
    </div>
  );
};

export default Navbar;

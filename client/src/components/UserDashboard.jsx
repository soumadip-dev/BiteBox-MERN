import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import Navbar from './Navbar';
import { useEffect, useRef, useState } from 'react';

const UserDashboard = () => {
  const categoriScrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollButtons = () => {
    if (categoriScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriScrollRef.current;

      // Show left button only if scrolled from start
      setShowLeftButton(scrollLeft > 0);

      // Show right button only if there's more content to scroll
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px tolerance
    }
  };

  useEffect(() => {
    const scrollContainer = categoriScrollRef.current;
    if (scrollContainer) {
      // Initial check
      checkScrollButtons();

      // Add scroll event listener
      scrollContainer.addEventListener('scroll', checkScrollButtons);

      // Check on resize as well
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 py-5 sm:px-6 sm:py-6 mx-auto">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
          Inspiration for your first order
        </h1>

        <div className="w-full relative group">
          {showLeftButton && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-105"
              onClick={() => scrollHandler(categoriScrollRef, 'left')}
              aria-label="Scroll left"
            >
              <FaCircleChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-5 pb-4 scrollbar-thin scrollbar-thumb-[#ff4d2d] scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth"
            ref={categoriScrollRef}
            onScroll={checkScrollButtons}
          >
            {categories.map((category, index) => (
              <CategoryCard data={category} key={index} />
            ))}
          </div>

          {showRightButton && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-105"
              onClick={() => scrollHandler(categoriScrollRef, 'right')}
              aria-label="Scroll right"
            >
              <FaCircleChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

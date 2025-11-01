import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import Navbar from './Navbar';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const { city, shopsInMyCity } = useSelector(state => state.user);
  const categoriScrollRef = useRef(null);
  const shopsScrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [showShopsLeftButton, setShowShopsLeftButton] = useState(false);
  const [showShopsRightButton, setShowShopsRightButton] = useState(false);

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollButtons = (scrollRef, setLeftButton, setRightButton) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Show left button only if scrolled from start
      setLeftButton(scrollLeft > 0);

      // Show right button only if there's more content to scroll
      setRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px tolerance
    }
  };

  const checkCategoryScrollButtons = () => {
    checkScrollButtons(categoriScrollRef, setShowLeftButton, setShowRightButton);
  };

  const checkShopsScrollButtons = () => {
    checkScrollButtons(shopsScrollRef, setShowShopsLeftButton, setShowShopsRightButton);
  };

  useEffect(() => {
    const categoryScrollContainer = categoriScrollRef.current;
    const shopsScrollContainer = shopsScrollRef.current;

    if (categoryScrollContainer) {
      checkCategoryScrollButtons();
      categoryScrollContainer.addEventListener('scroll', checkCategoryScrollButtons);
      window.addEventListener('resize', checkCategoryScrollButtons);
    }

    if (shopsScrollContainer) {
      checkShopsScrollButtons();
      shopsScrollContainer.addEventListener('scroll', checkShopsScrollButtons);
      window.addEventListener('resize', checkShopsScrollButtons);
    }

    return () => {
      if (categoryScrollContainer) {
        categoryScrollContainer.removeEventListener('scroll', checkCategoryScrollButtons);
      }
      if (shopsScrollContainer) {
        shopsScrollContainer.removeEventListener('scroll', checkShopsScrollButtons);
      }
      window.removeEventListener('resize', checkCategoryScrollButtons);
      window.removeEventListener('resize', checkShopsScrollButtons);
    };
  }, [shopsInMyCity]); // Re-run when shops data changes

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
            onScroll={checkCategoryScrollButtons}
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

      {/* Shops in City Section */}
      <div className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 py-5 sm:px-6 sm:py-6 mx-auto">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
          Popular Restaurants in {city || 'Your City'}
        </h1>

        {shopsInMyCity && shopsInMyCity.length > 0 ? (
          <div className="w-full relative group">
            {showShopsLeftButton && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-105"
                onClick={() => scrollHandler(shopsScrollRef, 'left')}
                aria-label="Scroll shops left"
              >
                <FaCircleChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div
              className="w-full flex overflow-x-auto gap-5 pb-4 scrollbar-thin scrollbar-thumb-[#ff4d2d] scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth"
              ref={shopsScrollRef}
              onScroll={checkShopsScrollButtons}
            >
              {shopsInMyCity.map((shop, index) => (
                <CategoryCard
                  data={{
                    image: shop.image || '/default-shop-image.jpg', // Fallback image
                    category: shop.name || 'Restaurant',
                  }}
                  key={index}
                />
              ))}
            </div>

            {showShopsRightButton && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-105"
                onClick={() => scrollHandler(shopsScrollRef, 'right')}
                aria-label="Scroll shops right"
              >
                <FaCircleChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2 text-center">
              No restaurants available
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              We're working on bringing the best restaurants to {city || 'your city'}. Check back
              soon for new options!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;

import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import Navbar from './Navbar';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { city, shopsInMyCity, ItemsInMyCity, searchItems } = useSelector(state => state.user);
  const categoriScrollRef = useRef(null);
  const shopsScrollRef = useRef(null);
  const navigate = useNavigate();

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [showShopsLeftButton, setShowShopsLeftButton] = useState(false);
  const [showShopsRightButton, setShowShopsRightButton] = useState(false);
  const [updatedItemList, setUpdatedItemList] = useState(ItemsInMyCity);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      setLeftButton(scrollLeft > 0);
      setRightButton(scrollLeft < scrollWidth - clientWidth - 10);
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
  }, [shopsInMyCity]);

  // Initialize with all items
  useEffect(() => {
    if (ItemsInMyCity) {
      setUpdatedItemList(ItemsInMyCity);
    }
  }, [ItemsInMyCity]);

  const handleFilterByCategory = category => {
    setSelectedCategory(category);
    if (category === 'All') {
      setUpdatedItemList(ItemsInMyCity);
    } else {
      const filteredItems = ItemsInMyCity.filter(item => item.category === category);
      setUpdatedItemList(filteredItems);
    }
  };

  return (
    <>
      <Navbar />
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 items-start p-5 sm:p-6 bg-white shadow-lg rounded-2xl mt-4 border border-orange-100">
          <div className="inline-flex items-center gap-3 rounded-xl px-6 py-3 shadow-sm">
            <span className="text-[#ff4d2d] text-xl">🔍</span>
            <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold">Search Results</h1>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {searchItems.map(item => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        </div>
      )}
      {/* Categories Section */}
      <div className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 py-8 sm:px-6 sm:py-10 mx-auto">
        <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-sm border border-orange-100">
          <span className="text-[#ff4d2d] text-xl">🍽️</span>
          <h1 className="text-gray-900 text-2xl font-bold">Inspiration for your first order</h1>
        </div>

        <div className="w-full relative group">
          {showLeftButton && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-orange-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              onClick={() => scrollHandler(categoriScrollRef, 'left')}
              aria-label="Scroll left"
            >
              <FaCircleChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-6 pb-5 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth"
            ref={categoriScrollRef}
            onScroll={checkCategoryScrollButtons}
          >
            {/* Add "All" category card */}
            <CategoryCard
              data={{
                image:
                  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                category: 'All',
              }}
              isSelected={selectedCategory === 'All'}
              onClick={() => handleFilterByCategory('All')}
            />

            {/* Map through categories */}
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                data={category}
                isSelected={selectedCategory === category.category}
                onClick={() => handleFilterByCategory(category.category)}
              />
            ))}
          </div>

          {showRightButton && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-orange-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              onClick={() => scrollHandler(categoriScrollRef, 'right')}
              aria-label="Scroll right"
            >
              <FaCircleChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Shops in City Section */}
      <div className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 py-8 sm:px-6 sm:py-10 mx-auto">
        <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-sm border border-orange-100">
          <span className="text-[#ff4d2d] text-xl">🏪</span>
          <h1 className="text-gray-900 text-2xl font-bold">
            Popular Restaurants in {city || 'Your City'}
          </h1>
        </div>

        {shopsInMyCity && shopsInMyCity.length > 0 ? (
          <div className="w-full relative group">
            {showShopsLeftButton && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-orange-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                onClick={() => scrollHandler(shopsScrollRef, 'left')}
                aria-label="Scroll shops left"
              >
                <FaCircleChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div
              className="w-full flex overflow-x-auto gap-6 pb-5 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scroll-smooth"
              ref={shopsScrollRef}
              onScroll={checkShopsScrollButtons}
            >
              {shopsInMyCity.map((shop, index) => (
                <CategoryCard
                  data={{
                    image:
                      shop.image ||
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    category: shop.name || 'Restaurant',
                  }}
                  key={index}
                  onClick={() => navigate(`/restaurant/${shop._id}`)}
                />
              ))}
            </div>

            {showShopsRightButton && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm text-[#ff4d2d] p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-orange-200 z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                onClick={() => scrollHandler(shopsScrollRef, 'right')}
                aria-label="Scroll shops right"
              >
                <FaCircleChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-sm">
                <span className="text-[#ff4d2d] text-3xl">🏪</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">No restaurants available</h2>
                <p className="text-gray-600 leading-relaxed">
                  We're working on bringing the best restaurants to {city || 'your city'}. Check
                  back soon for delicious options!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Food Items */}
      <div className="w-full max-w-6xl flex flex-col gap-6 items-start px-4 py-8 sm:px-6 sm:py-10 mx-auto">
        <div className="inline-flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-sm border border-orange-100">
          <span className="text-[#ff4d2d] text-xl">🍕</span>
          <h1 className="text-gray-900 text-2xl font-bold">
            {selectedCategory === 'All' ? 'Suggested Food Items' : `${selectedCategory} Items`}
          </h1>
        </div>

        {updatedItemList && updatedItemList.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {updatedItemList.map((item, index) => (
              <FoodCard data={item} key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-sm">
                <span className="text-[#ff4d2d] text-3xl">🍕</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  No {selectedCategory === 'All' ? 'food items' : selectedCategory.toLowerCase()}{' '}
                  available
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCategory === 'All'
                    ? 'No food items available in your city. Check back soon!'
                    : `No ${selectedCategory.toLowerCase()} items available in your city. Try selecting another category.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;

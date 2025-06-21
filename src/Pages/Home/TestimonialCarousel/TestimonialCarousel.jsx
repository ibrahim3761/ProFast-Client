import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';
import customerImage from '../../../assets/customer-top.png'

  const reviews = [
  {
    name: "Rasel Ahamed",
    position: "CTO",
    quote: "This product improved my work-life posture dramatically. The design is both sleek and effective. I highly recommend it to anyone looking for better posture support.",
    avatar: "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
  },
  {
    name: "Awlad Hossin",
    position: "Senior Product Designer",
    quote: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    avatar: "https://img.daisyui.com/images/profile/demo/batperson@192.webp"
  },
  {
    name: "Nasir Uddin",
    position: "CEO",
    quote: "Incredible quality and comfort. I can sit longer and feel less tired now thanks to this product. The improvement in my daily work routine is remarkable.",
    avatar: "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
  },
  {
    name: "Sarah Johnson",
    position: "UX Designer",
    quote: "Amazing product that has transformed my workspace experience. The ergonomic design is both functional and aesthetically pleasing.",
    avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  },
  {
    name: "Mike Chen",
    position: "Software Engineer",
    quote: "Best investment I've made for my health. The posture improvement is noticeable within days of using this product consistently.",
    avatar: "https://img.daisyui.com/images/profile/demo/superperson@192.webp"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle card active (index 2 of 5 cards)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex - 2 + i + reviews.length) % reviews.length;
      cards.push({
        ...reviews[index],
        originalIndex: index,
        position: i // 0: far left, 1: left, 2: center, 3: right, 4: far right
      });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="py-16 px-4 bg-gray-100">
      {/* Header Section */}
      <div className="text-center mb-12">
        {/* Customer Image Icon */}
        <div className="flex justify-center mb-6">
          <div>
            <img 
              src={customerImage} 
              alt="Customer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          What our customers are saying
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-center space-x-4 px-16">
          {visibleCards.map((card, index) => {
            const position = card.position;
            const isCenter = position === 2;
            const isAdjacent = position === 1 || position === 3;
            const isFarSide = position === 0 || position === 4;
            
            return (
              <div
                key={`${card.originalIndex}-${index}`}
                className={`transition-all duration-700 ease-in-out transform ${
                  isCenter 
                    ? 'scale-100 opacity-100 z-20' 
                    : isAdjacent
                    ? 'scale-90 opacity-50 z-10'
                    : 'scale-75 opacity-20 z-0'
                } ${isFarSide ? 'hidden md:block' : ''}`}
                style={{
                  transform: `scale(${
                    isCenter ? '1' : 
                    isAdjacent ? '0.9' : '0.75'
                  }) translateY(${isCenter ? '0' : '10px'})`,
                }}
              >
                <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-700 ${
                  isCenter ? 'min-h-[320px] w-80 shadow-xl' : 'min-h-[280px] w-72 shadow-md'
                } flex flex-col hover:shadow-xl`}>
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <FaQuoteRight  className={`${
                      isCenter ? 'text-2xl' : 'text-xl'
                    } text-[#CAEB66] opacity-30`} />
                  </div>
                  
                  {/* Quote Text */}
                  <p className={`text-gray-700 ${
                    isCenter ? 'text-sm' : 'text-xs'
                  } leading-relaxed mb-6 flex-grow`}>
                    {card.quote}
                  </p>
                  
                  {/* Dotted Line - only show on center card */}
                  {isCenter && (
                    <div className="border-t border-dashed border-black mb-4"></div>
                  )}
                  
                  {/* Author Info */}
                  <div className="flex items-center">
                    <div className={`${
                      isCenter ? 'w-12 h-12' : 'w-10 h-10'
                    } rounded-full overflow-hidden mr-3 flex-shrink-0`}>
                      <img 
                        src={card.avatar} 
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className={`${
                        isCenter ? 'font-bold text-gray-800' : 'font-semibold text-gray-700 text-sm'
                      }`}>
                        {card.name}
                      </div>
                      <div className={`text-gray-500 ${
                        isCenter ? 'text-sm' : 'text-xs'
                      }`}>
                        {card.position}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        {/* Previous Button */}
        <button 
          onClick={prevSlide}
          className="w-10 h-10 hover:bg-[#CAEB66] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <FaChevronLeft className="text-gray-600 hover:text-black" />
        </button>

        {/* Pagination Dots */}
        <div className="flex space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-[#CAEB66] w-6' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={nextSlide}
          className="w-10 h-10 hover:bg-[#CAEB66] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <FaChevronRight className="text-gray-600 hover:text-black" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
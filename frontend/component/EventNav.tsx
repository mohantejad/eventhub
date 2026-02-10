'use client';

// EventNav displays a horizontal scrollable navigation bar for event categories

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// List of event categories with icons
const categories = [
  { id: 1, name: 'Music', icon: '\uD83C\uDFB5' },
  { id: 2, name: 'Nightlife', icon: '🌟' },
  { id: 3, name: 'Performing & Visual Arts', icon: '👨\u200D🎨' },
  { id: 4, name: 'Holidays', icon: '🌟' },
  { id: 5, name: 'Dating', icon: '❤️' },
  { id: 6, name: 'Hobbies', icon: '🎮' },
  { id: 7, name: 'Business', icon: '📄' },
  { id: 8, name: 'Food & Drink', icon: '🍽️' },
];

const EventsNav = () => {
  const router = useRouter();
  // Ref for the scrollable container
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Optionally check if the container is scrollable (for future enhancements)
    const checkScrollable = () => {
      if (containerRef.current) {
        // You can add logic here if you want to show scroll indicators, etc.
      }
    };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  // Handle click on a category to navigate to filtered events page
  const handleCategoryClick = (category: string) => {
    router.push(`/all-events?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className='relative w-full py-6 px-8 flex items-center justify-center'>
      {/* Scrollable categories container */}
      <motion.div
        ref={containerRef}
        className='flex space-x-8 overflow-x-auto scrollbar-hide p-2 scrollbar-thin scrollbar-thumb-[#81a7e3] scrollbar-track-gray-200'
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Render each category as a clickable card */}
        {categories.map((category) => (
          <div
            key={category.id}
            className='min-w-[150px] flex flex-col items-center border border-[#81a7e3] bg-[#81a7e3]/10 rounded-lg p-4 transition-transform hover:scale-105 cursor-pointer'
            onClick={() => handleCategoryClick(category.name)}
          >
            <span className='text-2xl'>{category.icon}</span>
            <span className='text-sm font-medium mt-2 text-center break-words'>
              {category.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default EventsNav;

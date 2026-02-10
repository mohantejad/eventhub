'use client';

// Carousel component displays a swipeable image slider with navigation and autoplay

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { motion } from 'framer-motion';

const Carousel = () => {
  // Array of slides for the carousel
  const slides = [
    {
      id: 1,
      image: '/slide1.webp',
      title: "BEATS YOU'LL DROP FOR",
    },
    {
      id: 2,
      image: '/slide2.webp',
      title: 'EXPERIENCE THE VIBES',
    },
    {
      id: 3,
      image: '/slide3.webp',
      title: 'LIVE SHOWS & FESTIVALS',
    },
  ];

  return (
    <div className='relative w-full mt-6 flex items-center justify-center'>
      {/* Previous arrow button */}
      <div className='swiper-button image-swiper-button-prev text-[#004aad] cursor-pointer border border-transparent hover:border-[#004aad] hover:bg-[#004aad] rounded-full bg-opacity-0 transition-border duration-300 hover:text-white mx-2'>
        <IoIosArrowBack size={36} />
      </div>
      {/* Swiper carousel with navigation, pagination, and autoplay */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: '.image-swiper-button-next',
          prevEl: '.image-swiper-button-prev',
          disabledClass: 'swiper-button-disabled',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className='w-full h-[400px] rounded-xl overflow-hidden text-white'
      >
        {/* Render each slide */}
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className='relative'>
            <Image
              src={slide.image}
              alt={slide.title}
              layout='fill'
              objectFit='fit'
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Next arrow button with animation */}
      <motion.div className='swiper-button image-swiper-button-next text-[#004aad] cursor-pointer border border-transparent hover:border-[#004aad] hover:bg-[#004aad] rounded-full bg-opacity-0 transition-border duration-300 hover:text-white mx-2'>
        <IoIosArrowForward size={36} />
      </motion.div>
    </div>
  );
};

export default Carousel;

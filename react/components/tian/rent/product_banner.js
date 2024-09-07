import React, { useState } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

export default function Product_banner() {
  return (
    <>
      <article className="ad-tian swiper-container">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={1000}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src="/tian/test/banner_01.png" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <img src="/tian/test/banner_02.png" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <img src="/tian/test/banner_03.png" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <img src="/tian/test/banner_04.png" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <img src="/tian/test/banner_05.png" alt="" />
          </SwiperSlide>
        </Swiper>
      </article>
    </>
  )
}

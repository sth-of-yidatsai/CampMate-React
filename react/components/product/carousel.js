import { useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

// 範例出處
// https://swiperjs.com/demos#thumbs-gallery
// https://codesandbox.io/s/k3cyyc
export default function Carousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        <SwiperSlide>
          <img src="/images/product/slide/t1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t5.jpg" />
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="/images/product/slide/t1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/product/slide/t5.jpg" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

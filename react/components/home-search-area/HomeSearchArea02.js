import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './home-search-area.module.css'
import HomeInputBar3 from '@/components/home-search-area/home-inputbar/homeInputBar3'
import HomeImg04 from '@/public/home-img/home-img-04.jpg'
import HomeImg05 from '@/public/home-img/home-img-05.jpg'
import HomeImg06 from '@/public/home-img/home-img-06.jpg'
// 測試
import Search_Bar from '@/components/tian/rent/search_bar'

export default function HomeSearchArea02({ isTransitioning }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [exitingImageIndex, setExitingImageIndex] = useState(null)
  const images = [HomeImg04, HomeImg05, HomeImg06]

  useEffect(() => {
    if (isTransitioning) return

    const interval = setInterval(() => {
      setExitingImageIndex(currentImageIndex)
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5500)

    return () => clearInterval(interval)
  }, [currentImageIndex, images.length, isTransitioning])

  return (
    <>
      {/* <Search_Bar /> */}
      <HomeInputBar3 />
      <div className={styles.carousel}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.image} ${
              index === currentImageIndex ||
              (isTransitioning && index === exitingImageIndex)
                ? styles.visible
                : ''
            } ${
              index === exitingImageIndex && !isTransitioning
                ? styles.exiting
                : ''
            }`}
          >
            <Image src={image} alt="" layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>
    </>
  )
}

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './home-search-area.module.css'
import HomeInputBar1 from '@/components/home-search-area/home-inputbar/homeInputBar1'
import HomeImg01 from '@/public/home-img/home-img-01.jpg'
import HomeImg02 from '@/public/home-img/home-img-02.jpg'
import HomeImg03 from '@/public/home-img/home-img-03.jpg'

export default function HomeSearchArea01({ isTransitioning }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [exitingImageIndex, setExitingImageIndex] = useState(null)
  const images = [HomeImg01, HomeImg02, HomeImg03]

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
      <HomeInputBar1 />
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

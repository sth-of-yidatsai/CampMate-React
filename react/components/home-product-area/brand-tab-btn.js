import React from 'react'
import Image from 'next/image'
import styles from './brand-tab-btn.module.css'

export default function BrandTabBtn({ logo, isActive, onClick }) {
  return (
    <>
      <button
        className={`${styles.btn} ${isActive ? styles.active : ''}`}
        onClick={onClick}
      >
        <Image
          src={logo}
          alt="Brand Logo"
          layout="fill"
          objectFit="cover"
          className={`${isActive ? styles.whiteFilter : ''} ${
            styles.objectFitCover
          }`}
        />
      </button>
    </>
  )
}

import React from 'react'
import Image from 'next/image'
import styles from './scrollbar-btn.module.css'
import ScrollbarCircleOutline from '@/public/home-icons/scrollbarCircleOutline.svg'

export default function ScrollbarBtn() {
  return (
    <>
      <button className={styles.scorollbarBtn}>
        <div className={styles.dot}></div>
        <Image
          className={styles.outline}
          src={ScrollbarCircleOutline}
          width={20}
          height={24}
          alt=""
        />
      </button>
    </>
  )
}

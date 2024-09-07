import React, { useState } from 'react'
import styles from './home-tabbar.module.css'

export default function HomeTabbar({ onTabChange }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleOptionClick = (index) => {
    setSelectedIndex(index)
    onTabChange(index)  // 通知父組件選擇的 Tab 改變
  }

  return (
    <div className={styles.homeTabbar}>
      <div
        className={`${styles.option} ${
          selectedIndex === 0 ? styles.active : ''
        }`}
        onClick={() => handleOptionClick(0)}
      >
        找營地 Ground
      </div>
      <div
        className={`${styles.option} ${
          selectedIndex === 1 ? styles.active : ''
        }`}
        onClick={() => handleOptionClick(1)}
      >
        找用品 Rent
      </div>
      <div
        className={styles.optionBg}
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import styles from './ground-card.module.scss'
import Image from 'next/image'

export default function GroundCard({ onSelect, selected }) {
  // 取資料
  const [grounds, setGrounds] = useState([])

  const getGrounds = async () => {
    try {
      const baseURL = 'http://localhost:3005/api/campground'
      const res = await fetch(baseURL)
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      const { data } = await res.json()

      setGrounds(data.campgrounds)
    } catch (error) {
      console.error('Failed to fetch grounds:', error)
    }
  }
  useEffect(() => {
    getGrounds()
  }, [])

  const handleSelect = (groundInfo) => {
    if (selected && selected.ground_name === groundInfo.ground_name) {
      onSelect(null) // 如果已選中，則取消選中
    } else {
      onSelect(groundInfo) // 否則選中
    }
  }

  return grounds.map((ground, index) => {
    const groundOrderInfo = {
      ground_name: ground.campground_name,
      start_date: '2024/10/13', // 這裡的日期應根據實際需求設置
      end_date: '2024/10/16',
      max_member: 6, // 這裡的人數應根據實際需求設置
      ground_city: ground.city,
      address: ground.address,
      ground_altitude: ground.altitude,
      ground_geolocation: ground.geolocation,
      ground_phone: ground.phone,
    }

    const isSelected = selected?.ground_name === groundOrderInfo.ground_name

    return (
      <div
        key={index}
        className={`${styles.cardGround} ${styles.globe} ${
          isSelected ? styles.selected : ''
        }`}
        onClick={() => handleSelect(groundOrderInfo)}
      >
        <label className={styles.cardLabel}>
          <Image
            className={styles.cardImage}
            src="/group-camping/group_camping_01.jpg"
            alt={`Group Camping - ${groundOrderInfo.ground_name}`}
            width={200}
            height={0}
            layout="intrinsic"
            objectFit="cover"
          />
          <div className={styles.cardContent}>
            <p className={styles.h6Tc}>{groundOrderInfo.ground_name}</p>
            <p className={styles.p1En}>
              {groundOrderInfo.start_date} - {groundOrderInfo.end_date}
            </p>
            <p className={styles.p2Tc}>
              <span className={styles.h6En}>{groundOrderInfo.max_member}</span>{' '}
              人帳
            </p>
          </div>
          <span
            className={`${styles.customCheckbox} ${
              isSelected ? styles.checkedCheckbox : ''
            }`}
          >
            {isSelected ? '✔' : ''}
          </span>
        </label>
      </div>
    )
  })
}

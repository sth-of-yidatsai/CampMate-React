import React from 'react'
import styles from './coupon-filter-button.module.css'

const CouponFilterButton = ({ currentFilter, onFilterChange }) => {
  return (
    <div className={styles.couponFilter}>
      <button
        className={currentFilter === '所有' ? styles.active : ''}
        onClick={() => onFilterChange('所有')}
      >
        所有優惠券
      </button>
      <button
        className={currentFilter === '全站' ? styles.active : ''}
        onClick={() => onFilterChange('全站')}
      >
        全站優惠券
      </button>
      <button
        className={currentFilter === '露營區' ? styles.active : ''}
        onClick={() => onFilterChange('露營區')}
      >
        露營區優惠券
      </button>
      <button
        className={currentFilter === '露營用品' ? styles.active : ''}
        onClick={() => onFilterChange('露營用品')}
      >
        露營用品優惠券
      </button>
    </div>
  )
}

export default CouponFilterButton

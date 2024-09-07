import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './coupon-button.module.css'
import couponIcon from '@/public/coupon-icons/couponIcon.svg'
import getCouponIcon from '@/public/coupon-icons/getCouponIcon.svg'
import ConfettiEffect from './confettiEffect'
import 'animate.css'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

const CouponButton = ({ couponId, onReceive, showLoginModal }) => {
  const [isClaimed, setIsClaimed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 })
  const [userId, setUserId] = useState(null)

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  useEffect(() => {
    // 確認使用者是否登入
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
    } else {
      setUserId(null) // 設置 userId 為 null
    }
  }, [auth])

  useEffect(() => {
    // 如果用戶已登錄，從後端獲取已領取的優惠券狀態
    const fetchClaimedStatus = async () => {
      if (!userId) return

      try {
        const response = await fetch(
          `http://localhost:3005/api/coupon/user/${userId}/coupon/${couponId}/status`,
          {
            method: 'GET',
            credentials: 'include', // 包含用戶憑證
          }
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setIsClaimed(result.data.claimed) // 使用新的 API 結構
      } catch (error) {
        console.error('Error fetching coupon status:', error)
      }
    }

    fetchClaimedStatus()
  }, [userId, couponId])

  const handleClick = async (e) => {
    if (!userId) {
      showLoginModal() // 用戶未登入時，顯示登入 Modal
      return
    }

    if (isClaimed) return

    try {
      const response = await fetch('http://localhost:3005/api/coupon/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, coupon_id: couponId }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.status === 'success') {
        setIsClaimed(true)
        setConfettiPosition({ x: e.clientX, y: e.clientY })
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 500) // 粒子效果顯示0.5秒後隱藏
      } else {
        console.error(data.message || '領取失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Error receiving coupon:', error)
    }
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  let buttonClass = styles.btn
  if (isClaimed) {
    buttonClass = `${styles.btn} ${styles.claimedBtn}`
  } else if (isHovered) {
    buttonClass = `${styles.btn} ${styles.hoverBtn}`
  }

  return (
    <div className={styles.buttonContainer}>
      {showConfetti && (
        <ConfettiEffect
          trigger={showConfetti}
          x={confettiPosition.x}
          y={confettiPosition.y}
        />
      )}
      <button
        className={buttonClass}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={isClaimed} // 按鈕依然禁用，防止已領取的優惠券重複操作
      >
        {isClaimed ? (
          <>
            <Image src={getCouponIcon} alt="Get Coupon" />
            <p>已領取</p>
          </>
        ) : (
          <>
            <Image src={couponIcon} alt="Coupon Icon" />
            <p>領取折價券</p>
          </>
        )}
      </button>
    </div>
  )
}

export default CouponButton

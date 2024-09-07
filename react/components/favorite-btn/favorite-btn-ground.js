import React, { useState, useEffect } from 'react'
import ConfettiEffect from '@/components/coupon-card/confettiEffect'
import styles from './favorite-btn.module.css'

export default function FavoriteBtn({ campgroundId }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 })

  // 獲取收藏狀態的函式
  const fetchFavoriteStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/campground/collect/${campgroundId}`,
        {
          credentials: 'include',
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      setIsFavorite(result.like)
    } catch (error) {
      console.error('Error fetching favorite status:', error)
    }
  }

  // 當組件加載時獲取收藏狀態
  useEffect(() => {
    fetchFavoriteStatus()
  }, [campgroundId])

  const handleClick = async (e) => {
    e.stopPropagation()

    try {
      const response = await fetch(
        'http://localhost:3005/api/campground/collect',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campground_id: campgroundId }),
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      if (result.message === 'Favorite removed') {
        setIsFavorite(false)
      } else if (result.message === '授權失敗，沒有存取令牌') {
        notifyFav()
      } else if (result.message === '新增收藏成功') {
        setIsFavorite(true)
        setConfettiPosition({
          x: e.clientX,
          y: e.clientY,
        })
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 500) // 粒子效果顯示0.5秒後隱藏
      }
    } catch (error) {
      console.error('Error processing favorite request:', error)
    }
  }

  // SweetAlert 通知用戶需要登入
  const notifyFav = () => {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      title: '需要登入後才能將營地加入收藏喲!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    })
  }

  return (
    <div className={styles.favoriteBtn} onClick={handleClick}>
      {showConfetti && (
        <ConfettiEffect
          trigger={showConfetti}
          x={confettiPosition.x}
          y={confettiPosition.y}
        />
      )}
      {isFavorite ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M10.8963 19.3345L12 20.3268L13.1038 19.3345C14.7679 17.8307 16.1403 16.5384 17.221 15.4578C18.3018 14.3769 19.1592 13.415 19.7932 12.572C20.4272 11.7292 20.8702 10.9603 21.122 10.2653C21.374 9.57044 21.5 8.86536 21.5 8.15002C21.5 6.73086 21.0215 5.54269 20.0645 4.58552C19.1073 3.62852 17.9192 3.15002 16.5 3.15002C15.627 3.15002 14.802 3.35419 14.025 3.76252C13.248 4.17086 12.573 4.75644 12 5.51927C11.427 4.75644 10.752 4.17086 9.975 3.76252C9.198 3.35419 8.373 3.15002 7.5 3.15002C6.08083 3.15002 4.89267 3.62852 3.9355 4.58552C2.9785 5.54269 2.5 6.73086 2.5 8.15002C2.5 8.86536 2.626 9.57044 2.878 10.2653C3.12983 10.9603 3.57275 11.7292 4.20675 12.572C4.84075 13.415 5.69975 14.3769 6.78375 15.4578C7.86775 16.5384 9.23858 17.8307 10.8963 19.3345Z"
            fill="#E49366"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M12 20.3268L10.8963 19.3345C9.23858 17.8307 7.86775 16.5384 6.78375 15.4578C5.69975 14.3769 4.84075 13.415 4.20675 12.572C3.57275 11.7292 3.12983 10.9603 2.878 10.2653C2.626 9.57044 2.5 8.86536 2.5 8.15002C2.5 6.73086 2.9785 5.54269 3.9355 4.58552C4.89267 3.62852 6.08083 3.15002 7.5 3.15002C8.373 3.15002 9.198 3.35419 9.975 3.76252C10.752 4.17086 11.427 4.75644 12 5.51927C12.573 4.75644 13.248 4.17086 14.025 3.76252C14.802 3.35419 15.627 3.15002 16.5 3.15002C17.9192 3.15002 19.1073 3.62852 20.0645 4.58552C21.0215 5.54269 21.5 6.73086 21.5 8.15002C21.5 8.86536 21.374 9.57044 21.122 10.2653C20.8702 10.9603 20.4272 11.7292 19.7932 12.572C19.1592 13.415 18.3018 14.3769 17.221 15.4578C16.1403 16.5384 14.7679 17.8307 13.1038 19.3345L12 20.3268ZM12 18.3C13.6 16.8604 14.9167 15.6264 15.95 14.598C16.9833 13.5699 17.8 12.6766 18.4 11.9183C19 11.1599 19.4167 10.4865 19.65 9.89802C19.8833 9.30969 20 8.72702 20 8.15002C20 7.15002 19.6667 6.31669 19 5.65002C18.3333 4.98336 17.5 4.65002 16.5 4.65002C15.7103 4.65002 14.9805 4.87402 14.3105 5.32202C13.6407 5.77019 13.1102 6.39361 12.7192 7.19227H11.2808C10.8833 6.38711 10.3512 5.76211 9.6845 5.31727C9.01783 4.87244 8.28967 4.65002 7.5 4.65002C6.50633 4.65002 5.67458 4.98336 5.00475 5.65002C4.33492 6.31669 4 7.15002 4 8.15002C4 8.72702 4.11667 9.30969 4.35 9.89802C4.58333 10.4865 5 11.1599 5.6 11.9183C6.2 12.6766 7.01667 13.5683 8.05 14.5933C9.08333 15.6183 10.4 16.8539 12 18.3Z" />
        </svg>
      )}
    </div>
  )
}

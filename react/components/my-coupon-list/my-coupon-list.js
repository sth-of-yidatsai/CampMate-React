import React, { useEffect, useState } from 'react'
import styles from './my-coupon-list.module.css'
import CouponCard3 from '@/components/coupon-card/coupon-card3'
import Pagination from '@/components/pagination/pagination'
import CouponFilterButton from '@/components/coupon-filter-button/coupon-filter-button2'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import { useAuthTest } from '@/hooks/use-auth-test' // 假設你有這個 hook

const MyCouponList = () => {
  const [coupons, setCoupons] = useState([])
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentFilter, setCurrentFilter] = useState('已領取')
  const [userId, setUserId] = useState(null)

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'MEMBER', href: '/member-test/profile-test' },
    { name: '我的優惠券', href: '/member-test/my-coupon' },
  ]

  useEffect(() => {
    // 確認使用者是否登入
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
    } else {
      setError('No user ID provided')
    }
  }, [auth])

  useEffect(() => {
    if (!userId) {
      return
    }

    fetchCoupons(currentPage, currentFilter)
  }, [userId, currentPage, currentFilter])

  const fetchCoupons = (page, filter) => {
    fetch(
      `http://localhost:3005/api/coupon/user_coupon?filter=${encodeURIComponent(
        filter
      )}&page=${page}`,
      {
        method: 'GET',
        credentials: 'include', // 如果需要攜帶憑證
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const allCoupons = data.data.userCoupons
        setCoupons(allCoupons)
        setTotalPages(data.data.totalPages || 1)
        setError(allCoupons.length === 0 ? '尚無優惠券' : null)
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error)
        setError('伺服器錯誤，請稍後再試')
      })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.querySelector(`.${styles.pageTitle}`).offsetTop - 20,
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter)
    setCurrentPage(1)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapArea}>
        <div className={styles.breadcrumbAndTitle}>
          <Breadcrumb items={breadcrumbItems} />
          <h2 className={styles.pageTitle}>
            <span className={styles.h2}>我的優惠券</span>
          </h2>
        </div>

        <CouponFilterButton
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        <div className={styles.couponList}>
          {error ? (
            <div>{error}</div>
          ) : (
            coupons.map((coupon) => (
              <CouponCard3 key={coupon.id} {...coupon} userId={userId} />
            ))
          )}
        </div>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default MyCouponList

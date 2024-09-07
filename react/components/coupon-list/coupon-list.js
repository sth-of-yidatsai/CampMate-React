import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './coupon-list.module.css'
import CouponCard2 from '@/components/coupon-card/coupon-card2'
import Pagination from '@/components/pagination/pagination'
import CouponFilterButton from '@/components/coupon-filter-button/coupon-filter-button'
import Modal from '@/components/coupon-list/modal'
import { MdOutlineArrowOutward } from 'react-icons/md'
import { IoMdLogIn } from 'react-icons/io'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

const CouponList = () => {
  const [coupons, setCoupons] = useState([])
  const [filteredCoupons, setFilteredCoupons] = useState([])
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false) // 控制 Modal
  // 打開登入提示 Modal
  const showLoginModal = () => {
    setIsModalOpen(true)
  }

  // 關閉 Modal
  const closeModal = () => {
    setIsModalOpen(false)
  }
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentFilter, setCurrentFilter] = useState('所有')
  const [claimedCoupons, setClaimedCoupons] = useState([]) // 保存已領取的優惠券 ID

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  useEffect(() => {
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
      fetchUserCoupons(auth.userData.id) // 獲取該用戶已領取的優惠券 ID
    } else {
      setUserId(null) // 設置 userId 為 null
      fetchCoupons() // 獲取所有優惠券
    }
  }, [auth])

  const fetchUserCoupons = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/coupon/user_coupon/${userId}`,
        { credentials: 'include' }
      )
      const data = await response.json()

      if (data.status === 'success') {
        const claimedCouponIds = data.data.userCoupons.map(
          (coupon) => coupon.coupon_id
        )
        setClaimedCoupons(claimedCouponIds)
      } else {
        console.error('Failed to fetch user coupons:', data.message)
        setError('Failed to fetch user coupons.')
      }
    } catch (error) {
      console.error('Error fetching user coupons:', error)
      setError('Failed to fetch user coupons.')
    }
  }

  const fetchCoupons = (page = 1, type = '所有') => {
    let url = `http://localhost:3005/api/coupon?page=${page}`
    if (type !== '所有') {
      url += `&type=${type}`
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const allCoupons = data.data.coupons
        const validCoupons = allCoupons.filter(
          (coupon) => coupon.status === '可使用' || coupon.status === '稍後使用'
        )

        setCoupons(validCoupons)
        setFilteredCoupons(validCoupons)
        setTotalPages(data.data.totalPages)
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error)
        setError(error.message)
      })
  }

  useEffect(() => {
    fetchCoupons(currentPage, currentFilter)
  }, [currentPage, currentFilter])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.querySelector(`.${styles.pageTitle}`).offsetTop - 20,
      left: 0,
      behavior: 'smooth',
    })
  }

  const handleFilterChange = (type) => {
    setCurrentFilter(type)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (!userId) return // 如果 userId 為 null，則不再進行用戶特定的優惠券查詢
    fetchUserCoupons(userId)
  }, [userId])

  const handleCouponReceive = async (coupon_id) => {
    if (!userId) {
      setIsModalOpen(true) // 用戶未登入時，打開 Modal
      return
    }

    try {
      const response = await fetch('http://localhost:3005/api/coupon/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, coupon_id }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.status === 'success') {
        console.log('成功領取優惠券！')
        setClaimedCoupons((prev) => [...prev, coupon_id]) // 更新已領取的優惠券ID
        fetchUserCoupons(userId) // 更新領取狀態
      } else {
        console.log(data.message || '領取失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Error receiving coupon:', error)
      alert('領取失敗，請稍後再試')
    }
  }

  if (error) {
    return <div>錯誤：{error}</div>
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapArea}>
          <h2 className={styles.pageTitle}>
            <span className={styles.h2}>所有優惠券。</span>
            快來領取您專屬的好康優惠。
          </h2>
          <CouponFilterButton
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
          <div className={styles.couponList}>
            {filteredCoupons.map((coupon) => (
              <CouponCard2
                key={coupon.id}
                {...coupon}
                userId={userId}
                claimed={claimedCoupons.includes(coupon.id)} // 傳遞已領取狀態
                onReceive={() => handleCouponReceive(coupon.id)}
                showLoginModal={showLoginModal}
              />
            ))}
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

      {/* Modal 用於提示用戶登錄 */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className={styles.couponModal}>
            <div className={styles.modalHead}>尚未登入</div>
            <Link className={styles.tdn} href="/member-test/login">
              <div className={styles.modalInfo}>
                <div className={styles.logIn}>
                  <IoMdLogIn className={styles.logInIcon} />
                  <div className={styles.th}>前往登入</div>
                </div>
                <div className={styles.line} />
                <div className={styles.col}>
                  <div className={styles.th}>登入後即可領取眾多好康優惠</div>
                  <div className={styles.arrow2}>
                    <MdOutlineArrowOutward className={styles.arrow2Icon} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Modal>
      )}
    </>
  )
}

export default CouponList

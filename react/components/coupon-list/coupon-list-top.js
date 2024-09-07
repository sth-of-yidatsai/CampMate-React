import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import styles from './coupon-list-top.module.css'
import CouponCard1 from '@/components/coupon-card/coupon-card1'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { MdOutlineArrowOutward } from 'react-icons/md'
import { IoMdLogIn } from 'react-icons/io'
import CouponType1_1 from '@/public/coupon-img/couponType1_1.jpg'
import CouponType1_2 from '@/public/coupon-img/couponType1_2.jpg'
import CouponType1_3 from '@/public/coupon-img/couponType1_3.jpg'
import CouponType2_1 from '@/public/coupon-img/couponType2_1.jpg'
import CouponType2_2 from '@/public/coupon-img/couponType2_2.jpg'
import CouponType2_3 from '@/public/coupon-img/couponType2_3.jpg'
import CouponType3_1 from '@/public/coupon-img/couponType3_1.jpg'
import CouponType3_2 from '@/public/coupon-img/couponType3_2.jpg'
import CouponType3_3 from '@/public/coupon-img/couponType3_3.jpg'
import Modal from '@/components/coupon-list/modal'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

const typeToImages = {
  全站: [CouponType1_1, CouponType1_2, CouponType1_3],
  露營區: [CouponType2_1, CouponType2_2, CouponType2_3],
  露營用品: [CouponType3_1, CouponType3_2, CouponType3_3],
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const CouponListTop = () => {
  const [coupons, setCoupons] = useState([])
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [claimedCoupons, setClaimedCoupons] = useState([]) // 儲存已領取的優惠券ID
  const [isModalOpen, setIsModalOpen] = useState(false) // 控制 Modal
  // 打開登入提示 Modal
  const showLoginModal = () => {
    setIsModalOpen(true)
  }

  // 關閉 Modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  const listRef = useRef()

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  useEffect(() => {
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
      fetchUserCoupons(auth.userData.id) // 獲取該用戶已領取的優惠券 ID
    } else {
      setUserId(null) // 設置 userId 為 null
      fetchAllCoupons() // 獲取所有優惠券
    }
  }, [auth])

  const fetchUserCoupons = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/coupon/user_coupon/${userId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      const data = await response.json()

      if (data.status === 'success') {
        const claimedCouponIds = data.data.userCoupons.map(
          (coupon) => coupon.coupon_id
        )
        setClaimedCoupons(claimedCouponIds)
        fetchAllCoupons() // 同時獲取所有可用的優惠券
      } else {
        console.error('Failed to fetch user coupons:', data.message)
        setError('Failed to fetch user coupons.')
      }
    } catch (error) {
      console.error('Error fetching user coupons:', error)
      setError('Failed to fetch user coupons.')
    }
  }

  const fetchAllCoupons = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/coupon/available')
      const data = await response.json()

      if (data.status === 'success') {
        const allCoupons = data.data.coupons
        setCoupons(organizeCoupons(allCoupons)) // 直接使用返回的所有符合條件的優惠券
      } else {
        console.error('Failed to fetch coupons:', data.message)
        setError('Failed to fetch coupons.')
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setError('Failed to fetch coupons.')
    }
  }

  const organizeCoupons = (coupons) => {
    const couponGroups = {
      全站: [],
      露營區: [],
      露營用品: [],
    }

    coupons.forEach((coupon) => {
      if (couponGroups[coupon.type] && couponGroups[coupon.type].length < 3) {
        couponGroups[coupon.type].push(coupon)
      }
    })

    const finalCoupons = Object.keys(couponGroups).flatMap((type) => {
      return couponGroups[type].map((coupon, index) => ({
        ...coupon,
        image: typeToImages[type][index],
        claimed: claimedCoupons.includes(coupon.id), // 判斷是否已領取
      }))
    })

    return shuffleArray(finalCoupons)
  }

  const scroll = (direction) => {
    const { current } = listRef
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' })
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

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
        <h2 className={styles.pageTitle}>
          <span className={styles.h2}>立即可使用。</span>
          現在趕快來領取。
        </h2>
      </div>
      <div className={styles.containerW100}>
        <div className={styles.wrapper}>
          <MdChevronLeft
            className={`${styles.arrow} ${styles.left}`}
            onClick={() => scroll('left')}
          />
          <div className={styles.mask}>
            <div className={styles.couponList} ref={listRef}>
              {coupons.map((coupon, index) => {
                const isFirst = index === 0
                const isLast = index === coupons.length - 1
                return (
                  <div
                    key={coupon.id}
                    className={`${styles.couponCard} ${
                      isFirst ? styles.firstCard : ''
                    } ${isLast ? styles.lastCard : ''}`}
                  >
                    <CouponCard1
                      {...coupon}
                      userId={userId}
                      onReceive={() => handleCouponReceive(coupon.id)}
                      showLoginModal={showLoginModal}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <MdChevronRight
            className={`${styles.arrow} ${styles.right}`}
            onClick={() => scroll('right')}
          />
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

export default CouponListTop

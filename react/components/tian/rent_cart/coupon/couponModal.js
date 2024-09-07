import React, { useEffect, useState } from 'react'

import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

import CouponCard2 from './coupon-card2'

export default function CouponModal({
  couponToggle,
  setCouponToggle,
  coupons,
  selectedValue,
  setSelectedValue,
  handleChange,
  handleCheckCoupon,
  setSelectedCoupon,
}) {
  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const closeCoupon = () => {
    if (couponToggle === true) {
      setCouponToggle(false)
      return
    }
  }

  const handleCancel = () => {
    setSelectedValue(null)
    // setSelectedCoupon({})
    closeCoupon()
  }

  //----------------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
      // fetchCoupons(auth.userData.id) // 獲取該用戶已領取的優惠券 ID
    } else {
      setUserId(null) // 設置 userId 為 null
    }
  }, [auth])

  return (
    <>
      <section
        className={`couponModal-tian ${couponToggle === false ? 'd-none' : ''}`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">露營用品優惠券</div>
          <div
            onClick={() => {
              closeCoupon()
            }}
            className="close"
          >
            <span className="material-symbols-outlined light-text-tian">
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="bodyTitle h6-tc-tian">選擇優惠券</div>
          <div className="content">
            {/* <div className="couponCard active">
              <div className="cate">
                <span className="material-symbols-outlined light-text-tian">
                  local_mall
                </span>
                <div className="p2-tc-tian light-text-tian">全站</div>
              </div>
              <div className="info">
                <div className="left">
                  <div>
                    <p className="m-0">優惠券名稱</p>
                    <p className="m-0">15% off</p>
                  </div>
                  <p className="m-0">有效期限 7.10</p>
                </div>
                <div className="right">
                  <div className="rule">
                    <span className="material-symbols-outlined dark-text-tian">
                      trending_flat
                    </span>
                    <span> 使用規則 </span>
                  </div>
                  <div className="circleCheck">
                    <span className="material-symbols-outlined light-text-tian">
                      check
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
            {coupons
              ? coupons.map((coupon) => (
                  <CouponCard2
                    key={coupon.id}
                    {...coupon}
                    userId={userId}
                    selectedValue={selectedValue}
                    setSelectedValue={setSelectedValue}
                    handleChange={handleChange}
                  />
                ))
              : ''}
          </div>
        </div>
        <div className="footer">
          <div>
            <button
              className="cancel btn primary2-outline-btn-tian p1-tc-tian"
              onClick={() => {
                handleCancel()
              }}
            >
              取消
            </button>
            <button
              className="confirm btn primary2-btn-tian p1-tc-tian"
              onClick={() => {
                closeCoupon()
                handleCheckCoupon()
              }}
            >
              確認
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import CouponCard2 from './coupon-card2'

export default function CouponModal({
  couponToggle,
  setCouponToggle,
  coupons,
  selectedValue,
  setSelectedValue,
  handleChange,
}) {
  const closeCoupon = () => {
    if (couponToggle === true) {
      setCouponToggle(false)
      return
    }
  }

  const handleCancel = () => {
    setSelectedValue(null)
    closeCoupon()
  }

  //----------------------------------------------------------------------

  return (
    <>
      <section
        className={`couponModal-tian ${couponToggle === false ? 'd-none' : ''}`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">露營用品優惠券</div>
          <div onClick={() => closeCoupon()} className="close">
            <span className="material-symbols-outlined light-text-tian">
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="bodyTitle h6-tc-tian">選擇優惠券</div>
          <div className="content">
            {coupons
              ? coupons.map((coupon) => (
                  <CouponCard2
                    key={coupon.id}
                    {...coupon}
                    selectedValue={selectedValue}
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
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="confirm btn primary2-btn-tian p1-tc-tian"
              onClick={closeCoupon}
            >
              確認
            </button>
          </div>
        </div>
      </section>
      <style jsx>
        {`
          .content {
            margin-inline: auto;
          }
        `}
      </style>
    </>
  )
}

import React from 'react'
import styles from './coupon-card3.module.css'
import Image from 'next/image'
import CouponRule from '@/components/coupon-card/coupon-rule'
import MyCouponDetailBtn from '@/components/coupon-card/my-coupon-detail-btn'
import CouponType1 from '@/public/coupon-icons/couponType1.svg'
import CouponType2 from '@/public/coupon-icons/couponType2.svg'
import CouponType3 from '@/public/coupon-icons/couponType3.svg'

// 對應不同的 type 到圖示
const typeToIcon = {
  全站: CouponType1,
  露營區: CouponType2,
  露營用品: CouponType3,
}

const CouponCard3 = ({
  coupon_name,
  discount,
  end_date,
  type,
  category,
  status,
  id, // 這裡是傳入的 userCoupon.id
  userId, // 新增 userId 作為 props
}) => {
  const couponTypeImage = typeToIcon[type] || CouponType1

  // 根據 category 判斷 discount 顯示方式
  const displayDiscount =
    category === '%數折扣'
      ? `${Math.floor((1 - discount) * 100)} % Off`
      : category === '金額折抵'
      ? `$ ${Math.floor(discount)}`
      : discount

  // 格式化日期
  const formattedDate = new Date(end_date)
    .toISOString()
    .split('T')[0]
    .replace(/-/g, ' . ')

  const TagBgColorClass =
    status === '稍後使用' || status === '已過期'
      ? styles.TagBgColor1
      : styles.TagBgColor2

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponType}>
        <Image src={couponTypeImage} alt={type} width={72} height={72} />
        <p>{type}</p>
      </div>
      <div className={styles.couponInfo}>
        <div className={styles.couponText}>
          <div className={styles.detail}>
            <p className={styles.title}>{coupon_name}</p>
            <div className={styles.discountStatus}>
              <p className={styles.discount}>{displayDiscount}</p>
              <p className={`${styles.status} ${TagBgColorClass}`}>{status}</p>
            </div>
          </div>
          <div className={styles.duration}>
            <p>有效期限</p>
            <p>|</p>
            <p>{formattedDate}</p>
          </div>
        </div>
        <div className={styles.getCoupon}>
          <CouponRule id={id} />
          <MyCouponDetailBtn id={id} userId={userId} />
        </div>
      </div>
    </div>
  )
}

export default CouponCard3

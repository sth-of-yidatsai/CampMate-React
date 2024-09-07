import React from 'react'
import styles from './coupon-card2.module.css'
import Image from 'next/image'
// import CouponButton from '@/components/tian/rent_cart/coupon-button'
import CouponRule from '@/components/tian/rent_cart/coupon/coupon-rule'
import CouponType1 from '@/public/coupon-icons/couponType1.svg'
import CouponType2 from '@/public/coupon-icons/couponType2.svg'
import CouponType3 from '@/public/coupon-icons/couponType3.svg'

// 對應不同的 type 到圖示
const typeToIcon = {
  全站: CouponType1,
  露營區: CouponType2,
  露營用品: CouponType3,
}

const CouponCard2 = ({
  coupon_name,
  discount,
  end_date,
  type,
  category,
  status,
  id,
  userId,
  claimed, // 新增的屬性來指示優惠券是否已被領取
  showLoginModal,
  onReceive,
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
        <Image src={couponTypeImage} alt={type} width={40} height={40} />
        <p className="p2-tc-tian light-text-tian">{type}</p>
      </div>
      <div className={styles.couponInfo}>
        <div className={styles.couponText}>
          <div className={styles.detail}>
            <p className={`${styles.title} p2-tc-tian`}>{coupon_name}</p>
            <div className={styles.discountStatus}>
              <p className={`${styles.discount} p3-tc-tian`}>
                {displayDiscount}
              </p>
              <p className={`${styles.status} ${TagBgColorClass} p3-tc-tian`}>
                {status}
              </p>
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
          <div className="circleCheck">
            <span className="material-symbols-outlined light-text-tian">
              check
            </span>
          </div>

          {/* <CouponButton
            couponId={id}
            userId={userId}
            claimed={claimed} // 傳遞已領取狀態給 CouponButton
            onReceive={onReceive}
            showLoginModal={showLoginModal}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default CouponCard2

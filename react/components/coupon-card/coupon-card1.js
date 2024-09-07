import React from 'react'
import Image from 'next/image'
import styles from './coupon-card1.module.css'
import CouponButton from '@/components/coupon-card/coupon-button'
import CouponRule from '@/components/coupon-card/coupon-rule'
import CouponType1 from '@/public/coupon-icons/couponType1.svg'
import CouponType2 from '@/public/coupon-icons/couponType2.svg'
import CouponType3 from '@/public/coupon-icons/couponType3.svg'
import CouponPlus from '@/public/coupon-icons/couponPlus.svg'

// 對應不同的 type 到圖示
const typeToIcon = {
  全站: CouponType1,
  露營區: CouponType2,
  露營用品: CouponType3,
}

const CouponCard1 = ({
  coupon_name,
  discount,
  end_date,
  type,
  category,
  status,
  image,
  id,
  userId,
  claimed, // 新增的屬性來指示優惠券是否已被領取
  showLoginModal,
  onReceive,
}) => {
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

  const IconComponent = typeToIcon[type] || CouponType1

  return (
    <div className={styles.couponCard}>
      <Image className={styles.plus} src={CouponPlus} alt="" />
      <div className={styles.couponImg}>
        <Image
          className={styles.objectFitCover}
          src={image}
          alt={coupon_name}
        />
        {IconComponent && (
          <div className={styles.iconOverlay}>
            <Image src={IconComponent} width={100} height={100} alt={type} />
            <p>{type}優惠券</p>
          </div>
        )}
      </div>
      <div className={styles.category}>
        <div className={styles.dot}></div>
        <div className={styles.tag}>{type}</div>
      </div>
      <div className={styles.line} />
      <div className={styles.couponInfo}>
        <div className={styles.couponDetail}>
          <div className={styles.couponTitle}>
            <p className={styles.title}>{coupon_name}</p>
            <p className={styles.info}>{displayDiscount}</p>
          </div>
        </div>
        <div className={styles.ruleBtn}>
          <CouponRule id={id} />
          <CouponButton
            couponId={id}
            userId={userId}
            claimed={claimed} // 傳遞已領取狀態給 CouponButton
            onReceive={onReceive}
            showLoginModal={showLoginModal}
          />
        </div>
      </div>
    </div>
  )
}

export default CouponCard1

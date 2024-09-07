import React, { useState, useEffect } from 'react'
import Modal from './coupon-modal'
import styles from './coupon-rule.module.css'
import { MdOutlineArrowOutward } from 'react-icons/md'
import { VscArrowRight } from 'react-icons/vsc'

const CouponRule = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [couponData, setCouponData] = useState(null)

  const openModal = () => {
    setIsModalOpen(true)
    fetchCouponData()
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const fetchCouponData = () => {
    fetch(`http://localhost:3005/api/coupon/${id}`) // 根據實際情況調整 API 地址
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setCouponData(data.data) // 確保正確解析數據
      })
      .catch((error) => console.error('Error fetching coupon data:', error))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openModal()
    }
  }

  // 根據 category 判斷 discount 顯示方式
  const displayDiscount = (category, discount) => {
    if (category === '%數折扣') {
      return `${Math.floor((1 - discount) * 100)} % Off`
    } else if (category === '金額折抵') {
      return `$ ${Math.floor(discount)}`
    } else {
      return discount
    }
  }

  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0].replace(/-/g, ' . ')
  }

  return (
    <div className={styles.ruleContainer}>
      <div
        className={styles.rule}
        onClick={openModal}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
      >
        <MdOutlineArrowOutward />
        <p>使用規則</p>
      </div>
      {isModalOpen && couponData && (
        <Modal onClose={closeModal}>
          <div className={styles.couponModal}>
            <div className={styles.modalHead}>使用規則</div>
            <div className={styles.modalInfo}>
              <div className={styles.col}>
                <div className={styles.th}>名稱</div>
                <div>{couponData.coupon_name}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>類別</div>
                <div>{couponData.type}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>優惠</div>
                <div>
                  {displayDiscount(couponData.category, couponData.discount)}
                </div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>最低消費金額</div>
                <div>$ {couponData.min_cost}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>最高折抵金額</div>
                <div>$ {couponData.max_discount_amount}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>有效期限</div>
                <div>
                  {formatDate(couponData.start_date)}
                  <VscArrowRight className={styles.arrowIcon} />
                  <br className={styles.br} />
                  {formatDate(couponData.end_date)}
                </div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>狀態</div>
                <div>{couponData.status}</div>
              </div>
              {/* <div className={styles.line}></div> */}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CouponRule

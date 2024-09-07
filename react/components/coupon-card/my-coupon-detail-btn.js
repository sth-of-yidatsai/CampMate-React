import React, { useState, useEffect } from 'react'
import Modal from './coupon-modal'
import styles from './coupon-rule.module.css'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { VscArrowRight } from 'react-icons/vsc'

const MyCouponDetailBtn = ({ id, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [couponData, setCouponData] = useState(null)

  const openModal = () => {
    console.log('Opening modal')
    setIsModalOpen(true)
    fetchCouponData(id, userId)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const fetchCouponData = (couponId, userId) => {
    console.log(
      `Fetching coupon data for coupon ID: ${couponId} and user ID: ${userId}`
    )
    fetch(`http://localhost:3005/api/coupon/user/${userId}/coupon/${couponId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log('Fetched Data:', data)
        setCouponData(data.data)
      })
      .catch((error) => console.error('Error fetching coupon data:', error))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openModal()
    }
  }

  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0].replace(/-/g, ' . ')
  }

  return (
    <div className={styles.ruleContainer}>
      <div
        className={styles.detailBtn}
        onClick={openModal}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
      >
        <MdOutlineRemoveRedEye />
        <p>查看詳情</p>
      </div>
      {isModalOpen && couponData && (
        <Modal onClose={closeModal}>
          <div className={styles.couponModal}>
            <div className={styles.modalHead}>查看詳情</div>
            <div className={styles.modalInfo}>
              <div className={styles.col}>
                <div className={styles.th}>名稱</div>
                <div>{couponData.coupon_name}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>領取時間</div>
                <div>{formatDate(couponData.received_at)}</div>
              </div>
              <div className={styles.line}></div>
              <div className={styles.col}>
                <div className={styles.th}>使用狀態</div>
                <div>{couponData.status}</div>
              </div>
              {couponData.status === '已使用' && (
                <>
                  <div className={styles.line}></div>
                  <div className={styles.col}>
                    <div className={styles.th}>使用時間</div>
                    <div>{formatDate(couponData.updated_at)}</div>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.col}>
                    <div className={styles.th}>使用訂單</div>
                    <div>
                      {couponData.c_order_id}
                      {couponData.p_order_id}
                    </div>
                  </div>
                </>
              )}
              {couponData.coupon_status === '可使用' &&
                couponData.status === '未使用' && (
                  <>
                    <div className={styles.line}></div>
                    <div className={styles.col}>
                      <div className={styles.th}>目前可用</div>
                      <div>
                        {formatDate(couponData.start_date)}
                        <VscArrowRight className={styles.arrowIcon} />
                        <br className={styles.br} />
                        {formatDate(couponData.end_date)}
                      </div>
                    </div>
                  </>
                )}
              {couponData.coupon_status === '稍後使用' && (
                <>
                  <div className={styles.line}></div>
                  <div className={styles.col}>
                    <div className={styles.th}>稍後可用</div>
                    <div>{formatDate(couponData.start_date)} 生效</div>
                  </div>
                </>
              )}
              {couponData.coupon_status === '已過期' && (
                <>
                  <div className={styles.line}></div>
                  <div className={styles.col}>
                    <div className={styles.th}>已過期</div>
                    <div>{formatDate(couponData.end_date)} 失效</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MyCouponDetailBtn

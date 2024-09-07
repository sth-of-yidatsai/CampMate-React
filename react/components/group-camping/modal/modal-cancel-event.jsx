import React from 'react'
import styles from './modal-cancel-event.module.scss'

export default function ModalCancelEvent({ onClose, user_id, event_id }) {
  // 退出團露
  const handleCancel = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/group-participant/user/${user_id}/${event_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ attendence_status: 'canceled' }),
        }
      )

      if (res.ok) {
        alert('已退出團露！')
        onClose()
        window.location.href = 'http://localhost:3000/group-camping/my-event'
      } else {
        const errorData = await res.json()
        console.error('退出團露失敗:', errorData)
        alert('退出團露失敗，請再試一次。')
      }
    } catch (error) {
      console.error('網路錯誤:', error)
      alert('退出團露失敗，請再試一次。')
    }
  }

  return (
    <div className={`${styles.modalCancel} ${styles.globe}`}>
      <div className={styles.modalContent}>
        <div className={`${styles.head} ${styles.h6Tc}`}>系統提醒!!</div>
        <div className={`${styles.content} ${styles.h5Tc}`}>
          確定要退出團露嗎?
        </div>
        <div className={styles.btns}>
          <button
            className={`${styles.btnConfirm} ${styles.btnCancelYes} ${styles.p2Tc}`}
            onClick={handleCancel}
            type="submit"
          >
            退出
          </button>
          <button
            className={`${styles.btnConfirm} ${styles.btnCancelNo} ${styles.p2Tc}`}
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
      <button className={styles.close} onClick={onClose}>
        <span className="material-symbols-outlined"> close </span>
      </button>
    </div>
  )
}

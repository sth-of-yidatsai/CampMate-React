import React from 'react'
import Image from 'next/image'
import ReactDOM from 'react-dom'
import styles from './coupon-modal.module.css'
import ModalCloseBtn from '@/public/modalCloseBtn.svg'

const Modal = ({ onClose, children }) => {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={ModalCloseBtn} />
        </button>
        {children}
      </div>
    </div>,
    document.body // 將模態框渲染到 document.body 上，避免被 clip-path 遮擋
  )
}

export default Modal

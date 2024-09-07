import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './expand-button.module.css'
import { MdOutlineArrowOutward } from 'react-icons/md'

const ExpandButton = ({ isVisible }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCircleAnimationDone, setIsCircleAnimationDone] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const circleTimer = setTimeout(() => {
        setIsCircleAnimationDone(true)
      }, 1000) // 圓形動畫延遲1秒鐘開始

      const buttonTimer = setTimeout(() => {
        setShouldAnimate(true)
        setIsCollapsed(false)
      }, 500) // 圓形動畫結束後再開始按鈕動畫

      return () => {
        clearTimeout(circleTimer)
        clearTimeout(buttonTimer)
      }
    } else if (!isVisible && shouldAnimate) {
      setIsCollapsed(true)
      setTimeout(() => {
        setShouldAnimate(false)
        setIsCircleAnimationDone(false)
      }, 500) // 收合動畫完成後立即隱藏背景
    }
  }, [isVisible, shouldAnimate])

  return (
    <>
      {isCircleAnimationDone || !isVisible ? null : (
        <div className={styles.circle}>
          <div className={styles.smallCircle} />
          <div className={styles.bigCircle} />
        </div>
      )}
      <Link href="/group-camping/event-list">
        <button
          className={`${styles.expandButton} ${
            shouldAnimate ? styles.expanded : ''
          } ${isCollapsed ? styles.collapsed : ''} ${
            shouldAnimate ? styles.expandedBackground : ''
          } ${isCollapsed ? styles.collapsedBackground : ''} ${
            shouldAnimate ? styles.expandedText : ''
          } ${isCollapsed ? styles.collapsedText : ''}`}
        >
          <span className={styles.text}>前往團露列表</span>
          <span className={styles.icon}>
            <MdOutlineArrowOutward />
          </span>
        </button>
      </Link>
    </>
  )
}

export default ExpandButton

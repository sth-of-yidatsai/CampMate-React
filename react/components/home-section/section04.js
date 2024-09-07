import React, { useState, useEffect, useRef } from 'react'
import styles from './section.module.css'
import CouponListTop from '@/components/coupon-list/coupon-list-top'
import ExpandButtonHomeCoupon from '@/components/expand-button/expand-button-home-coupon'

const Section04 = React.forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.99, // 99% of the section is visible
      }
    )

    const currentRef = sectionRef.current || ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref])

  return (
    <div
      id={props.id}
      ref={(el) => {
        sectionRef.current = el
        if (typeof ref === 'function') {
          ref(el)
        } else if (ref) {
          ref.current = el
        }
      }}
      className={`${styles.section} ${styles.bg}`}
    >
      <CouponListTop />
      <ExpandButtonHomeCoupon isVisible={isVisible} />
    </div>
  )
})

Section04.displayName = 'Section04'

export default Section04

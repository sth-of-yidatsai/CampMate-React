import React, { useState, useEffect, useRef } from 'react'
import styles from './section.module.css'
import HomeGroundArea from '@/components/home-ground-area/home-ground-area'
import ExpandButtonHomeGround from '@/components/expand-button/expand-button-home-ground'

const Section02g = React.forwardRef((props, ref) => {
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
      className={`${styles.section} ${styles.bg2}`}
    >
      <ExpandButtonHomeGround isVisible={isVisible} />
      <HomeGroundArea />
    </div>
  )
})

Section02g.displayName = 'Section02g'

export default Section02g

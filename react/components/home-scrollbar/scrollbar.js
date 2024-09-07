// src/components/home-scrollbar/Scrollbar.js
import React from 'react'
import { scroller } from 'react-scroll'
import Scrollspy from 'react-scrollspy'
import { useScrollContext } from '@/context/ScrollContext'
import styles from './scrollbar.module.css'
import ScrollbarCircleOutline from '@/public/home-icons/scrollbarCircleOutline.svg'
import Image from 'next/image'

const Scrollbar = () => {
  const sections = [
    'Section 1',
    'Section 2',
    'Section 3',
    'Section 4',
    'Section 5',
  ]
  const { currentSection, sectionsRef, setCurrentSection } = useScrollContext()

  const handleClick = (section, index) => {
    scroller.scrollTo(section, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    })
    if (sectionsRef.current[index]) {
      window.scrollTo({
        top: sectionsRef.current[index].offsetTop,
        behavior: 'smooth',
      })
      setCurrentSection(index)
    }
  }

  return (
    <div className={styles.scrollbar}>
      <Scrollspy
        items={sections.map((section, index) => `Section ${index + 1}`)}
        currentClassName={styles.active}
        className={styles.scrollspy}
      >
        {sections.map((section, index) => (
          <li key={section} onClick={() => handleClick(section, index)}>
            <button
              className={`${styles.scrollbarBtn} ${
                index < currentSection ? styles.viewed : ''
              } ${index === currentSection ? styles.active : ''}`}
            >
              <div className={styles.dot}></div>
              <Image
                className={styles.outline}
                src={ScrollbarCircleOutline}
                width={20}
                height={24}
                alt=""
              />
            </button>
          </li>
        ))}
      </Scrollspy>
    </div>
  )
}

export default Scrollbar

import React from 'react'
import HomeSearchArea from '@/components/home-search-area/home-search-area'
import styles from './section.module.css'

const Section01 = React.forwardRef(({ selectedTab, isTransitioning }, ref) => (
  <div id="section01" ref={ref} className={`${styles.section} ${styles.bg}`}>
    <HomeSearchArea
      selectedTab={selectedTab}
      isTransitioning={isTransitioning}
    />
  </div>
))

Section01.displayName = 'Section01'

export default Section01

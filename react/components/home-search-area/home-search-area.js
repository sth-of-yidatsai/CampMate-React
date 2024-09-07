import React from 'react'
import HomeSearchArea01 from './HomeSearchArea01'
import HomeSearchArea02 from './HomeSearchArea02'
import styles from './home-search-area.module.css'

export default function HomeSearchArea({ selectedTab, isTransitioning }) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.area} ${
          selectedTab === 0 ? styles.enterFromRight : styles.exitToLeft
        } ${isTransitioning ? styles.transition : ''}`}
      >
        <HomeSearchArea01 />
      </div>
      <div
        className={`${styles.area} ${
          selectedTab === 1 ? styles.enterFromLeft : styles.exitToRight
        } ${isTransitioning ? styles.transition : ''}`}
      >
        <HomeSearchArea02 />
      </div>
    </div>
  )
}

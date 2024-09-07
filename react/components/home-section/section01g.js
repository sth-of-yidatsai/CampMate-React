import React from 'react'
// import HomeSearchArea from '@/components/home-search-area/home-search-area'
import HomeSearchArea01 from '@/components/home-search-area/HomeSearchArea01'
import styles from './section.module.css'

const Section01g = React.forwardRef((props, ref) => (
  <div id={props.id} ref={ref} className={styles.section}>
    <HomeSearchArea01 />
  </div>
))

Section01g.displayName = 'Section01g'

export default Section01g

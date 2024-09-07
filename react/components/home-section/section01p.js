import React from 'react'
// import HomeSearchArea from '@/components/home-search-area/home-search-area'
import HomeSearchArea02 from '@/components/home-search-area/HomeSearchArea02'
import styles from './section.module.css'

const Section01p = React.forwardRef((props, ref) => (
  <div id={props.id} ref={ref} className={styles.section}>
    <HomeSearchArea02 />
  </div>
))

Section01p.displayName = 'Section01p'

export default Section01p

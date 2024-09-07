import React from 'react'
import styles from './section.module.css'

const Section = React.forwardRef((props, ref) => (
  <div id={props.id} ref={ref} className={styles.test}>
    <h2>Section</h2>
    <p>This is the content for section</p>
  </div>
))

Section.displayName = 'Section'

export default Section

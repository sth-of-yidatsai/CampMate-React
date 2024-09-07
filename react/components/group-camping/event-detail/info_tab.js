import React from 'react'
import styles from './info_tab.module.scss'

export default function Info_tab({ activeSection }) {
  const tabs = [
    { id: 'introduction', label: '團露介紹' },
    { id: 'location', label: '地點' },
  ]

  return (
    <div className={`${styles.infoTab} ${styles.globe}`}>
      <ul className={`${styles.nav} ${styles.navPills}`}>
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.navItem}>
            <a
              className={`${styles.p2Tc} ${
                activeSection === tab.id ? styles.active : ''
              }`}
              aria-current={activeSection === tab.id ? 'page' : undefined}
              href={`#${tab.id}`}
              role="tab"
              aria-controls={tab.id}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

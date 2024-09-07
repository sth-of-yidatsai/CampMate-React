import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BreadcrumbIcon from '@/public/breadcrumbIcon.svg'
import styles from './breadcrumb.module.css'

export default function Breadcrumb({ items }) {
  return (
    <div className={styles.wrap}>
      <Image src={BreadcrumbIcon} alt="Breadcrumb Icon" />
      {items.map((item, index) => (
        <span key={index}>
          <Link href={item.href} className={styles.link}>
            {item.name}
          </Link>
          {index < items.length - 1 && ' / '}
        </span>
      ))}
    </div>
  )
}

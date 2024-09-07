import { useState } from 'react'
import styles from './area-card-m.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/hooks/use-search'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'

export default function AreaCardM() {
  const { handleJump } = useSearch()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'GROUND', href: '/campground/campground-home' },
  ]

  return (
    <>
      <div className={styles.container}></div>
      <div className="bread-wrapper">
        <div className="bread-crumb">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <p className="title-of-discount">
          旅客的熱門選擇。<span>現在就來看看有哪些營地。</span>
        </p>
      </div>
      <div className={styles.cardWrapper}>
        <div
          className={styles.imageWrapper}
          onClick={() => {
            handleJump('北部')
          }}
        >
          <Image
            className={styles.topImage}
            src={'/area-card/taipei.jpg'}
            alt="taipei"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.titleWrapper}>
            <h1>北部</h1>
            <p>Northern Taiwan</p>
          </div>
        </div>

        <div
          className={styles.imageWrapper}
          onClick={() => {
            handleJump('中部')
          }}
        >
          <Image
            className={styles.topImage}
            src={'/area-card/taichung.jpg'}
            alt="Central Taiwan"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.titleWrapper}>
            <h1>中部</h1>
            <p>Central Taiwan</p>
          </div>
        </div>
        <div
          className={styles.imageWrapper}
          onClick={() => {
            handleJump('南部')
          }}
        >
          <Image
            className={styles.topImage}
            src={'/area-card/tainan.jpg'}
            alt="Southern Taiwan"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.titleWrapper}>
            <h1>南部</h1>
            <p>Southern Taiwan</p>
          </div>
        </div>
        <div
          className={styles.imageWrapper}
          onClick={() => {
            handleJump('東部')
          }}
        >
          <Image
            className={styles.topImage}
            src={'/area-card/taitung.jpg'}
            alt="taipei"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.titleWrapper}>
            <h1>東部</h1>
            <p>Eastern Taiwan</p>
          </div>
        </div>
        <div
          className={styles.imageWrapper}
          onClick={() => {
            handleJump('離島')
          }}
        >
          <Image
            className={styles.topImage}
            src={'/area-card/hua.jpg'}
            alt="hualian"
            layout="fill"
            objectFit="cover"
          />
          <div className={styles.titleWrapper}>
            <h1>離島</h1>
            <p>Outlying Islands</p>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .bread-wrapper {
            width: 393px;
            display: flex;
            flex-direction: column;
            justify-content: start;
            padding: 0 16px;
          }

          .title-of-discount {
            display:flex;
            flex-direction:column;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            margin-bottom: 16px;
            span {
              color: #8f8e93;
            }
          }
        `}
      </style>
    </>
  )
}

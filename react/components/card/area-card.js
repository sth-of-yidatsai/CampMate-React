import { useState } from 'react'
import styles from './area-card.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/hooks/use-search'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'

export default function AreaCard() {
  const {  handleJump } = useSearch()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'GROUND', href: '/campground/campground-home' },
  ]


  return (
    <>
      <div className="bread-wrapper">
        <div className="bread-crumb">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <p className="title-of-discount">
          旅客的熱門選擇。<span>現在就來看看有哪些營地。</span>
        </p>
      </div>
      <div className="wrapper">
        <div className={styles.cardWrapper}>
          <div className={styles.topWrapper}>
            <div
              className={styles.imageWrapper}
              onClick={() => {
                handleJump('北部')
              }}
            >
              <Image
                className={styles.topImage}
                src={'/area-card/taipei.jpg'}
                width={624}
                height={320}
                alt="taipei"
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
                width={624}
                height={320}
                alt="Central Taiwan"
              />
              <div className={styles.titleWrapper}>
                <h1>中部</h1>
                <p>Central Taiwan</p>
              </div>
            </div>
          </div>
          <div className={styles.bottomWrapper}>
            <div
              className={styles.imageWrapperButtom}
              onClick={() => {
                handleJump('南部')
              }}
            >
              <Image
                className={styles.topImage}
                src={'/area-card/tainan.jpg'}
                width={405}
                height={320}
                alt="Southern Taiwan"
              />
              <div className={styles.titleWrapper}>
                <h1>南部</h1>
                <p>Southern Taiwan</p>
              </div>
            </div>
            <div
              className={styles.imageWrapperButtom}
              onClick={() => {
                handleJump('東部')
              }}
            >
              <Image
                className={styles.topImage}
                src={'/area-card/taitung.jpg'}
                width={405}
                height={320}
                alt="taipei"
              />
              <div className={styles.titleWrapper}>
                <h1>東部</h1>
                <p>Eastern Taiwan</p>
              </div>
            </div>
            <div
              className={styles.imageWrapperButtom}
              onClick={() => {
                handleJump('離島')
              }}
            >
              <Image
                className={styles.topImage}
                src={'/area-card/hua.jpg'}
                width={405}
                height={320}
                alt="hualian"
              />
              <div className={styles.titleWrapper}>
                <h1>離島</h1>
                <p>Outlying Islands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .bread-wrapper {
            width: 1440px;
            display: flex;
            flex-direction: column;
            justify-content: start;
            padding: 0 80px;
          }
          .wrapper {
            margin-block: 48px;
            width: 100%;
            display: grid;
            place-items: center;
          }

          .title-of-discount {
            font-family: 'Noto Sans TC';
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            margin-bottom: 48px;
            span {
              color: #8f8e93;
            }
          }
        `}
      </style>
    </>
  )
}

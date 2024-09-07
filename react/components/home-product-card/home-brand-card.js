import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './home-brand-card.module.css'
import Rating from '@mui/material/Rating'
import { MdKeyboardControlKey } from 'react-icons/md'
import { MdOutlineArrowOutward } from 'react-icons/md'
import FavoriteBtn from '@/components/favorite-btn/favorite-btn-product'

// 定義產品ID到圖片名稱的映射表
const productImageMap = {
  1: 'brand-img-01.jpg',
  2: 'brand-img-02.jpg',
  3: 'brand-img-03.jpg',
  6: 'brand-img-04.jpg',
  7: 'brand-img-05.jpg',
  10: 'brand-img-06.jpg',
  11: 'brand-img-07.jpg',
  12: 'brand-img-08.jpg',
  13: 'brand-img-09.jpg',
  46: 'brand-img-10.jpg',
  47: 'brand-img-11.jpg',
  48: 'brand-img-12.jpg',
  53: 'brand-img-13.jpg',
  55: 'brand-img-14.jpg',
  56: 'brand-img-15.jpg',
  66: 'brand-img-16.jpg',
  67: 'brand-img-17.jpg',
  68: 'brand-img-18.jpg',
}

export default function HomeBrandCard({
  product,
  successMsg,
  errorMsg,
  userCollect,
}) {
  const [isActive, setIsActive] = useState(false)

  const handleCardFooterClick = () => {
    if (window.innerWidth <= 768) {
      setIsActive(!isActive)
    }
  }

  useEffect(() => {
    // 在這裡可以進行其他初始化操作
  }, [userCollect])

  let calc_avg_rating = (
    Math.round(Number(product.avg_rating) * 10) / 10
  ).toFixed(1)

  // 根據產品ID獲取對應的圖片名稱
  const brandImage = productImageMap[product.product_id]

  return (
    <>
      <div className={styles.card}>
        <div className={styles.brandName}>{product.brand_name}</div>
        <div className={styles.icons}>
          <FavoriteBtn
            productId={product.product_id}
            successMsg={successMsg}
            errorMsg={errorMsg}
            userCollect={userCollect}
          />
        </div>
        <Link
          className={styles.tdn}
          href={`/rent/product_detail?id=${product.product_id}`}
        >
          <div className={styles.cardBody}>
            <Image
              className={styles.cardImg}
              layout="fill"
              objectFit="cover"
              src={`/home-img/${brandImage}`}
              alt={product.product_name}
            />
          </div>
          {/* 使用映射表中的圖片名稱來設定src屬性 */}
          <div className={styles.productImg}>
            <Image
              className={styles.cardImg}
              layout="fill"
              objectFit="cover"
              src={`/tian/image/${product.main_img}`}
              alt={product.product_name}
            />
          </div>
        </Link>
        <div
          className={`${styles.cardFooter} ${isActive ? styles.active : ''}`}
          onClick={handleCardFooterClick}
        >
          <div className={styles.showArea}>
            <div className={styles.cardTitle}>
              <p>{product.product_name}</p>
              <div className={styles.arrow}>
                <MdKeyboardControlKey />
              </div>
            </div>
            <div className={styles.arrowAndRating}>
              <div className={styles.category}>
                <div className={`${styles.tag} ${styles.tagBg1}`}>
                  {product.parent_name}
                </div>
              </div>
              <div className={styles.ratingWrapper}>
                <span className={styles.rating}>{calc_avg_rating}</span>
                <Rating
                  name="read-only"
                  value={parseFloat(calc_avg_rating)}
                  readOnly
                  precision={0.1}
                  sx={{
                    color: '#e49366',
                  }}
                />
                <span className={styles.commentCount}>
                  {product.total_comments} 則評論
                </span>
              </div>
            </div>
          </div>
          <div className={styles.hr} />
          <div className={styles.middleWrapper}>
            <div className={styles.middleInfo}>
              <span className={styles.money}>$ {`${product.price}`} / Day</span>
            </div>
            <div className={styles.arrow2}>
              <MdOutlineArrowOutward />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

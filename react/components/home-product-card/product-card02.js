import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './product-card02.module.css'
import Rating from '@mui/material/Rating'
import { MdKeyboardControlKey } from 'react-icons/md'
import { MdOutlineArrowOutward } from 'react-icons/md'
import FavoriteBtn from '@/components/favorite-btn/favorite-btn-product'

export default function ProductCard02({
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

  return (
    <>
      <div className={styles.cardGroup}>
        <div className={styles.icons}>
          <FavoriteBtn
            productId={product.product_id}
            successMsg={successMsg}
            errorMsg={errorMsg}
            userCollect={userCollect}
          />
        </div>
        <div className={styles.cardGroupWrap}>
          <div className={styles.card}>
            <Link
              className={styles.tdn}
              href={`/rent/product_detail?id=${product.product_id}`}
            >
              <div className={styles.cardBody}>
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
              className={`${styles.cardFooter} ${
                isActive ? styles.active : ''
              }`}
              onClick={handleCardFooterClick}
            >
              <div className={styles.showArea}>
                <div className={styles.cardTitle}>
                  <p>{product.product_name}</p>
                  <div className={styles.category}>
                    <div className={`${styles.tag} ${styles.tagBg1}`}>
                      {product.parent_name}
                    </div>
                    <div className={`${styles.tag} ${styles.tagBg2}`}>
                      {product.brand_name}
                    </div>
                  </div>
                </div>
                <div className={styles.arrowAndRating}>
                  <div className={styles.arrow}>
                    <MdKeyboardControlKey />
                  </div>
                </div>
              </div>
              <div className={styles.hr} />
              <div className={styles.middleWrapper}>
                <div className={styles.middleInfo}>
                  <span className={styles.money}>
                    $ {`${product.price}`} / Day
                  </span>
                </div>
                <div className={styles.arrow2}>
                  <MdOutlineArrowOutward />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardSide}>
            <Link
              className={styles.tdn}
              href={`/rent/product_detail?id=${product.product_id}`}
            >
              <div className={styles.cardSide1}>
                <div className={styles.arrWrap}>
                  <div className={styles.arrow2}>
                    <MdOutlineArrowOutward />
                  </div>
                </div>
                <div className={styles.ratingWrapper}>
                  <div className={styles.ratingStar}>
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
                  </div>
                  <span className={styles.commentCount}>
                    {' '}
                    {product.total_comments} 則評論
                  </span>
                </div>
              </div>
            </Link>
            <Link
              className={styles.tdn}
              href={`/rent/product_detail?id=${product.product_id}`}
            >
              <div className={styles.cardSide2}>本月精選</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

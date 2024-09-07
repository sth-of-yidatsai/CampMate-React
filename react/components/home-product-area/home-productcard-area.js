import React, { useRef, useEffect, useState } from 'react'
import styles from './home-productcard-area.module.css'
import ProductCard01 from '@/components/home-product-card/product-card01'
import ProductCard02 from '@/components/home-product-card/product-card02'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useAuthTest } from '@/hooks/use-auth-test'

export default function HomeProductcardArea() {
  const listRef = useRef()
  const [productsData, setProductsData] = useState([])
  const [userCollect, setUserCollect] = useState([])
  const { auth } = useAuthTest()

  const productIds = [
    1, 2, 3, 4, 5, 7, 9, 10, 11, 13, 14, 15, 16, 28, 29, 31, 38, 41,
  ]

  // 成功訊息使用
  const successMsg = (success) => {
    toast.success(success)
  }

  // 錯誤訊息使用
  const errorMsg = (error) => {
    toast.error(error)
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `http://localhost:3005/api/home/rent?ids=${productIds.join(',')}`
        )
        const data = await response.json()

        if (data.status === 'success') {
          setProductsData(data.product_data)
        } else {
          console.error('Failed to fetch products:', data.msg)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    async function fetchUserCollect(userId) {
      try {
        const response = await fetch(`http://localhost:3005/api/rent_collect/${userId}`)
        const data = await response.json()

        if (data.status === 'success') {
          setUserCollect(data.isCollect)
        } else {
          console.error('Failed to fetch user collection:', data.msg)
        }
      } catch (error) {
        console.error('Error fetching user collection:', error)
      }
    }

    fetchProducts()

    if (auth.isAuth) {
      fetchUserCollect(auth.userData.id)
    }
  }, [auth])

  const scroll = (direction) => {
    const { current } = listRef
    if (direction === 'left') {
      current.scrollBy({ left: -300, behavior: 'smooth' })
    } else {
      current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <span className={styles.h2}>熱門商品推薦。</span>
          現在就來看看有哪些露營好物。
        </h2>
      </div>
      <div className={styles.containerW100}>
        <div className={styles.wrapper}>
          <MdChevronLeft
            className={`${styles.arrow} ${styles.left}`}
            onClick={() => scroll('left')}
          />
          <div className={styles.mask}>
            <div className={styles.cardList} ref={listRef}>
              <div className={styles.cards}>
                {productsData[0] && (
                  <div className={styles.firstCard}>
                    <ProductCard01
                      product={productsData[0]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[1] && (
                  <div>
                    <ProductCard01
                      product={productsData[1]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[2] && (
                  <div>
                    <ProductCard01
                      product={productsData[2]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[3] && (
                  <div>
                    <ProductCard02
                      product={productsData[3]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[4] && (
                  <div>
                    <ProductCard01
                      product={productsData[4]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[5] && (
                  <div>
                    <ProductCard01
                      product={productsData[5]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[6] && (
                  <div>
                    <ProductCard01
                      product={productsData[6]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[7] && (
                  <div className={styles.lastCard}>
                    <ProductCard02
                      product={productsData[7]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
              </div>
              <div className={styles.cards}>
                {productsData[8] && (
                  <div className={styles.firstCard}>
                    <ProductCard02
                      product={productsData[8]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[9] && (
                  <div>
                    <ProductCard01
                      product={productsData[9]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[10] && (
                  <div>
                    <ProductCard01
                      product={productsData[10]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[11] && (
                  <div>
                    <ProductCard01
                      product={productsData[11]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[12] && (
                  <div>
                    <ProductCard02
                      product={productsData[12]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[13] && (
                  <div>
                    <ProductCard01
                      product={productsData[13]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[14] && (
                  <div>
                    <ProductCard01
                      product={productsData[14]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
                {productsData[15] && (
                  <div className={styles.lastCard}>
                    <ProductCard01
                      product={productsData[15]}
                      successMsg={successMsg}
                      errorMsg={errorMsg}
                      userCollect={userCollect}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <MdChevronRight
            className={`${styles.arrow} ${styles.right}`}
            onClick={() => scroll('right')}
          />
        </div>
      </div>
    </>
  )
}

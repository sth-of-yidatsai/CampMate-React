import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import styles from './home-product-area.module.css'
import HomeBrandCard from '@/components/home-product-card/home-brand-card'
import BrandTabBtn from './brand-tab-btn.js'
import toast from 'react-hot-toast'
import { useAuthTest } from '@/hooks/use-auth-test'

export default function HomeProductArea() {
  const [selectedBrand, setSelectedBrand] = useState(0)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [brands, setBrands] = useState([])
  const [userCollect, setUserCollect] = useState([]) // 添加用戶收藏狀態
  const { auth } = useAuthTest() // 引入用戶驗證信息

  const productIds = [
    1, 2, 3, 6, 7, 10, 11, 12, 13, 46, 47, 48, 53, 55, 56, 66, 67, 68,
  ] // 指定的產品ID

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
          const fetchedProducts = data.product_data

          // 將產品按品牌分組
          const groupedByBrand = fetchedProducts.reduce((brands, product) => {
            const brandName = product.brand_name
            if (!brands[brandName]) {
              brands[brandName] = {
                name: brandName,
                products: [],
              }
            }
            brands[brandName].products.push(product)
            return brands
          }, {})

          // 格式化為陣列
          setBrands(Object.values(groupedByBrand))
        } else {
          console.error('Failed to fetch products:', data.msg)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    async function fetchUserCollect(userId) {
      try {
        const response = await fetch(
          `http://localhost:3005/api/rent_collect/${userId}`
        )
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

  const handleBrandChange = (brandIndex) => {
    setSelectedBrand(brandIndex)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.containerFluid1}>
          <div className={styles.wrapArea}>
            <h2 className={styles.pageTitle}>
              <span className={styles.h2}>熱門品牌推薦。</span>
              現在就來看看有哪些好物。
            </h2>
            <div className={styles.cardGroup}>
              {isMobile
                ? brands.flatMap((brand) =>
                    brand.products.map((product) => (
                      <div key={product.product_id}>
                        <HomeBrandCard
                          product={product}
                          successMsg={successMsg}
                          errorMsg={errorMsg}
                          userCollect={userCollect}
                        />
                      </div>
                    ))
                  )
                : brands[selectedBrand]?.products.map((product) => (
                    <div key={product.product_id}>
                      <HomeBrandCard
                        product={product}
                        successMsg={successMsg}
                        errorMsg={errorMsg}
                        userCollect={userCollect}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
        {!isMobile && brands.length > 0 && (
          <div className={styles.containerFluid2}>
            {brands.map((brand, index) => (
              <BrandTabBtn
                key={index}
                logo={`/home-icons/${brand.name.replace(/\//g, '')}.png`}
                isActive={selectedBrand === index}
                onClick={() => handleBrandChange(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

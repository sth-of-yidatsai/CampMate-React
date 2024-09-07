import { useState, useEffect, useRef } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import CouponList from '@/components/coupon-list/coupon-list'
import CouponListTop from '@/components/coupon-list/coupon-list-top'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import ExpandButtonCoupon from '@/components/expand-button/expand-button-coupon'
import Top_btn from '@/components/tian/common/top_btn'
import styles from './coupon.module.css'

// 轉圈圈
import { FadeLoader } from 'react-spinners'

// RWD使用
import { useMediaQuery } from 'react-responsive'
// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})
const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})
const Aside = dynamic(() => import('@/components/template/sidebar'), {
  ssr: false,
})
const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})
const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})

const override = {
  display: 'block',
  margin: 'auto',
  marginTop: '50vh',
}

export default function CouponPage() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // 控制 ExpandButton 的可見性
  const [isVisible, setIsVisible] = useState(false)
  const couponListTopRef = useRef(null)

  // 加載狀態
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模擬加載效果
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 模擬2秒加載時間
  }, [])

  useEffect(() => {
    // 一進入頁面就顯示按鈕
    setIsVisible(true)

    const handleScroll = () => {
      if (couponListTopRef.current) {
        const { top } = couponListTopRef.current.getBoundingClientRect()
        // 當 CouponListTop 滾動進入視窗中間區域時顯示按鈕
        if (top < window.innerHeight && top > 0) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'COUPON', href: '/coupon' },
  ]

  const loader = (
    <FadeLoader
      color="#574426"
      loading={isLoading}
      cssOverride={override}
      size={30}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )

  return (
    <>
      <div className="body">
        {isLoading ? (
          loader
        ) : (
          <>
            {isDesktopOrLaptop && <Header />}
            {isTabletOrMobile && (
              <HeaderM
                labels={{
                  user: { userName: '王小明', userIcon: myIcon },
                  titles: [
                    {
                      lv1Name: 'Customer Center',
                      lv1Icon: <FaRegUser style={{ fill: '#413c1c' }} />,
                      titleLv2: null,
                    },
                    {
                      lv1Name: 'Rent',
                      lv1Icon: <MdOutlineChair style={{ fill: '#413c1c' }} />,
                      titleLv2: [
                        {
                          lv2Name: '帳篷',
                          lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                          titleLv3: [
                            '單/雙人',
                            '家庭',
                            '寵物',
                            '客廳帳/天幕',
                            '配件',
                            '其他',
                          ],
                        },
                        {
                          lv2Name: '戶外家具',
                          lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                          titleLv3: ['露營椅', '露營桌', '其他'],
                        },
                      ],
                    },
                    {
                      lv1Name: 'Ground',
                      lv1Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                      titleLv2: [
                        {
                          lv2Name: '營地主後台',
                          lv2Icon: <FaCampground style={{ fill: '#413c1c' }} />,
                          titleLv3: [],
                        },
                      ],
                    },
                  ],
                }}
              />
            )}
            <main
              style={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
              }}
            >
              <div className={styles.mainArea}>
                <div className={styles.breadcrumb}>
                  <Breadcrumb items={breadcrumbItems} />
                </div>
                <ExpandButtonCoupon isVisible={isVisible} />
                <div className={styles.wrap} ref={couponListTopRef}>
                  <CouponListTop />
                  <CouponList />
                  <Top_btn />
                </div>
              </div>
            </main>
            {isDesktopOrLaptop && <Footer />}
            {isTabletOrMobile && <FooterM />}
          </>
        )}
      </div>
    </>
  )
}

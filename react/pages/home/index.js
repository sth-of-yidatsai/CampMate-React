import React, { useState, useEffect } from 'react'
import { ScrollProvider } from '@/context/ScrollContext'
import SmoothScrollWrapper from '@/components/home-section/SmoothScrollWrapper'
import Scrollbar from '@/components/home-scrollbar/scrollbar'
import HomeTabbar from '@/components/home-search-area/home-tabbar/home-tabbar'
import styles from './home.module.css'
import Section01 from '@/components/home-section/section01'
import Section02g from '@/components/home-section/section02g'
import Section02p from '@/components/home-section/section02p'
import Section03g from '@/components/home-section/section03g'
import Section03p from '@/components/home-section/section03p'
import Section04 from '@/components/home-section/section04'
import Section05 from '@/components/home-section/section05'

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

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // 加載狀態

  const handleTabChange = (index) => {
    if (index !== selectedTab) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedTab(index)
        setIsTransitioning(false)
      }, 1000) // 動畫時間為1秒
    }
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false) // 模擬加載完成
    }, 2000) // 模擬2秒加載時間
  }, [])

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
                <ScrollProvider>
                  <div className={styles.homePage}>
                    <HomeTabbar onTabChange={handleTabChange} />
                    <SmoothScrollWrapper>
                      <Section01
                        selectedTab={selectedTab}
                        isTransitioning={isTransitioning}
                      />
                      {selectedTab === 0 ? <Section02g /> : <Section02p />}
                      {selectedTab === 0 ? <Section03g /> : <Section03p />}
                      <Section04 />
                      <Section05 />
                    </SmoothScrollWrapper>
                    <Scrollbar />
                  </div>
                </ScrollProvider>
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

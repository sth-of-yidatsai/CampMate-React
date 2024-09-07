import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CampgroundSidebar from '@/components/sidebar/campground-sidebar'
import InputBar2 from '@/components/inputbar/inputBar2'
import CampgroundListBanner from '@/components/carousel/campground-list-banner'
import Filter from '@/components/filter/filter'
import CampgroundCard from '@/components/card/campground-card'
import Pagination from '@/components/pagination/pagination'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'

// Tian 元件
import Product_banner from '@/components/tian/rent/product_banner'
import Top_btn from '@/components/tian/common/top_btn'

// 轉圈圈
import { FadeLoader } from 'react-spinners'
// 骨架
import Skeleton from '@mui/material/Skeleton'

// 使用的 context
import { useSearch } from '@/hooks/use-search'

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
  // borderColor: 'red',
}
// skeleton 5 個用
const items = [1, 2, 3, 4, 5]

export default function CampgroundList() {
  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'GROUND', href: '/campground/campground-list' },
  ]

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // Carousel
  const OPTIONS = { loop: true }
  const SLIDE_COUNT = 5
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

  // 定義的狀態
  const {
    searchValue,
    setSearchValue,
    calenderValue,
    timeDifference,
    setCalenderValue,
    handleFieldChange,
    people,
    setPeople,
    addPeople,
    minusPeople,
    nameLike,
    setNameLike,
    facility,
    setFacility,
    provide,
    setProvide,
    priceGte,
    setPriceGte,
    priceLte,
    setPriceLte,
    rating,
    setRating,
    campgroundInfo,
    setCampgroundInfo,
    total,
    setTotal,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    setTotalPages,
    sort,
    setSort,
    order,
    setOrder,
    eachComment,
    setEachComment,
    getCampgrounds,
    debounceGetCampgrounds,
    handleSearch,
    debounceHandleSearch,
    isLoading,
    setIsLoading,
    isSearching,
  } = useSearch()

  const router = useRouter()

  useEffect(() => {
    // setIsLoading(true)
    console.log('render router.query=', router.query)
  })

  useEffect(() => {
    setIsLoading(true)

    if (router.isReady) {
      console.log('search 這邊 fetch')
      // handleSearch()
      // if (router.query.nameLike !== '') {
      console.log(router.query.nameLike)
      const params = {
        name_like: nameLike,
        sort,
        order,
        facility,
        provide,
        priceGte,
        priceLte,
        rating,
        page: currentPage,
        perpage: itemsPerPage,
      }
      debounceGetCampgrounds(params)
      setIsLoading(false)
    }

    // 以下為省略eslint檢查一行
    // eslint-disable-next-line
  }, [router.isReady, 
    nameLike,
    sort,
    order,
    facility,
    provide,
    priceGte,
    priceLte,
    rating,
    currentPage,
  ])

  useEffect(() => {
    setIsLoading(true)
    setRating(0)
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.querySelector(`.filter`).offsetTop - 64, // 偏移?px
      left: 0,
      behavior: 'smooth', // 平滑滾動
    })
  }

  // // 計算現在在第幾頁
  // const startIndex = (currentPage - 1) * itemsPerPage
  // const currentCampground = campgroundInfo.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // )

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
      {isLoading ? (
        loader
      ) : (
        <div className="body">
          {isDesktopOrLaptop && <Header />}
          {/* 請按照下列格式填入需要的欄位 */}
          {isTabletOrMobile && (
            <HeaderM
              labels={{
                user: { userName: '王小明', userIcon: myIcon },
                titles: [
                  {
                    lv1Name: 'Customer Center',
                    lv1Icon: <FaRegUser style={{ fill: '#413c1c' }} />,
                    // 沒有lv2的話請填入null
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
              maxWidth: '1440px',
              margin: '48px auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginInline: '80px',
                width: '100%',
              }}
            >
              <CampgroundSidebar
                facility={facility}
                setFacility={setFacility}
                provide={provide}
                setProvide={setProvide}
                priceGte={priceGte}
                setPriceGte={setPriceGte}
                priceLte={priceLte}
                setPriceLte={setPriceLte}
                rating={rating}
                setRating={setRating}
                campgroundInfo={campgroundInfo}
                // allCampgroundInfo={allCampgroundInfo}
                setCurrentPage={setCurrentPage}
                total={total}
                setTotalPages={setTotalPages}
                sort={sort}
                setSort={setSort}
                order={order}
                setOrder={setOrder}
                eachComment={eachComment}
                nameLike={nameLike}
              />
              <div className="main" style={{ marginLeft: '15px' }}>
                <div className="bread-crumb">
                <Breadcrumb items={breadcrumbItems} />
                </div>
                <InputBar2 debounceHandleSearch={debounceHandleSearch} />
                <Product_banner />
                <div className="filter"></div>
                <Filter
                  total={total}
                  sort={sort}
                  setSort={setSort}
                  order={order}
                  setOrder={setOrder}
                  setCurrentPage={setCurrentPage}
                  isSearching={isSearching}
                />
                <div>
                  {isSearching ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                      }}
                    >
                      {items.map((v, i) => {
                        return (
                          <Skeleton
                            key={i}
                            animation="wave"
                            variant="rounded"
                            width={940}
                            height={226}
                            sx={{ borderRadius: '18px' }}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    campgroundInfo.map((camp, i) => {
                      return (
                        <CampgroundCard
                          key={i}
                          camp={camp}
                          eachComment={eachComment}
                        />
                      )
                    })
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  {campgroundInfo.length === 0 ? (
                    ''
                  ) : (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
          <Top_btn />
          {isDesktopOrLaptop && <Footer />}
          {isTabletOrMobile && <FooterM />}
        </div>
      )}
    </>
  )
}

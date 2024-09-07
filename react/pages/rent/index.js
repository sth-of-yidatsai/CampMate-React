import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

// 導入自訂的hook
import { useQuery } from '@/hooks/use-query'
import { useAuthTest } from '@/hooks/use-auth-test'

// RWD使用
import { useMediaQuery } from 'react-responsive'

import toast, { Toaster } from 'react-hot-toast'

import Search_Bar from '@/components/tian/rent/search_bar'

// 解決Hydration問題
import dynamic from 'next/dynamic'
const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})
const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const AsideAutoToggle = dynamic(
  () => import('@/components/tian/rent/sidebarAuroToggle'),
  {
    ssr: false,
  }
)

// 共同組件導入
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Search_bar from '@/components/tian/common/search_bar'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

import HotArea_card from '@/components/tian/rent/hotArea_card'
import Product_card from '@/components/tian/rent/product_card'
import Product_banner from '@/components/tian/rent/product_banner'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

export default function Product_home() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const router = useRouter()

  // 成功訊息使用
  const successMsg = (success) => {
    toast.success(success)
  }

  // 土司訊息使用 錯誤訊息使用
  const errorMsg = (error) => {
    toast.error(error)
  }

  const {
    filters,
    isRentHomePage,
    setIsRentHomePage,
    isDetailPage,
    setIsDetailPage,
    category,
    products,
    pageTitle,
    checkIsRentHomePage,
    handleQuery,
    queryParams,
    handleParams,
  } = useQuery()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
  ]

  // 處理要送進AsideAuroToggle的內容（大分類 小分類的資料）
  // 控制aside的大分類＆小分類
  const subLabel = function (parent_name) {
    return category
      .filter((child) => child.parent_name === parent_name)
      .map((child) => ({
        child_id: child.child_id, // 保留 id 作為 key
        child_name: child.child_name, // 渲染 child_name
      }))
  }

  const mainLabels = category
    .filter((cate) => cate.parent_icon !== null)
    .map((cate, i) => ({
      title: cate.child_name,
      icon: (
        <>
          <span key={i} className="material-symbols-outlined primary-text-tian">
            {cate.parent_icon}
          </span>
        </>
      ),
      subLabel: subLabel(cate.child_name),
    }))

  const [userCollect, setUserCollect] = useState([])

  // 查詢是否已經收藏 在頁面載入的時候就查詢
  const searchAddLike = async (id) => {
    console.log(id)
    const url = `http://localhost:3005/api/rent_collect/${id}`
    try {
      const res = await axios.get(url)

      const { status } = res.data
      if (status === 'success') {
        const { isCollect } = res.data
        console.log(isCollect)
        setUserCollect(isCollect)
      }
    } catch (err) {
      console.log(`查詢收藏失敗，錯誤訊息：${err}`)
    }
  }

  useEffect(() => {
    // 確認在哪個頁面
    const nowUrl = router.pathname
    if (nowUrl === '/rent') {
      setIsRentHomePage(true)
    } else {
      setIsRentHomePage(false)
      if (nowUrl === '/rent/product_list') {
      } else {
        if (nowUrl.split('?')[0] === '/rent/detail') {
          setIsDetailPage(true)
        } else {
          setIsDetailPage(false)
        }
      }
    }

    if (isRentHomePage) {
      console.log('初始化查詢 or 一般查詢')
      handleQuery()
    }
  }, [isRentHomePage])

  useEffect(() => {
    // console.log(`全商品查詢`)
    handleQuery()
  }, [queryParams])

  useEffect(() => {
    handleParams()
  }, [filters])

  useEffect(() => {
    if (auth.isAuth) {
      setUserId(auth.userData.id)
      searchAddLike(auth.userData.id)
    } else {
    }
  }, [auth])

  useEffect(() => {
    console.log(userCollect)
  }, [userCollect])

  return (
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

      <section className="mainArea-home-tian mainArea-tian">
        {/*## ↓↓↓↓ 側邊欄 ↓↓↓↓ */}
        {isDesktopOrLaptop && <AsideAutoToggle className="sidebar-tian" />}

        <main className="main-tian">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Breadcrumb items={breadcrumbItems} />

          {/* ↓↓↓↓ 搜尋欄（用珩宇的組件改） ↓↓↓↓ */}
          <Search_Bar />
          {/* ↑↑↑↑ 搜尋欄 ↑↑↑↑ */}

          {/* ↓↓↓↓ 廣告banner(用組件) ↓↓↓↓ */}
          <Product_banner />
          {/* ↑↑↑↑ 廣告banner ↑↑↑↑ */}
          <article className="productList-tian grid">
            <div className="listHeader d-flex justify-content-between align-items-end">
              {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
              <Page_title pageTitle={pageTitle} />
            </div>
            {/* ********************************************************** */}
            <div className="listBody">
              {/*## ↓↓↓↓ 熱門商品＆熱門品牌＆活動 ↓↓↓↓ */}
              <HotArea_card />
              {/*## ↓↓↓↓ 產品卡片 ↓↓↓↓ */}
              {products.length === 0 ? (
                <>
                  <p
                    style={{ width: '100%', height: '200px' }}
                    className="h5-tc sub-text-tian"
                  >
                    沒有符合的商品（這邊要放資料庫回應的訊息）。
                  </p>
                </>
              ) : (
                products.map((product, i) => {
                  return (
                    <Product_card
                      key={product.product_id}
                      product={product}
                      index={i}
                      errorMsg={errorMsg}
                      successMsg={successMsg}
                      userCollect={userCollect}
                    />
                  )
                })
              )}
            </div>
            {/* ********************************************************** */}
          </article>
        </main>
      </section>
      {isDesktopOrLaptop && <Footer />}
      {isTabletOrMobile && <FooterM />}

      {/* ↓↓↓↓ 回到頂部按鈕 ↓↓↓↓ */}
      <Top_btn />
      {/* ↑↑↑↑ 回到頂部按鈕 ↑↑↑↑ */}

      <Toaster />
    </>
  )
}

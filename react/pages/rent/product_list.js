import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import toast, { Toaster } from 'react-hot-toast'

// 小組共通組件 or 組員組件 or 組員改版組件（先使用看看是否需要處理hydration）
import Header from '@/components/template/header'
import AsideAutoToggle from '@/components/tian/rent/sidebarAuroToggle'
import Footer from '@/components/template/footer'
import Pagination from '@/components/pagination/pagination'
import Search_Bar from '@/components/tian/rent/search_bar'

// 個人製作的通用組件 或者 預先佔位的組件
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Search_bar from '@/components/tian/common/search_bar'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

// 此頁面專用的組件
import Product_card from '@/components/tian/rent/product_card'
import Product_banner from '@/components/tian/rent/product_banner'

//##<!-- ↑↑↑↑ 以上為import區域 ↑↑↑↑ -->
// **-------------------------------------------------------------
//##<!-- ↓↓↓↓ 以下為主要內容 ↓↓↓↓ -->

export default function Product_list() {
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
    items,
    handleAdd,
    handleDecrease,
    handleIncrease,
    handleRemove,

    totalPrice,
    totalQty,
  } = useRentcart()

  const {
    products, // 儲存query來的商品清單
    perPage, // 分頁用的狀態
    currentPage,
    setCurrentPage,
    totalPages,
    pageTitle,
    updateFiltersObj,
    originSort,
    setOriginSort,
    isRentHomePage,
    setIsRentHomePage,
    handleQuery,
    filters,
    queryParams,
    handleParams,
  } = useQuery()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
    { name: '商品列表', href: '/rent/product_list' },
  ]

  // 控制預覽方式 的狀態
  const [view, setView] = useState(true)

  //<!-- ↑↑↑↑ 需要在最前面宣告的 變數or狀態 放這邊 ↑↑↑↑ -->
  //-------------------------------------------------------------

  // 切換圖磚式＆列表式css 的狀態 用來開關用 (這個基本不會動它了)
  const handleGrid = () => {
    setView(true)
  }
  const handleList = () => {
    setView(false)
  }

  //-------------------------------------------------------------

  // 控制分頁用的函式
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      top: document.querySelector(`#listBody`).offsetTop - 100, // 偏移?px
      left: 0,
      behavior: 'smooth', // 平滑滾動
    })
  }

  const startIndex = (currentPage - 1) * perPage
  const pageProducts = products.slice(startIndex, startIndex + perPage)

  //-------------------------------------------------------------

  const transformSort = (e) => {
    let sortValue = e.target.value

    // 這邊將改變的sort值 設定進originSort之中
    setOriginSort(sortValue)

    let sort_name
    let sort_orderBy

    if (sortValue === 'none') {
      sort_name = ''
      sort_orderBy = ''
    } else if (sortValue === 'name_ASC' || sortValue === 'name_DESC') {
      const valueArr = sortValue.split('_')
      sort_name = `p.product_${valueArr[0]}`
      sort_orderBy = valueArr[1]
    } else {
      const valueArr = sortValue.split('_')
      sort_name = valueArr[0]
      sort_orderBy = valueArr[1]
    }

    // 將處理好的排序資訊設定進filters
    updateFiltersObj('sort', 'sort_name', sort_name)
    updateFiltersObj('sort', 'sort_orderBy', sort_orderBy)
  }

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
    const nowUrl = router.pathname
    console.log(router.pathname)
    if (nowUrl === '/rent') {
      setIsRentHomePage(true)
    } else {
      setIsRentHomePage(false)
    }

    if (!isRentHomePage) {
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
      // 登出時要設回空陣列
    }
  }, [auth])

  useEffect(() => {
    console.log(userCollect)
  }, [userCollect])

  //**-------------------------------------------------------------

  return (
    <>
      <Header />
      <section className="mainArea-list-tian mainArea-tian">
        {/*## ↓↓↓↓ 側邊欄 ↓↓↓↓ */}
        <AsideAutoToggle className="sidebar-tian" />
        <main className="main-tian">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Breadcrumb items={breadcrumbItems} />
          {/* ↓↓↓↓ 搜尋欄（用珩宇的組件改） ↓↓↓↓ */}
          <Search_Bar />
          {/* ↑↑↑↑ 搜尋欄 ↑↑↑↑ */}
          {/* ↓↓↓↓ 廣告banner(用組件) ↓↓↓↓ */}
          <Product_banner />
          {/* ↑↑↑↑ 廣告banner ↑↑↑↑ */}
          <article className="productList-tian">
            <div className="listHeader d-flex justify-content-between align-items-end">
              {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
              <Page_title pageTitle={pageTitle} />
              {/*## ↓↓↓↓ 排序＆瀏覽模式 ↓↓↓↓ */}
              <div className="viewMode d-flex align-items-center gap-3">
                <div className="sort">
                  <select
                    className="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                    name="sort"
                    // defaultValue={'none'}
                    value={originSort}
                    onChange={transformSort}
                  >
                    <option value={'none'} disabled>
                      排序條件
                    </option>
                    <option value={'price_DESC'}>價格：由高至低</option>
                    <option value={'price_ASC'}>價格：由低至高</option>
                    <option value={'name_ASC'}>名稱：由a至z</option>
                    <option value={'name_DESC'}>名稱：由z至a</option>
                  </select>
                </div>
                <div className="view d-flex">
                  <button
                    onClick={handleGrid}
                    className={`none-btn-tian material-symbols-outlined gridSwitch ${
                      view === true && 'active'
                    }`}
                  >
                    grid_view
                  </button>
                  <button
                    onClick={handleList}
                    className={`none-btn-tian material-symbols-outlined listSwitch ${
                      view === false && 'active'
                    }`}
                  >
                    view_list
                  </button>
                </div>
              </div>
            </div>
            {/* ********************************************************** */}
            <div
              className={`listBody products ${view === true ? 'grid' : 'list'}`}
              id="listBody"
            >
              {/*## ↓↓↓↓ 產品卡片 ↓↓↓↓ */}
              {/* 這邊設定一個條件 當products的內容是一個空陣列的時候 顯示對應的提示內容 */}
              {products.length === 0 ? (
                <>
                  <p style={{ width: '100%' }} className="h5-tc sub-text-tian">
                    沒有符合的商品。
                  </p>
                </>
              ) : (
                pageProducts.map((product, i) => {
                  return (
                    <Product_card
                      key={product.product_id}
                      product={product}
                      errorMsg={errorMsg}
                      successMsg={successMsg}
                      userCollect={userCollect}
                    />
                  )
                })
              )}
            </div>
            {/* ********************************************************** */}
            {/* ↓↓↓↓ 分頁標籤（用易達做的組件） ↓↓↓↓ */}
            {/* 當分頁有超過一頁的時候才顯示分頁組件 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* ↑↑↑↑ 分頁標籤 ↑↑↑↑ */}
          </article>
        </main>
      </section>
      <Footer />
      {/* ↓↓↓↓ 回到頂部按鈕 ↓↓↓↓ */}
      <Top_btn />
      {/* ↑↑↑↑ 回到頂部按鈕 ↑↑↑↑ */}

      <Toaster />
    </>
  )
}

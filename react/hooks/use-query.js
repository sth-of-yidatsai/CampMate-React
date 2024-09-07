import { createContext, useState, useContext, useEffect } from 'react'

import { useRentcart } from './use-rentcart'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useRouter } from 'next/router'
import axios from 'axios'

const QueryContext = createContext(null)

// const formatDate = (date) => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1 // 月份從 0 開始，需要 +1
//   const day = date.getDate()

//   // 格式化日期，僅在需要時添加前導零
//   const monthFormatted = month < 10 ? month : month
//   const dayFormatted = day < 10 ? day : day

//   return `${year}-${monthFormatted}-${dayFormatted}`
// }

//**--------------------------------------------------------------

export default function QueryProvider({ children }) {
  const { cleanItems } = useRentcart() || {}

  // 導頁面用的
  const router = useRouter()

  //---------------------------------------------------------

  // 是否位於rent首頁的狀態
  const [isRentHomePage, setIsRentHomePage] = useState(false)

  const [isSetCalendar, setIsSetCalendar] = useState(false)

  // 儲存準備要送給後端的資料
  const [queryParams, setQueryParams] = useState({
    keyword: '',
    sort_name: '',
    sort_orderBy: '',
    category: '',
    brand: [],
    people: [],
    functional: [],
    material: [],
    price: [],
    priceGte: '',
    priceLte: '',
    isRentHomePage: '',
  })

  const [queryIdParams, setQueryIdParams] = useState({})

  // get資料的存放
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])
  const [tags, setTags] = useState([])

  // 存放錯誤訊息
  const [error, setError] = useState(null)

  //##<!-- ↓↓↓↓ 查詢單一商品的狀態 ↓↓↓↓ -->

  const [productId, setProductId] = useState('')

  const [singleProduct, setSingleProduct] = useState([])
  const [shops, setShops] = useState([])
  const [users, setUsers] = useState([])

  const [mainPic, setMainPic] = useState([])
  const [devPic, setDevPic] = useState([])
  const [desPic, setDesPic] = useState([])

  const [styles, setStyles] = useState([])
  const [sizes, setSizes] = useState([])
  const [price, setPrice] = useState([])
  const [comment, setComment] = useState([])

  //##<!-- ↑↑↑↑ 查詢單一商品的狀態 ↑↑↑↑ -->

  const [shopValue, setShopValue] = useState('')

  //##<!--------- ↓↓↓↓ 放置所有篩選條件狀態 ↓↓↓↓ --------->

  const [originSort, setOriginSort] = useState('none')

  const [livePrice, setLivePrice] = useState([])

  const [liveTag, setLiveTag] = useState({
    brand: [],
    people: [],
    functional: [],
    material: [],
    price: [],
  })

  // 所有查詢篩選都儲存在這邊
  const [filters, setFilters] = useState({
    keyword: '',
    sort: {
      sort_name: '',
      sort_orderBy: '',
    },
    category: '',
    tag: {
      brand: [],
      people: [],
      functional: [],
      material: [],
      price: [],
    },
    price: {
      priceGte: '',
      priceLte: '',
    },
  })

  // 用來更改keyword category這樣的值
  const updateFilters = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }))
  }

  const cleanAllTag = () => {
    updateFiltersObj('tag', 'brand', [])
    updateFiltersObj('tag', 'people', [])
    updateFiltersObj('tag', 'functional', [])
    updateFiltersObj('tag', 'material', [])
    updateFiltersObj('tag', 'price', [])
  }

  // 這個目前還用不到 用來新增物件中的指定屬性中的陣列值
  const toggleFiltersArr = (key, value) => {
    setFilters((prevFilters) => {
      const currentArray = prevFilters[key]

      if (currentArray.includes(value)) {
        return {
          ...prevFilters,
          [key]: [...prevFilters[key].filter((item) => item != value)],
        }
      } else {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [key]: [...prevFilters[key], value],
        }))
      }
    })
  }

  // 用來更改 sort、price 這種物件中指定屬性中 第二指定屬性中的值
  const updateFiltersObj = (KEY, key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [KEY]: {
        ...prevFilters[KEY],
        [key]: value,
      },
    }))
  }

  // 用來新增或者刪除 tag 這種物件中指定屬性中 第二指定屬性中的陣列值
  const toggleFiltersObjArr = (KEY, key, value) => {
    setFilters((prevFilters) => {
      const currentArray = prevFilters[KEY][key]
      // 檢查值是否已經存在於陣列中
      if (currentArray.includes(value)) {
        // 如果存在，則過濾掉該值
        return {
          ...prevFilters,
          [KEY]: {
            ...prevFilters[KEY],
            [key]: currentArray.filter((item) => item !== value),
          },
        }
      } else {
        // 如果不存在，則添加該值
        return {
          ...prevFilters,
          [KEY]: {
            ...prevFilters[KEY],
            [key]: [...currentArray, value],
          },
        }
      }
    })
  }

  const addFiltersObjArr = (KEY, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [KEY]: value,
    }))
  }

  // 清除所有篩選
  const resetFilters = () => {
    setFilters({
      keyword: '',
      sort: {
        sort_name: '',
        sort_orderBy: '',
      },
      category: '',
      tag: {
        brand: [],
        people: [],
        functional: [],
        material: [],
        price: [],
      },
      price: {
        priceGte: '',
        priceLte: '',
      },
    })
  }

  // ## <!-- ↑↑↑↑ 放置所有篩選條件狀態 ↑↑↑↑ -->

  // 篩選價格的控制
  const [priceGte, setPriceGte] = useState(0)
  const [priceLte, setPriceLte] = useState(2500)

  // 儲存所有要送進 AsideAutoToggle 的內容
  const [mainLabel, setMainLabel] = useState([])

  //---------------------------------------------------------------

  // 設定頁面標題 的狀態
  const [pageTitle, setPageTitle] = useState({
    title: '',
    subTitle: '',
  })

  //---------------------------------------------------------------

  // 分頁功能的控制（屬於前端分頁）
  const [perPage, setPerPage] = useState(15)
  const [currentPage, setCurrentPage] = useState(1) // 當前頁數
  const [totalPages, setTotalPages] = useState(1) // 總頁數

  //---------------------------------------------------------------

  // ## 日曆相關

  // 改用MySwal取代Swal
  const MySwal = withReactContent(Swal)

  const checkChangeCalendar = () => {
    MySwal.fire({
      title: '確定要修改租賃時段嗎?',
      text: '修改租賃時段會清空目前的購物車內容，你確定要修改嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已修改!',
          text: '已設定新的租賃時段！',
          icon: 'success',
        })
        // 如果確定 就將calenderValue設定進入 sessionStorage
        if (calenderValue !== '請選擇時段' && calenderValue.length > 10) {
          sessionStorage.setItem('timeRange', calenderValue)
          cleanItems()
        }
      } else {
        setCalenderValue(sessionStorage.getItem('timeRange'))
      }
    })
  }

  const calendarCheck = () => {
    if (
      localStorage.getItem('rent_cart') &&
      localStorage.getItem('rent_cart') != '[]'
    ) {
      console.log(localStorage.getItem('rent_cart'))
      const rentCart = JSON.parse(localStorage.getItem('rent_cart'))

      const time_range = [rentCart[0].start_time, rentCart[0].end_time]

      console.log(time_range.join('~'))
      setCalenderValue(time_range.join('~'))
      sessionStorage.setItem('timeRange', time_range.join('~'))
      // console.log(time_range)
    }

    if (calenderValue === '請選擇時段') {
      if (sessionStorage.getItem('timeRange')) {
        setCalenderValue(sessionStorage.getItem('timeRange'))
      } else {
        sessionStorage.setItem('timeRange', '請選擇時段')
      }
    }
    if (
      calenderValue !== '請選擇時段' &&
      calenderValue.length > 10 &&
      sessionStorage.getItem('timeRange') !== '請選擇時段' &&
      calenderValue !== sessionStorage.getItem('timeRange')
    ) {
      checkChangeCalendar()
      return
    }
    if (calenderValue !== '請選擇時段' && calenderValue.length > 10) {
      sessionStorage.setItem('timeRange', calenderValue)
    }
  }

  const [calenderValue, setCalenderValue] = useState('請選擇時段')

  //---------------------------------------------------------------

  const checkChangeShop = () => {
    MySwal.fire({
      title: '確定要修改取貨店鋪嗎?',
      text: '修改取貨店鋪會清空目前的購物車內容，你確定要修改嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已修改!',
          text: '已設定新的取貨店鋪！',
          icon: 'success',
        })
        // 如果確定 就將calenderValue設定進入 sessionStorage
        if (shopValue !== '') {
          sessionStorage.setItem('shopId', shopValue)
          cleanItems()
        }
      } else {
        setShopValue(sessionStorage.getItem('shopId'))
      }
    })
  }

  const shopCheck = () => {
    if (shopValue === '') {
      if (sessionStorage.getItem('shopId')) {
        setShopValue(sessionStorage.getItem('shopId'))
      } else {
        sessionStorage.setItem('shopId', '')
      }
    }
    if (shopValue !== '' && sessionStorage.getItem('shopId') === '') {
      sessionStorage.setItem('shopId', shopValue)
      return
    }

    if (
      shopValue !== '' &&
      sessionStorage.getItem('shopId') !== '' &&
      sessionStorage.getItem('shopId') !== shopValue
    ) {
      checkChangeShop()
      return
    }

    if (shopValue !== '' && sessionStorage.getItem('shopId') === shopValue) {
      return
    }

    if (sessionStorage.getItem('shopId')) {
      // 馬上將sessionStorage的店id 設定進shopValue
      setShopValue(sessionStorage.getItem('shopId'))
    }
  }

  //---------------------------------------------------------------

  // 每次查詢完就生成一次頁面標題
  const changePageTitle = () => {
    const pageTitle = () => {
      if (isRentHomePage) {
        return {
          title: `露營用品租賃。`,
          subTitle: '輕鬆露營，隨租隨行。',
        }
      }
      if (queryParams.category && queryParams.category !== '') {
        const cate = category.filter(
          (cate) => cate.child_id == queryParams.category
        )
        const cateNum = products.length

        return {
          title: `${cate[0].child_name}。`,
          subTitle: `此分類共 ${cateNum} 項商品。`,
        }
      }
      if (queryParams.keyword && queryParams.keyword !== '') {
        const searchNum = products.length

        return {
          title: `"${queryParams.keyword}" 的搜尋結果。`,
          subTitle: `搜尋到 ${searchNum} 項商品。`,
        }
      }
      return {
        title: `露營用品租賃。`,
        subTitle: '輕鬆露營，隨租隨行。',
      }
    }

    setPageTitle(pageTitle)
  }

  //---------------------------------------------------------------

  // ## 導頁的函式
  // 導向product_list
  const goToList = () => {
    // 判斷目前是否在product_list頁面 不是才導頁（因為會用在search_bar組件）
    if (router.pathname === `/rent/product_list`) {
      return
    }
    router.push(`/rent/product_list`)
  }

  //---------------------------------------------------------------

  const handleParams = () => {
    // if (isRentHomePage) {
    //   // resetFilters()
    // }

    console.log(isRentHomePage)

    const { keyword, sort, category, tag, price } = filters

    setQueryParams({
      keyword,
      sort_name: sort.sort_name,
      sort_orderBy: sort.sort_orderBy,
      category,
      brand: tag.brand,
      people: tag.people,
      functional: tag.functional,
      material: tag.material,
      price: tag.price,
      priceGte: price.priceGte,
      priceLte: price.priceLte,
      isRentHomePage,
    })
  }

  //---------------------------------------------------------------

  // 按下搜尋按鈕
  const handleQuery = () => {
    getProducts(queryParams)
    // 每次搜尋結束(fecth資料也完成後) 就將頁數回復到第1頁
    setCurrentPage(1)
  }

  //---------------------------------------------------------------

  // 向後端寫的api fetch資料
  // 取得所有商品資料（加上篩選）
  const getProducts = async (queryParams = {}) => {
    const initUrl = `http://localhost:3005/api/rent_product`
    let finalUrl

    if (!queryParams) {
      finalUrl = `${initUrl}`
    } else {
      const paramsUrl = new URLSearchParams(queryParams)
      finalUrl = `${initUrl}?${paramsUrl}`
    }

    await axios
      .get(finalUrl)
      .then((res) => {
        const tags_rows = res.data.tags_data
        const products_rows = res.data.products_data
        // 這個有機會要拆出去
        const category_rows = res.data.categorys_data
        const status = res.data.status

        if (!tags_rows || tags_rows.length === 0) {
          console.log('tags_rows：向後端要求資料失敗或無數據！！')
        }
        if (!category_rows || category_rows.length === 0) {
          console.log('category_rows：向後端要求資料失敗或無數據！！')
        }
        if (!products_rows || products_rows.length === 0) {
          console.log('products_rows：向後端要求資料失敗或無數據！！')
          setProducts([])
          setTotalPages(1)
          setPageTitle({
            title: `無搜尋結果。`,
            subTitle: '',
          })
          return
        }

        // 把查詢的結果儲存進狀態中
        setTags(tags_rows)
        setCategory(category_rows)
        setProducts(products_rows)

        // 重新設定頁面標題
        changePageTitle()

        // 設定總頁數
        setTotalPages(Math.ceil(products_rows.length / perPage))
      })
      .catch((err) => {
        console.log(`Axios錯誤訊息：${err}`)
        setError(`Axios錯誤訊息：${err}`)

        setTags([])
        setCategory([])
        setProducts([])

        setTotalPages(1)
      })
  }

  // 取得單一商品資料
  const getProduct = async () => {
    let id
    if (!productId) {
      id = sessionStorage.getItem('detailId')
    } else {
      id = productId
    }

    const initUrl = `http://localhost:3005/api/rent_product`

    const paramsUrl = new URLSearchParams(queryIdParams)
    const finalUrl = `${initUrl}/${id}?${paramsUrl}`

    await axios
      .get(finalUrl)
      .then((res) => {
        const {
          status,
          shops_rows,
          product_row,
          main_pic,
          dev_pic,
          des_pic,
          styles,
          sizes,
          price,
          comment,
          users,
        } = res.data

        if (status === 'success') {
          const [singleProduct] = product_row
          setSingleProduct(singleProduct)
          setShops(shops_rows)
          setMainPic(main_pic)
          setDevPic(dev_pic)
          setDesPic(des_pic)
          setStyles(styles)
          setSizes(sizes)
          setPrice(price)
          setComment(comment)
          setUsers(users)
        } else {
          console.log('向後端獲取單一商品資料錯誤！！')
        }
      })
      .catch((err) => {
        console.log(`Axios錯誤訊息：${err}`)
        setError(`Axios錯誤訊息：${err}`)
      })
  }

  //---------------------------------------------------------------

  useEffect(() => {
    // console.log('初始化查詢 or 一般查詢')
    // handleQuery()
  }, [])

  // useEffect(() => {
  //   // console.log(`全商品查詢`)
  //   handleQuery()
  // }, [queryParams])

  // useEffect(() => {
  //   handleParams()
  // }, [filters])

  useEffect(() => {
    if (isRentHomePage) {
      resetFilters()
      setLivePrice([])
      setLiveTag({
        brand: [],
        people: [],
        functional: [],
        material: [],
        price: [],
      })
      setOriginSort('none')
      setPriceGte(0)
      setPriceLte(2500)
      return
    }
    changePageTitle()
  }, [isRentHomePage])

  // ## 控制aside的大分類＆小分類（當category更新時，就會啟用）
  useEffect(() => {
    if (category && category.length > 0) {
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
              <span
                key={i}
                className="material-symbols-outlined primary-text-tian"
              >
                {cate.parent_icon}
              </span>
            </>
          ),
          subLabel: subLabel(cate.child_name),
        }))

      setMainLabel(mainLabels)
    }
  }, [category])

  // useEffect(() => {
  //   // console.log(`單一商品查詢`)
  //   getProduct(queryIdParams)
  // }, [queryIdParams])

  // useEffect(() => {
  //   getProduct()
  // }, [productId])

  useEffect(() => {
    shopCheck()
  }, [shopValue])

  useEffect(() => {
    calendarCheck()
  }, [calenderValue])

  //---------------------------------------------------------------

  return (
    <QueryContext.Provider
      value={{
        // fetch資料用的函式
        getProducts,
        getProduct,
        products, // 儲存query來的商品清單
        setProducts,
        category, // 儲存query來的分類清單（也許可以拆去別的地方）
        setCategory,
        tags,
        setTags,
        queryParams,
        setQueryParams,
        // 查詢單一商品用
        productId,
        setProductId,
        singleProduct,
        setSingleProduct,
        shops,
        setShops,
        shopValue,
        setShopValue,
        queryIdParams,
        setQueryIdParams,
        devPic,
        setDevPic,
        desPic,
        setDesPic,
        mainPic,
        setMainPic,
        styles,
        setStyles,
        sizes,
        setSizes,
        price,
        setPrice,
        comment,
        setComment,
        users,
        setUsers,
        // 日曆用
        calenderValue,
        setCalenderValue,
        // 確認是否在首頁
        isRentHomePage,
        setIsRentHomePage,
        // 月曆是否已經設定用
        isSetCalendar,
        setIsSetCalendar,
        // 分頁用的狀態
        perPage,
        setPerPage,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        // 分類aside的狀態
        mainLabel,
        setMainLabel,
        // 頁面標題
        pageTitle,
        setPageTitle,
        // 價格範圍
        priceGte,
        setPriceGte,
        priceLte,
        setPriceLte,
        // 所有篩選條件
        filters,
        setFilters,
        liveTag,
        setLiveTag,
        livePrice,
        setLivePrice,
        originSort,
        setOriginSort,
        // 函式區
        handleQuery,
        handleParams,
        updateFilters,
        toggleFiltersArr,
        updateFiltersObj,
        toggleFiltersObjArr,
        addFiltersObjArr,
        cleanAllTag,
        resetFilters,
        // 導頁用
        goToList,
      }}
    >
      {children}
    </QueryContext.Provider>
  )
}

// 3. 建立一個包裝useContext的useQuery
export const useQuery = () => useContext(QueryContext)

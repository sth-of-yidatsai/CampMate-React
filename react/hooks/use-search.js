import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import _ from 'lodash'
import { useRouter } from 'next/router'

const SearchContext = createContext(null)
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份從 0 開始，需要 +1
  const day = date.getDate()

  // 格式化日期，僅在需要時添加前導零
  const monthFormatted = month < 10 ? month : month
  const dayFormatted = day < 10 ? day : day

  return `${year}-${monthFormatted}-${dayFormatted}`
}

export default function SearchProvider({ children }) {
  const today = new Date()

  // 獲取今天的日期
  const todayFormatted = formatDate(today)

  // 獲取明天的日期
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tomorrowFormatted = formatDate(tomorrow)
  const [searchValue, setSearchValue] = useState({
    keyword: '',
  })

  const [people, setPeople] = useState(1)
  const [calenderValue, setCalenderValue] = useState(
    todayFormatted + '~' + tomorrowFormatted
  )

  const handleFieldChange = (e) => {
    console.log(e.target.type, e.target.name, e.target.value)
    setSearchValue({ ...searchValue, [e.target.name]: e.target.value })
  }

  const addPeople = () => {
    if (people <= 9) {
      setPeople(people + 1)
    }
  }

  const minusPeople = () => {
    if (people > 1) {
      setPeople(people - 1)
    }
  }

  const [startDateStr, endDateStr] = calenderValue.split('~')

  // 创建 Date 对象
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  // 计算时间差（毫秒）
  let timeDifference
  if (isNaN((endDate - startDate) / (1000 * 60 * 60 * 24))) {
    timeDifference = 1
  } else {
    timeDifference = (endDate - startDate) / (1000 * 60 * 60 * 24)
  }

  // --------------------- test 跨頁搜尋------------------------------

  // 確認是否進行第一次查詢
  // const [isSearched, setIsSearched] = useState(false)
  // 查詢條件用(這裡用的初始值都與伺服器的預設值一致)
  const [nameLike, setNameLike] = useState('')
  const [facility, setFacility] = useState([]) // 字串陣列
  const [provide, setProvide] = useState([]) // 字串陣列
  const [priceGte, setPriceGte] = useState(0)
  const [priceLte, setPriceLte] = useState(10000)
  const [rating, setRating] = useState(0)

  // fetch 後的資料狀態
  const [campgroundInfo, setCampgroundInfo] = useState([])
  const [allCampgroundInfo, setAllCampgroundInfo] = useState([])

  // 比數狀態
  const [total, setTotal] = useState(0) // 總筆數

  // 分頁用
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 排序
  const [sort, setSort] = useState('id')
  const [order, setOrder] = useState('asc')

  // 每筆的評論數
  const [eachComment, setEachComment] = useState([])

  const [error, setError] = useState(null)

  // 設置 Loading 判斷
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const getCampgrounds = async (params = {}) => {
    const apiURL = 'http://localhost:3005/api/campground'
    setIsSearching(true)
    // 轉換params為查詢字串
    const searchParams = new URLSearchParams(params)
    const qs = searchParams.toString()
    const url = `${apiURL}?${qs}`
    await fetch(url) // 根據實際情況調整 API 地址
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setEachComment(data.data.eachComment)
        setTotal(data.data.total)
        setTotalPages(data.data.pageCount)
        // 設定到狀態中 ===> 進入update階段，觸發重新渲染(re-render)，呈現資料
        // 確定資料是陣列資料類型才設定到狀態中(最基本的保護)
        if (Array.isArray(data.data.campgrounds)) {
          setCampgroundInfo(data.data.campgrounds)
        }
        // if (Array.isArray(data.data.without_page_campgrounds)) {
        //   setAllCampgroundInfo(data.data.without_page_campgrounds)
        // }

        const allCamps = data.data.campgrounds
        // setTotalPages(Math.ceil(allCamps.length / itemsPerPage))
        setCampgroundInfo(allCamps)

        // 加載動畫 1.5 秒
        setTimeout(() => {
          setIsLoading(false)
          setIsSearching(false)
        }, 1500)
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error)
        setError(error.message)
        setIsLoading(false)
      })
  }

  // 按下搜尋按鈕

  const router = useRouter()
  const changeRoute = () => {
    router.push(`/campground/campground-list?nameLike=${searchValue.keyword}`)
  }
  const debounceChangeRoute = useCallback(_.debounce(changeRoute, 1200), [])
  const handleSearch = () => {
    // 每次搜尋條件後，因為頁數和筆數可能不同，所以要導向第1頁
    console.log('search')
    setNameLike(searchValue.keyword)
    setCurrentPage(1)
    debounceChangeRoute()
  }
  const debounceGetCampgrounds = useCallback(
    _.debounce(getCampgrounds, 1200),
    []
  )
  const debounceHandleSearch = useCallback(_.debounce(handleSearch, 1200), [])

  // 按下搜尋按鈕
  const handleJump = (area) => {
    // 每次搜尋條件後，因為頁數和筆數可能不同，所以要導向第1頁
    // setCurrentPage(1)

    setNameLike(area)
    setSearchValue((searchValue) => ({ ...searchValue, keyword: area }))
    router.push(`/campground/campground-list?nameLike=${area}`)
  }

  // map
  let northern = { lat: 24.8, lng: 121.3 }
  let central = { lat: 23.66427, lng: 120.75427 }
  let southern = { lat: 23.56427, lng: 120.75427 }
  let eastern = { lat: 23.8, lng: 121.4 }
  //test google

  const [position, setPosition] = useState({ lat: 23.8, lng: 121.4 })

  function handleCamera() {
    if (nameLike === '北部') {
      setPosition(northern)
    } else if (nameLike === '中部') {
      setPosition(central)
    } else if (nameLike === '南部') {
      setPosition(southern)
    } else if (nameLike === '東部') {
      setPosition(eastern)
    }
  }
  useEffect(() => {
    handleCamera()
  }, [nameLike])

  return (
    <SearchContext.Provider
      value={{
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
        handleJump,
        position,
        setPosition,
        handleCamera,
        debounceHandleSearch,
        isLoading,
        setIsLoading,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

// 3. 建立一個包裝useContext的useAuth
export const useSearch = () => useContext(SearchContext)

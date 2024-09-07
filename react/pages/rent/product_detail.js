import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { useRouter } from 'next/router'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useRentCalendar } from '@/hooks/use-calendar'
import { useAuthTest } from '@/hooks/use-auth-test'

import toast, { Toaster } from 'react-hot-toast'

import Header from '@/components/template/header'
import Footer from '@/components/template/footer'

// 共同組件導入
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Page_tab from '@/components/tian/common/page_tab'
import Top_btn from '@/components/tian/common/top_btn'
import Calendar from '@/components/tian/rent/calender'

// 頁面組件導入
import Product_title from '@/components/tian/rent/product_title'
import Info_tab from '@/components/tian/rent/info_tab'
import LightBox from '@/components/tian/rent/lightBox'
import Rank from '@/components/tian/rent/rank'
import Rank_chart from '@/components/tian/rent/rank_chart'
import Comment_card from '@/components/tian/rent/comment_card'

// 外掛組件導入
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { ClimbingBoxLoader } from 'react-spinners'

export default function Product_detail() {
  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const router = useRouter()
  const { id } = router.query

  const { handleAdd, items, setItems } = useRentcart()

  const {
    calenderValue,
    setCalenderValue,
    singleProduct,
    productId,
    setProductId,
    shops,
    shopValue,
    setShopValue,
    desPic,
    styles,
    sizes,
    price,
    queryIdParams,
    setIsRentHomePage,
    comment,
    isSetCalendar,
    setIsSetCalendar,
    getProduct,
  } = useQuery()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
    {
      name: `${singleProduct?.product_name}`,
      href: `/rent/product_detail?id=${singleProduct?.product_id}`,
    },
  ]

  const [styleValue, setStyleValue] = useState('')
  const [sizeValue, setSizeValue] = useState('')

  // For Calender
  const [isopenCalender, setIsOpenCalender] = useState(false)
  const toggleCalender = () => setIsOpenCalender(!isopenCalender)
  const openCalender = () => setIsOpenCalender(true)
  const closeCalender = () => setIsOpenCalender(false)

  const calenderRef = useRef(null)
  const triggerRef = useRef(null)

  //----------------------------------------------------------------

  const handleShopTrans = (value) => {
    setItems((preItems) => {
      return preItems.map((v, i) => {
        return {
          ...v,
          shop_id: value,
        }
      })
    })
  }

  const handleSetShop = (e) => {
    setShopValue(e.target.value)
    if (e.target.value !== '' && sessionStorage.getItem('shopId') === '') {
      console.log('有進來這邊嗎')
      handleShopTrans(e.target.value)
      return
    }
  }

  //----------------------------------------------------------------

  const [priceValue, setPriceValue] = useState('')

  // 計算最大值以及最小值
  let priceRange

  const handlePriceRange = (items) => {
    const { maxPrice, minPrice } = items.reduce(
      (acc, item) => {
        if (item.product_price > acc.maxPrice) acc.maxPrice = item.product_price
        if (item.product_price < acc.minPrice) acc.minPrice = item.product_price
        return acc
      },
      { maxPrice: -Infinity, minPrice: Infinity }
    )
    priceRange = { maxPrice, minPrice }
  }

  if (styles.length > 0) {
    handlePriceRange(styles)
  } else if (sizes.length > 0) {
    handlePriceRange(sizes)
  }

  // 土司訊息使用 錯誤訊息使用
  const errorMsg = (error) => {
    toast.error(error)
  }

  // 成功訊息使用
  const successMsg = (success) => {
    toast.success(success)
  }

  const handleTrans = (e) => {
    if (!auth.isAuth) {
      const msg = '請先登入'
      errorMsg(msg)
      return
    }

    if (count == 0) {
      const msg = '請先選擇商品數量'
      errorMsg(msg)
      return
    }

    if (calenderValue === '請選擇時段') {
      const msg = '請先選擇租賃時段'
      errorMsg(msg)
      return
    }

    if (count > 0) {
      let userId = 1
      let timeRange = sessionStorage.getItem('timeRange')
      let start = timeRange.split('~')[0]
      let end = timeRange.split('~')[1]

      let currentDateTime = new Date().toISOString()

      let sendItem = {
        user_id: userId,
        shop_id: sessionStorage.getItem('shopId'),
        product_id: singleProduct.product_id,
        product_name: singleProduct.product_name,
        main_img: singleProduct.main_img,
        price_id: '',
        price: '',
        style: '',
        size: '',
        start_time: start,
        end_time: end,
        create_datetime: currentDateTime,
        checked: false,
        qty: count,
      }

      // console.log(sendItem)

      if (styles.length > 0) {
        if (!styleValue) {
          const msg = `請先選擇顏色`
          errorMsg(msg)
          return
        }

        console.log(styleValue)

        if (styleValue) {
          sendItem = { ...sendItem, price_id: styleValue }

          let priceItems = styles.find((item, i) => item.price_id == styleValue)

          // console.log(priceItems)

          sendItem = {
            ...sendItem,
            price: priceItems.product_price,
            style: priceItems.style_name,
          }

          // console.log(sendItem)
        } else {
          sendItem = {
            ...sendItem,
            price_id: styles[0].price_id,
            price: styles[0].product_price,
          }
        }
      } else if (sizes.length > 0) {
        if (!sizeValue) {
          const msg = `請先選擇尺寸`
          errorMsg(msg)
          return
        }

        console.log(sizeValue)

        if (sizeValue) {
          sendItem = { ...sendItem, price_id: sizeValue }
          let priceItems = sizes.find((item, i) => item.price_id === sizeValue)
          sendItem = {
            ...sendItem,
            price: priceItems.product_price,
            size: priceItems.size_name,
          }
        } else {
          sendItem = {
            ...sendItem,
            price_id: sizes[0].price_id,
            price: sizes[0].product_price,
          }
        }
      } else {
        // console.log(`價錢${price[0].price_id}`)
        sendItem = {
          ...sendItem,
          price_id: price[0].price_id,
          price: price[0].product_price,
        }
      }
      // console.log(`看一下sendItem裏面${JSON.stringify(sendItem)}`)
      handleAdd(sendItem)

      const msg = `成功加入購物車！`
      successMsg(msg)

      if (e.currentTarget.classList.contains('book')) {
        router.push(`/rent_cart`)
      }
    }
  }

  //----------------------------------------------------------------

  // 商品選擇數量的變數
  const [count, setCount] = useState(0)
  const handlePlus = () => {
    setCount(count + 1)
  }
  const handleReduce = () => {
    if (count === 0) {
      setCount(0)
      return
    }
    setCount(count - 1)
  }
  const handleChange = (e) => {
    const value = Number(e.target.value)
    setCount(value)
  }

  //----------------------------------------------------------------

  // const handleChangeShop = (e) => {
  //   const value = e.target.value

  //   // 將選取的店設定進sessionStorage
  //   // sessionStorage.setItem('shopId', value)
  //   // 同時也設定給shopValue更新select的值
  //   setShopValue(value)
  // }

  const handleChangeStyle = (e) => {
    setStyleValue(e.target.value)
  }

  const handleChangeSize = (e) => {
    setSizeValue(e.target.value)
  }

  //----------------------------------------------------------------

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
    console.log(userCollect)
  }, [userCollect])

  //----------------------------------------------------------------

  //控制商品資訊導覽標籤的點選與否
  const [activeSection, setActiveSection] = useState('des')

  useEffect(() => {
    // console.log(sizeValue, styleValue, shopValue)
  }, [sizeValue, styleValue, shopValue])

  useEffect(() => {
    const detailId = sessionStorage.getItem('detailId')
    // 判斷網址中的id = id有沒有抓到 重整頁面的時候會重新設定初始值 這時就需要從sessionStorage取得資訊
    if (id) {
      setProductId(id)
    } else {
      setProductId(detailId)
    }
  }, [id])

  // 控制點選商品資訊標籤的滾動
  useEffect(() => {
    const handleScroll = () => {
      const desSection = document.getElementById('des').offsetTop
      const specSection = document.getElementById('spec').offsetTop
      const commentSection = document.getElementById('comment').offsetTop
      const scrollPosition = window.scrollY + 150 // 150 是偏移量，根據需要調整

      if (scrollPosition >= desSection && scrollPosition < specSection) {
        setActiveSection('des')
      } else if (
        scrollPosition >= specSection &&
        scrollPosition < commentSection
      ) {
        setActiveSection('spec')
      } else if (scrollPosition >= commentSection) {
        setActiveSection('comment')
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 確認點擊是否在視窗外
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 檢測點擊是否在視窗外
      if (
        calenderRef.current &&
        !calenderRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        closeCalender()
      }
    }

    if (isopenCalender) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // 清除事件監聽
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isopenCalender])

  // 頁面初始化
  useEffect(() => {
    const nowUrl = router.pathname
    console.log(router.pathname)
    if (nowUrl === '/rent') {
      setIsRentHomePage(true)
    } else {
      setIsRentHomePage(false)
    }

    // 馬上將sessionStorage的店id 設定進shopValue
    if (sessionStorage.getItem('shopId')) {
      setShopValue(sessionStorage.getItem('shopId'))
    }
  }, [])

  useEffect(() => {
    // console.log(`單一商品查詢`)
    getProduct(queryIdParams)
  }, [queryIdParams])

  useEffect(() => {
    getProduct()
  }, [productId])

  useEffect(() => {
    if (auth.isAuth) {
      console.log(`在這嗎`)
      setUserId(auth.userData.id)
      searchAddLike(auth.userData.id)
      console.log(auth.userData.id)
    }
    console.log(userId)
  }, [auth])

  return (
    <>
      <Header />
      <section className="mainArea-detail-tian mainArea-tian">
        {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
        <Breadcrumb items={breadcrumbItems} />
        <div className="main-tian">
          <section className="mainHeader">
            {/* ↓↓↓↓ 產品照片光箱 ↓↓↓↓ */}
            <LightBox />
            {/* ↑↑↑↑ 產品照片光箱 ↑↑↑↑ */}
            <div className="option">
              {/*## ↓↓↓↓ 產品標題資訊 ↓↓↓↓ */}
              <Product_title
                errorMsg={errorMsg}
                successMsg={successMsg}
                userCollect={userCollect}
              />
              {/*## ↓↓↓↓ 商品重要規格 ↓↓↓↓ */}

              <div className="brief p1-tc-tian">
                {singleProduct != undefined &&
                  singleProduct.product_brief &&
                  singleProduct.product_brief.split('<br/>').map((line, i) => {
                    return (
                      <React.Fragment key={i}>
                        <span>{line}</span>
                        <br />
                      </React.Fragment>
                    )
                  })}
              </div>
              {/*## ↓↓↓↓ 商品樣式 ↓↓↓↓ */}
              {styles.length > 0 && (
                <div className="style">
                  <div className="styleTitle p2-tc-tian">顏色</div>

                  <FormControl sx={{ m: 0, width: 200 }} size="small">
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{
                        fontFamily: 'Noto Sans TC, sans-serif',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: '#8f8e93', // 標籤文字顏色
                        '&:hover': {
                          color: '#413c1c', // 滑鼠懸停時標籤文字顏色
                        },
                        '&.Mui-focused': {
                          color: '#574426', // 聚焦時標籤文字顏色
                        },
                      }}
                    >
                      選擇顏色
                    </InputLabel>
                    <Select
                      sx={{
                        color: '#413c1c', // 選項文字顏色
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#413c1c', // 初始邊框顏色
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e49366', // 滑鼠懸停時邊框顏色
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#413c1c', // 聚焦時邊框顏色
                        },
                        '.MuiSvgIcon-root': {
                          color: '#413c1c', // 修改箭頭顏色
                        },
                      }}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={styleValue}
                      label="選擇顏色"
                      onChange={handleChangeStyle}
                    >
                      <MenuItem value="">
                        <em>請選擇顏色</em>
                      </MenuItem>
                      {styles.length > 0 &&
                        styles.map((style, i) => {
                          return (
                            <MenuItem
                              key={style.price_id}
                              value={style.price_id}
                            >
                              {style.style_name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/*## ↓↓↓↓ 商品尺寸大小 ↓↓↓↓ */}
              {sizes.length > 0 && (
                <div className="size">
                  <div className="sizeTitle p2-tc-tian">尺寸</div>
                  <FormControl sx={{ m: 0, width: 200 }} size="small">
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{
                        fontFamily: 'Noto Sans TC, sans-serif',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: '#8f8e93', // 標籤文字顏色
                        '&:hover': {
                          color: '#413c1c', // 滑鼠懸停時標籤文字顏色
                        },
                        '&.Mui-focused': {
                          color: '#574426', // 聚焦時標籤文字顏色
                        },
                      }}
                    >
                      選擇尺寸
                    </InputLabel>
                    <Select
                      sx={{
                        color: '#413c1c', // 選項文字顏色
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#413c1c', // 初始邊框顏色
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e49366', // 滑鼠懸停時邊框顏色
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#413c1c', // 聚焦時邊框顏色
                        },
                        '.MuiSvgIcon-root': {
                          color: '#413c1c', // 修改箭頭顏色
                        },
                      }}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={sizeValue}
                      label="選擇尺寸"
                      onChange={handleChangeSize}
                    >
                      <MenuItem value="">
                        <em>請選擇尺寸</em>
                      </MenuItem>
                      {sizes.length > 0 &&
                        sizes.map((size, i) => {
                          return (
                            <MenuItem key={size.price_id} value={size.price_id}>
                              {size.size_name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/*## ↓↓↓↓ 商品數量 ↓↓↓↓ */}
              <div className="count">
                <div className="countTitle p2-tc-tian">數量</div>
                <div className="countOption">
                  <button
                    onClick={handleReduce}
                    className="reduce btn none-btn-tian"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="h6-en-tian countNum light-bg-tian"
                    value={`${count}`}
                  ></input>
                  <button
                    onClick={handlePlus}
                    className="plus btn none-btn-tian"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="time_shop">
                {/*## ↓↓↓↓ 租賃時段 ↓↓↓↓ */}
                <div className="time">
                  <div className="timeTitle p2-tc-tian">租借時段</div>
                  <div
                    className="form-control timeOption"
                    ref={triggerRef}
                    onClick={() => {
                      toggleCalender()
                    }}
                  >
                    <div className="timeIcon">
                      <span className="material-symbols-outlined light-text-tian">
                        event_note
                      </span>
                    </div>
                    <div className="timeLabel p1-tc-tian sub-text-tian">
                      {calenderValue}
                    </div>
                  </div>
                  {/* <!-- ↓↓↓↓ 月曆的彈出式視窗 ↓↓↓↓ --> */}
                  <div className="calenderWrapper">
                    <div
                      ref={calenderRef}
                      className={isopenCalender ? `calender open` : `calender`}
                    >
                      {/* <!-- ↓↓↓↓ 月曆的組件 ↓↓↓↓ --> */}
                      <Calendar />
                    </div>
                  </div>
                  {/* <!-- ↑↑↑↑ 月曆的彈出式視窗 ↑↑↑↑ --> */}
                </div>
                {/*## ↓↓↓↓ 取件門市 ↓↓↓↓ */}
                <div className="shop">
                  <div className="shopTitle p2-tc-tian">取件門市</div>
                  <FormControl sx={{ m: 0, width: 186 }} size="small">
                    <InputLabel
                      id="demo-select-small-label"
                      sx={{
                        fontFamily: 'Noto Sans TC, sans-serif',
                        fontStyle: 'normal',
                        fontSize: '16px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: '#8f8e93', // 標籤文字顏色
                        '&:hover': {
                          color: '#413c1c', // 滑鼠懸停時標籤文字顏色
                        },
                        '&.Mui-focused': {
                          color: '#574426', // 聚焦時標籤文字顏色
                        },
                      }}
                    >
                      選擇取件門市
                    </InputLabel>
                    <Select
                      sx={{
                        color: '#413c1c', // 選項文字顏色
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                          borderColor: '#413c1c', // 初始邊框顏色
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e49366', // 滑鼠懸停時邊框顏色
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#413c1c', // 聚焦時邊框顏色
                        },
                        '.MuiSvgIcon-root': {
                          color: '#413c1c', // 修改箭頭顏色
                        },
                      }}
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={shopValue}
                      label="選擇取件門市"
                      onChange={(e) => {
                        handleSetShop(e)
                      }}
                    >
                      <MenuItem value="">
                        <em>選擇取件門市</em>
                      </MenuItem>
                      {shops != undefined &&
                        shops.map((shop, i) => {
                          return (
                            <MenuItem key={shop.shop_id} value={shop.shop_id}>
                              {shop.shop_name}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/*## ↓↓↓↓ 商品價格 ↓↓↓↓ */}
              <div className="price d-flex align-items-baseline gap-1">
                <span className="h3-en-tian">
                  ${' '}
                  {sizeValue &&
                    sizes
                      .filter((item) => item.price_id === sizeValue)
                      .map((item, i) => (
                        <span key={i}>{item.product_price}</span>
                      ))}
                  {styleValue &&
                    styles
                      .filter((item) => item.price_id === styleValue)
                      .map((item, i) => (
                        <span key={i}>{item.product_price}</span>
                      ))}
                  {styles.length == 0 &&
                    sizes.length == 0 &&
                    price[0] != undefined &&
                    price[0].product_price}
                  {priceRange != undefined &&
                    priceRange.maxPrice != priceRange.minPrice &&
                    !sizeValue &&
                    !styleValue &&
                    (styles.length > 0 || sizes.length > 0) &&
                    `${priceRange.minPrice} ~ ${priceRange.maxPrice}`}
                  {priceRange != undefined &&
                    priceRange.maxPrice == priceRange.minPrice &&
                    !sizeValue &&
                    !styleValue &&
                    (styles.length > 0 || sizes.length > 0) &&
                    priceRange.minPrice}
                </span>
                <span className="h5-en-tian">/ Day</span>
              </div>
              {/*## ↓↓↓↓ 商品購買操作＆領取優惠券 ↓↓↓↓ */}
              <div className="optionBtn">
                <button
                  type="button"
                  className="btn book"
                  onClick={(e) => {
                    handleTrans(e)
                  }}
                >
                  <span className="material-symbols-outlined">
                    shopping_cart_checkout
                  </span>
                  <span className="header-en-tian">直接預定</span>
                </button>
                <button
                  type="button"
                  className="header-en-tian btn addCart"
                  onClick={(e) => {
                    handleTrans(e)
                  }}
                >
                  <span className="material-symbols-outlined">
                    add_shopping_cart
                  </span>
                  加入購物車
                </button>
                <button
                  type="button"
                  className="header-en-tian btn getCoupon d-none"
                >
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  領取優惠券
                </button>
              </div>
            </div>
          </section>
          <section className="mainInfo" id="main">
            {/*## ↓↓↓↓ 商品資訊導引標籤 ↓↓↓↓ */}
            <Info_tab activeSection={activeSection} />
            <div className="infoBody">
              {/*## ↓↓↓↓ 商品詳細資訊 ↓↓↓↓ */}
              <div className="des" id="des">
                <p className="h6-tc-tian desTitle dark-text-tian">詳細資訊</p>
                <p className="p2-tc-tian desContent dark-text-tian ps-3">
                  {singleProduct != undefined &&
                    singleProduct != undefined &&
                    singleProduct.product_description &&
                    singleProduct.product_description
                      .split('<br/>')
                      .map((line, i) => {
                        return (
                          <React.Fragment key={i}>
                            <span>{line}</span>
                            <br />
                          </React.Fragment>
                        )
                      })}
                </p>
              </div>
              {/*## ↓↓↓↓ 商品詳細資訊 圖片 ↓↓↓↓ */}
              <div className="desImg">
                {desPic[0] != undefined &&
                  desPic.map((pic, i) => {
                    return (
                      <figure key={pic.image_id}>
                        <img src={`/tian/image/${pic.image_path}`} alt="" />
                      </figure>
                    )
                  })}
              </div>
              {/*## ↓↓↓↓ 商品詳細規格 ↓↓↓↓ */}
              <div className="spec" id="spec">
                <p className="h6-tc-tian specTitle dark-text-tian">詳細資訊</p>
                <p className="p2-tc-tian specContent dark-text-tian ps-3">
                  {singleProduct != undefined &&
                    singleProduct != undefined &&
                    singleProduct.product_specification &&
                    singleProduct.product_specification
                      .split('<br/>')
                      .map((line, i) => {
                        return (
                          <React.Fragment key={i}>
                            <span>{line}</span>
                            <br />
                          </React.Fragment>
                        )
                      })}
                </p>
              </div>
              {/*## ↓↓↓↓ 商品評價 ↓↓↓↓ */}
              <div className="comment" id="comment">
                <div className="commentTitle">
                  <p className="h6-tc-tian dark-text-tian m-0">評價</p>
                  {/* ↓↓↓↓ 評價星等標題形式（看能否套用組件） ↓↓↓↓ */}
                  <Rank comment={comment} />
                  {/* ↑↑↑↑ 評價星等標題形式 ↑↑↑↑ */}
                </div>
                {/* ↓↓↓↓ 評價星等數量比例圖表（看能否套用組件來改） ↓↓↓↓ */}
                <Rank_chart comment={comment} />
                {/* ↑↑↑↑ 評價星等數量比例圖表 ↑↑↑↑ */}
                <div className="commentBody">
                  {/*## ↓↓↓↓ 評價卡片 ↓↓↓↓ */}
                  {comment.length > 0 &&
                    comment.map((comm, i) => {
                      return <Comment_card key={comm.comment_id} comm={comm} />
                    })}

                  {/* <Page_tab /> */}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* ↓↓↓↓ 回到頂部按鈕 ↓↓↓↓ */}
      <Top_btn />
      {/* ↑↑↑↑ 回到頂部按鈕 ↑↑↑↑ */}
      <Footer />

      <Toaster />
    </>
  )
}

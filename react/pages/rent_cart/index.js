import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { v4 as uuidv4 } from 'uuid'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

import toast, { Toaster } from 'react-hot-toast'

import Header from '@/components/template/header'
import Footer from '@/components/template/footer'

import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

import Cart_process from '@/components/tian/rent_cart/cart_process'

import dynamic from 'next/dynamic'
const List_card = dynamic(
  () => import('@/components/tian/rent_cart/list_card'),
  {
    ssr: false,
  }
)

// import List_card from '@/components/tian/rent_cart/list_card'

import CouponModal from '@/components/tian/rent_cart/coupon/couponModal'

import Checkbox from '@mui/material/Checkbox'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

//**------------------------------------------------------------

export default function Cart_check() {
  // 土司訊息使用 錯誤訊息使用
  const errorMsg = (error) => {
    toast.error(error)
  }

  // 成功訊息使用
  const successMsg = (success) => {
    toast.success(success)
  }
  // 設定頁面標題
  const [pageTitle, setPageTitle] = useState({
    title: '購物車。',
    subTitle: '訂單明細確認。',
  })

  const router = useRouter()

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()
  const [userId, setUserId] = useState(null)

  const {
    items,
    setItems,
    totalPrice,
    totalQty,
    andleAdd,
    handleDecrease,
    handleIncrease,
    handleRemove,
    cleanItems,
    selectedValue,
    setSelectedValue,
    maxDiscount,
    setMaxDiscount,
    finalAmount,
    setFinalAmount,
    selectedCoupon,
    setSelectedCoupon,
  } = useRentcart()

  const { shops, setShops, shopValue, setShopValue } = useQuery()

  //----------------------------------------------------

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
    { name: '購物車', href: '/rent_cart' },
  ]

  // 改用MySwal取代Swal
  const MySwal = withReactContent(Swal)

  // 刪除的彈出視窗
  const removeCartItem = (price_id) => {
    MySwal.fire({
      title: '刪除購物車商品',
      text: '確定要從購物車刪除此商品嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#de3e3e',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已刪除!',
          text: '已從購物車刪除此商品！',
          icon: 'success',
        })
        // 如果確定 就將calenderValue設定進入 sessionStorage
        handleRemove(price_id)
      }
    })
  }

  //----------------------------------------------------

  // 全選機制的制定
  let initArr = []

  const [allChecked, setAllChecked] = useState(false)
  const [checkArr, setChechArr] = useState(() => {
    items.forEach((item, i) => {
      initArr.push(false)
    })
    return initArr
  })

  const handleAllCheck = (e) => {
    const checked = e.target.checked
    const nextArr = checkArr.map(() => checked) // 將所有項目設為與全選 checkbox 相同的值
    setChechArr(nextArr) // 更新狀態
  }

  const handleSingleCheck = (e, index) => {
    const checked = e.target.checked
    let nextArr = [...checkArr] // 複製現有陣列
    nextArr[index] = checked // 更新對應索引的值
    setChechArr(nextArr) // 更新狀態
  }

  //----------------------------------------------------

  // 按下結帳按鈕 進入到填寫付款資訊
  const goToOrder = () => {
    if (totalPrice === 0) {
      const msg = `請先選擇要結帳的商品`
      errorMsg(msg)
      return
    }
    if (shopValue === '') {
      const msg = `請先選擇取件門市`
      errorMsg(msg)
      return
    }

    let nextOrder = JSON.parse(localStorage.getItem('rent_cart')).filter(
      (item, i) => item.checked !== false
    )

    // console.log(nextOrder)

    localStorage.setItem('rent_order', JSON.stringify(nextOrder))

    // localStorage.setItem('rent_cart', [])

    // setOrder()

    router.push('/rent_cart/cart_pay')
  }

  //----------------------------------------------------

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

  //----------------------------------------------------------------------

  //控制優惠券彈出式顯示
  const [couponToggle, setCouponToggle] = useState(false)

  const openCoupon = () => {
    if (couponToggle === false) {
      setCouponToggle(true)
      return
    }
    setCouponToggle(false)
  }

  //----------------------------------------------------------------------

  const [priceItem, setPriceItem] = useState([])

  // 為了獲取商品的顏色尺寸價格資料
  const getProductInfo = async (id) => {
    const initUrl = `http://localhost:3005/api/rent_cart/price_id=${id}`

    await axios
      .get(initUrl, { withCredentials: true })
      .then((res) => {
        const { price_rows } = res.data
        setPriceItem(price_rows)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //----------------------------------------------------------------------

  const handleChange = (e) => {
    // 設置選中的 Radio Button 的值
    setSelectedValue(e.target.value)
    const selected = e.target.checked
    if (!selected) {
      console.log(`取消勾選`)
      setSelectedValue(null)
    }
  }

  // 取得用戶所有露營用品的coupon資訊
  const [userCoupons, setUserCoupons] = useState([])

  const fetchCoupons = async (userId, type = '露營用品') => {
    let url = `http://localhost:3005/api/coupon/user_coupon/${userId}`

    await fetch(url, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const allUserCoupons = data.data.userCoupons
        const userCoupons = allUserCoupons.filter(
          (coupon, i) =>
            coupon.type === '露營用品' && coupon.status === '可使用'
        )

        setUserCoupons(userCoupons)
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error)
        setError(error.message)
      })
  }

  const handleCheckCoupon = () => {
    console.log(selectedValue)
    if (totalPrice === 0) {
      const msg = `請先選擇要結帳的商品`
      errorMsg(msg)
      setSelectedValue(null)
      setSelectedCoupon({})
      return
    }
    if (selectedValue) {
      const selected = userCoupons.find(
        (coupon) => coupon.id === Number(selectedValue)
      )
      if (selected) {
        setSelectedCoupon(selected)
      }
    } else {
      console.log(`取消`)
      setSelectedCoupon({})
    }
  }

  // 選取的 coupon 有變動時，設置選取的 coupon
  useEffect(() => {
    if (isClient) {
      if (selectedCoupon && Object.keys(selectedCoupon).length > 0) {
        console.log(selectedCoupon)
        if (selectedCoupon.category === '%數折扣') {
          console.log(`進行%數折扣`)
          if (
            Number(selectedCoupon.max_discount_amount) >
            Math.floor(totalPrice * (1 - Number(selectedCoupon.discount)))
          ) {
            setMaxDiscount(
              Math.floor(totalPrice * (1 - Number(selectedCoupon.discount)))
            )
            setFinalAmount(
              totalPrice -
                Math.floor(totalPrice * (1 - Number(selectedCoupon.discount)))
            )
          } else {
            setMaxDiscount(selectedCoupon.max_discount_amount)
            setFinalAmount(totalPrice - selectedCoupon.max_discount_amount)
          }
        } else if (selectedCoupon.category === '金額折抵') {
          console.log(`金額折抵優惠券`)
          if (Number(selectedCoupon.min_cost) > totalPrice) {
            console.log(`訂單金額未滿${selectedCoupon.min_cost}`)

            const msg = `訂單金額未滿${selectedCoupon.min_cost}`
            errorMsg(msg)
            setSelectedValue(null)
            setSelectedCoupon({})
          } else {
            console.log(`進行金額折抵`)
            setMaxDiscount(selectedCoupon.max_discount_amount)
            setFinalAmount(totalPrice - selectedCoupon.max_discount_amount)
            console.log(totalPrice - selectedCoupon.max_discount_amount)
          }
        }
      } else {
        console.log(`什麼也沒有`)
        setFinalAmount(totalPrice)
      }
    }
  }, [selectedCoupon, totalPrice, userCoupons])

  useEffect(() => {
    setFinalAmount(totalPrice)
  }, [totalPrice])

  useEffect(() => {
    console.log(selectedCoupon)
  }, [selectedCoupon])

  const getShops = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/api/rent_common/shop`)

      const status = res.data.status
      if (status === 'success') {
        const shops = res.data.shops
        setShops(shops)
      }
    } catch (err) {
      console.log(err)
    }
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

  //----------------------------------------------------------------------

  // 控制購物車流程圖示
  const [process, setProcess] = useState('')

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    getShops()
  }, [])

  useEffect(() => {
    setProcess(1)

    if (isClient) {
      const localCart = JSON.parse(localStorage.getItem('rent_cart')) || []
      setItems(localCart)

      if (localStorage.getItem('shopId')) {
        setShopValue(localStorage.getItem('shopId'))
      }
    }
  }, [isClient])

  useEffect(() => {
    console.log(items)
  }, [items])

  // checkbox全選機制的設定
  useEffect(() => {
    const isAllChecked = checkArr.every(Boolean) // 如果所有項目都是 true，則全選
    if (isAllChecked !== allChecked) {
      setAllChecked(isAllChecked)
    }
  }, [checkArr, allChecked])

  useEffect(() => {
    if (auth.isAuth) {
      fetchCoupons(auth.userData.id) // 獲取該用戶已領取的優惠券 ID
    }
  }, [auth])

  useEffect(() => {
    if (auth.isAuth) {
      setUserId(auth.userData.id)
      searchAddLike(auth.userData.id)
    }

    console.log(userId)
  }, [auth])

  useEffect(() => {
    console.log(userCollect)
  }, [userCollect])

  useEffect(() => {
    console.log(userCoupons)
  }, [userCoupons])

  useEffect(() => {
    console.log(shops)
  }, [shops])

  useEffect(() => {
    console.log(selectedCoupon)
  }, [selectedCoupon])

  return (
    <>
      <Header />
      {isClient && (
        <main className="mainArea-cart-tian mainArea-tian">
          <section className="cartTitle">
            {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
            <Breadcrumb items={breadcrumbItems} />
            {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
            <Page_title pageTitle={pageTitle} />
          </section>

          {/*## ↓↓↓↓ 購物車流程圖示 ↓↓↓↓ */}
          <Cart_process process={process} />
          {/*## ↓↓↓↓ 購物車訂單列表 ↓↓↓↓ */}
          <section className="cartList">
            <div className="listTitle">
              <h1 className="h6-tc-tian light-text-tian m-0">租賃露營用品</h1>
            </div>
            {/*## ↓↓↓↓ 訂單(店為單位) ↓↓↓↓ */}
            {isClient && items.length > 0 ? (
              <div className="list">
                {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
                <div className="listHeader">
                  <div className="shopName">
                    <FormControl
                      variant="filled"
                      sx={{ m: 1, width: 186, height: 20, top: -15 }}
                      size="small"
                    >
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
                        labelId="demo-simple-select-standard-label"
                        id="demo-select-small"
                        sx={{
                          padding: '0px 5px', // 減少內邊距以縮小選框
                          color: '#413c1c', // 選項文字顏色
                          backgroundColor: 'transparent',
                          borderRadius: '12px',
                          '.MuiSvgIcon-root': {
                            color: '#413c1c', // 修改箭頭顏色
                          },
                          '&:hover': {
                            borderBottom: '0px', // 初始底線顏色
                          },
                          '&:before': {
                            borderBottom: '0px', // 初始底線顏色
                          },
                          '&:hover:before': {
                            borderBottom: '0px', // 懸浮時底線顏色
                          },
                          '&:after': {
                            borderBottom: '0px', // 聚焦時底線顏色
                          },
                        }}
                        value={shopValue}
                        label="選擇取件門市"
                        onChange={handleSetShop}
                      >
                        <MenuItem value="">
                          <em>選擇取件門市</em>
                        </MenuItem>
                        {shops != undefined &&
                          shops?.length > 0 &&
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
                <div className="listBody">
                  <div className="cardHeader">
                    <div className="image" />
                    <div className="product p3-tc-tian sub-text-tian">商品</div>
                    <div className="day p3-tc-tian sub-text-tian">天數</div>
                    <div className="count p3-tc-tian sub-text-tian">數量</div>
                    <div className="amount p3-tc-tian sub-text-tian">價格</div>
                    <div className="operation p3-tc-tian sub-text-tian">
                      操作
                    </div>
                  </div>
                  {/*## ↓↓↓↓ 訂單商品卡片 ↓↓↓↓ */}
                  {isClient &&
                    items.length > 0 &&
                    items.map((item, i) => {
                      return (
                        <List_card
                          key={item.price_id}
                          handleSingleCheck={handleSingleCheck}
                          checkArr={checkArr}
                          item={item}
                          items={items}
                          index={i}
                          removeCartItem={() => {
                            removeCartItem(item.price_id)
                          }}
                          successMsg={successMsg}
                          errorMsg={errorMsg}
                          userCollect={userCollect}
                        />
                      )
                    })}
                </div>
                <div className="listFooter">
                  <div className="total">
                    <span className="dark-text-tian h6-tc-tian">
                      訂單金額：
                    </span>
                    <div className="totalPrice h6-en-tian error-text-tian">
                      <span>$</span>
                      <span>{totalPrice ? totalPrice : '0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 當items中沒有任何商品的時候 顯示這個
              <div
                style={{ padding: '35px', height: '50px' }}
                className="h6-tc-tian sub-text-tian"
              >
                目前購物車沒有商品。
              </div>
            )}
          </section>
          {/*## ↓↓↓↓ 購物車結帳確認 ↓↓↓↓ */}
          {items.length > 0 && (
            <section className="cartCheck">
              <div className="checkHeader">
                <h1 className="checkTitle h6-tc-tian light-text-tian m-0">
                  結帳明細
                </h1>
                <button
                  onClick={openCoupon}
                  className="none-btn-tian addCoupon"
                >
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  <span className="p2-tc-tian">
                    {Object.keys(selectedCoupon)?.length > 0
                      ? '變更優惠券'
                      : '選擇優惠券'}
                  </span>
                </button>
              </div>
              <div className="checkBody">
                <div className="checkAll">
                  <Checkbox
                    sx={{
                      color: '#8f8e93',
                      '&.Mui-checked': { color: '#e49366' },
                      '& .MuiSvgIcon-root': {
                        borderRadius: '8px', // 可選：設置外框的圓角
                      },
                    }}
                    onClick={(e) => {
                      handleAllCheck(e)
                    }}
                    checked={allChecked}
                  />
                  <div className="h6-tc-tian dark-text-tian">全選</div>
                </div>
                <div className="pay">
                  <div className="clac">
                    {Object.keys(selectedCoupon).length > 0 && (
                      <>
                        <div className="originPrice dark-text-tian">
                          <div className="originTitle p1-tc-tian">商品原價</div>
                          <div className="originNum p1-en-tian">
                            {totalPrice && totalPrice !== 0 ? totalPrice : ''}
                          </div>
                        </div>

                        <div className="coupon">
                          <div className="couponTitle dark-text-tian">
                            <span className="material-symbols-outlined">
                              confirmation_number
                            </span>
                            <span className="p1-tc-tian">折抵</span>
                          </div>
                          <div className="couponNum dark-text-tian p1-en-tian">
                            <span>-</span>
                            <span>{maxDiscount && maxDiscount}</span>
                          </div>
                        </div>
                        <div className="clacLine" />
                      </>
                    )}

                    <div className="total dark-text-tian">
                      <span className="h6-tc-tian">總金額:</span>
                      <div className="error-text-tian h6-en-tian">
                        <span>$</span>
                        <span>{finalAmount ? finalAmount : '0'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn error2-btn-tian"
                    onClick={() => {
                      goToOrder()
                    }}
                  >
                    結帳
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      <Footer />
      <Top_btn />

      <Toaster />

      {userCoupons.length > 0 && (
        <CouponModal
          coupons={userCoupons}
          couponToggle={couponToggle}
          setCouponToggle={setCouponToggle}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          handleChange={handleChange}
          handleCheckCoupon={handleCheckCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </>
  )
}

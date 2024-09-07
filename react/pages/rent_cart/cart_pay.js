import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'

import { useQuery } from '@/hooks/use-query'
import { useRentcart } from '@/hooks/use-rentcart'
import { useAuthTest } from '@/hooks/use-auth-test' // 引入使用者 hook

import Header from '@/components/template/header'
import Footer from '@/components/template/footer'

import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

import Cart_process from '@/components/tian/rent_cart/cart_process'
import PayList_card from '@/components/tian/rent_cart/payList_card'

import CouponModal from '@/components/tian/rent_cart/coupon/couponModal'
import PickupModal from '@/components/tian/rent_cart/pickupModal'
import AddpickupModal from '@/components/tian/rent_cart/addpickupModal'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

import toast, { Toaster } from 'react-hot-toast'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Cart_pay() {
  // 改用MySwal取代Swal
  const MySwal = withReactContent(Swal)

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const { shopValue } = useQuery()

  const {
    totalPrice,
    selectedValue,
    setSelectedValue,
    maxDiscount,
    setMaxDiscount,
    finalAmount,
    setFinalAmount,
    selectedCoupon,
    setSelectedCoupon,
  } = useRentcart()

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'RENT', href: '/rent' },
    { name: '購物車', href: '/rent_cart' },
  ]

  // 設定頁面標題
  const [pageTitle, setPageTitle] = useState({
    title: '購物車。',
    subTitle: '填寫付款資訊。',
  })

  // 土司訊息使用 錯誤訊息使用
  const errorMsg = (error) => {
    toast.error(error)
  }

  // 成功訊息使用
  const successMsg = (success) => {
    toast.success(success)
  }

  const [pickupValue, setPickupValue] = useState(null)

  const [paymentValue, setPaymentValue] = useState(null)

  const [orderList, setOrderList] = useState([])

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

  //控制變更取貨人彈出式顯示
  const [pickupToggle, setPickupToggle] = useState(false)

  const openPickup = () => {
    if (pickupToggle === false) {
      setPickupToggle(true)
      return
    }
    setPickupToggle(false)
  }

  // 控制新增取貨人彈出視窗
  const [addpickupToggle, setAddpickupToggle] = useState(false)

  const openAddpickup = () => {
    if (addpickupToggle === false) {
      setAddpickupToggle(true)

      return
    }
  }

  //----------------------------------------------------------------------

  const [shops, setShops] = useState([])

  const getShop = async () => {
    await axios
      .get('http://localhost:3005/api/rent_product/shops')
      .then((res) => {
        const status = res.data.status
        if (status === 'success') {
          console.log(`已成功獲取商店資訊`)
        }
        const shops = res.data.data.shops
        setShops(shops)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //----------------------------------------------------------------------

  const [notesValue, setNotesValue] = useState('')

  const handleChangeNotes = (e) => {
    setNotesValue(e.target.value)
  }

  //----------------------------------------------------------------------

  const handleChangePayment = (e) => {
    setPaymentValue(e.target.value)
  }

  //----------------------------------------------------------------------

  const [pickup, setPickup] = useState([])

  const getPickupInfo = async (id) => {
    await axios
      .get(`http://localhost:3005/api/rent_cart/pickup/${id}`)
      .then((res) => {
        const status = res.data.status
        if (status === 'success') {
          console.log(`已成功獲取商店資訊`)
        }
        const pickup_rows = res.data.data.pickup_rows

        console.log(pickup_rows)
        setPickup(pickup_rows)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //----------------------------------------------------------------------

  const handlePay = () => {
    setOrder()
  }

  // 導向至ECPay付款頁面
  const goECPay = (orderId) => {
    Swal.fire({
      title: '確認要導向至ECPay進行付款?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        // 先連到node伺服器後，導向至ECPay付款頁面
        window.location.href = `http://localhost:3005/api/rent_ecpay/payment?orderId=${orderId}`
      }
    })
  }

  //----------------------------------------------------------------------

  // 導向至LINE Pay付款頁面
  const goLinePay = (orderId) => {
    Swal.fire({
      title: '確認要導向至LINE Pay進行付款?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        // 先連到node伺服器後，導向至Line Pay付款頁面
        window.location.href = `http://localhost:3005/api/rent_linepay/reserve?orderId=${orderId}`
      }
    })
  }

  //----------------------------------------------------------------------

  // 字串日期轉換成資料庫datetime
  function formatDate(dateString) {
    const date = new Date(dateString) // 解析字串成 Date 對象
    return date.toISOString().slice(0, 19).replace('T', ' ') // 格式化成資料庫需要的格式
  }

  // 將要結帳的商品寫入訂單相關資料表
  const setOrder = async () => {
    // 判斷有沒有選擇付款方式
    if (paymentValue === null) {
      errorMsg(`請先選擇付款方式`)
      return
    }

    let currentDateTime = new Date()
    let formattedDateTime = currentDateTime
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    const startTime = JSON.parse(localStorage.getItem('rent_order'))[0]
      .start_time

    const endTime = JSON.parse(localStorage.getItem('rent_order'))[0].end_time

    // 將字串轉換為 Date 對象
    const date1 = new Date(startTime)
    const date2 = new Date(endTime)

    // 計算兩個日期之間的毫秒差
    const timeDiff = Math.abs(date2 - date1) // 使用 Math.abs 以防日期順序錯誤

    // 將毫秒差轉換為天數
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    // uuid產生訂單id
    const orderId = uuidv4()
    const packageId = uuidv4()
    const productsId = uuidv4()

    const orderItemsOrigin = JSON.parse(localStorage.getItem('rent_order'))

    localStorage.setItem('orderId', orderId)

    // let lineProducts = orderItemsOrigin.map((item, i) => {
    //   return {
    //     id: item.price_id,
    //     name: item.product_name,
    //     quantity: item.qty * diffDays,
    //     price: item.price,
    //   }
    // })
    let lineProducts = [
      {
        id: productsId,
        name: '商品' + orderId,
        quantity: 1,
        price: finalAmount,
      },
    ]

    console.log(`lineProducts:`)
    console.log(lineProducts)

    const lineOrder = {
      orderId: orderId,
      currency: 'TWD',
      amount: finalAmount,
      packages: [
        {
          id: packageId,
          amount: finalAmount,
          products: lineProducts,
        },
      ],
      options: { display: { locale: 'zh_TW' } },
    }

    console.log(`lineOrder:`)
    console.log(lineOrder)

    // 將訂單資料表需要的所有內容整理成物件
    let order = JSON.stringify({
      order_id: orderId,
      user_id: userId,
      shop_id: shopValue,
      start_time: startTime,
      end_time: endTime,
      amount: finalAmount,
      create_datetime: formattedDateTime,
      payment: paymentValue,
      order_status: '訂單成立',
      pickup_id: pickupInfo.pickup_id,
      notes: notesValue,
      order_info: JSON.stringify(lineOrder),
      reservation: '',
      confirm: '',
      status: 'pending',
    })

    console.log(`order:`)
    console.log(order)

    let orderItems = JSON.stringify(
      orderItemsOrigin.map((item, i) => {
        return { price_id: item.price_id, count: item.qty }
      })
    )

    // 將訂單寫入資料庫（p_shop_order、price_relate_order）
    const url = `http://localhost:3005/api/rent_order/${userId}`
    try {
      const res = await axios.post(
        url,
        {
          order,
          orderItems,
        },
        { withCredentials: true }
      )
      const status = res.data.status
      if (status === 'success') {
        console.log('訂單和訂單項目已成功提交')
        // 這裡你可以進行後續操作，如導航到確認頁面或顯示成功提示
      } else {
        console.log('提交訂單失敗，伺服器回傳非預期的狀態')
      }

      // const { status } = res.data
    } catch (err) {
      console.log(err)
    }

    // 在這邊將優惠券的狀態修改 改成已使用 並且寫入訂單編號
    if (Object.keys(selectedCoupon) > 0) {
      try {
        const res = await axios.put(
          `http://localhost:3005/api/rent_cart/update_user_coupon/${userId}`,
          {
            status: '已使用',
            order_id: orderId,
            user_coupon_id: selectedCoupon.user_coupon_id,
          }
        )

        const { status } = res.data
        if (status === 'success') {
          console.log('已更新會員優惠券使用狀態')
          // 這裡你可以進行後續操作，如導航到確認頁面或顯示成功提示
        } else {
          console.log('更新會員優惠券使用狀態失敗')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log(`這次沒有使用優惠券`)
    }

    if (paymentValue && paymentValue === 'ecpay') {
      console.log(`綠界支付`)
      // 將資料導向ecpay付款
      goECPay(orderId)
    } else if (paymentValue && paymentValue === 'linepay') {
      console.log(`linePay還沒串`)

      goLinePay(orderId)
    }
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
    let url = `http://localhost:3005/api/rent_cart/user_coupon/${userId}`

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
    if (totalPrice === 0) {
      errorMsg(`請先選擇要結帳的商品`)
      setSelectedValue(null)
      return
    }
    if (selectedValue) {
      const selected = userCoupons.find(
        (coupon) => coupon.id === Number(selectedValue)
      )

      console.log(selected)

      if (selected) {
        setSelectedCoupon(selected)
      }
    } else {
      console.log(`取消`)
      setSelectedCoupon({})
    }
  }

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

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
            errorMsg(`訂單金額未滿${selectedCoupon.min_cost}`)
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
      console.log(totalPrice)
      console.log(maxDiscount)
      console.log(finalAmount)
      // console.log(selected)
      // console.log(totalPrice)
      console.log(selectedValue)
    }
  }, [selectedCoupon, totalPrice, userCoupons])

  useEffect(() => {
    console.log(finalAmount)
  }, [finalAmount])

  useEffect(() => {
    console.log(selectedCoupon)
  }, [selectedCoupon])

  useEffect(() => {
    console.log(auth.isAuth)
    if (auth.isAuth) {
      console.log('有登入')
      setUserId(auth.userData.id)
      fetchCoupons(auth.userData.id)
      getShop(auth.userData.id)
      getPickupInfo(auth.userData.id) // 獲取該用戶已領取的優惠券 ID
    } else {
      console.log(`請登入`)
      getPickupInfo(userId)
      // setUserId(null) // 設置 userId 為 null
    }
  }, [auth, addpickupToggle])

  //----------------------------------------------------------------------

  // 控制購物車流程圖示
  const [process, setProcess] = useState('')

  useEffect(() => {
    setProcess(2)
    setIsClient(true)
    // console.log(selectedCoupon.id)
    setSelectedValue(selectedCoupon.id)
  }, [])

  useEffect(() => {
    if (isClient) {
    }
  }, [isClient])

  useEffect(() => {
    setOrderList(JSON.parse(localStorage.getItem('rent_order')))
  }, [isClient])

  useEffect(() => {
    // console.log(orderList)
    // console.log(shops)
  }, [orderList])

  const handleCheckPickup = () => {
    let pickup_info = {}

    if (pickupValue && pickupValue === pickupInfo.pickup_id) {
      return
    }

    if (pickupValue && pickupValue !== pickupInfo.pickup_id) {
      pickup_info = pickup.find((item, i) => item.pickup_id == pickupValue)
      setPickupInfo(pickup_info)
      return
    }
  }

  const [pickupInfo, setPickupInfo] = useState({})

  // 在進入頁面的時候 先將預設的取件人設定進去 預設選取
  useEffect(() => {
    console.log(pickup)
    // 先確認已經載入客戶端頁面 並且有抓到此用戶的取件人資訊
    if (isClient) {
      if (pickup && pickup.length > 0) {
        let pickup_info = {}
        let pickupDefalut = pickup.find((item) => item.default_num === 1)

        // 確認有無預設的取件人
        console.log(pickupDefalut)

        // 如果有就執行將預設取件人設定成選取的初始值 如果沒有pickupInfo就會被設定成空的
        if (pickupDefalut && pickupDefalut !== undefined) {
          pickup_info = pickupDefalut
          if (!pickupValue) {
            setPickupValue(pickupDefalut.pickup_id)
          }
        }

        setPickupInfo(pickup_info)
      } else {
        setPickupInfo({})
      }
    }
  }, [pickup])

  useEffect(() => {
    console.log(pickupInfo)
  }, [pickupInfo, paymentValue])

  useEffect(() => {
    console.log(notesValue)
  }, [notesValue])

  useEffect(() => {
    console.log(`優惠券：${selectedCoupon}`)
  }, [selectedCoupon])

  return (
    <>
      <Header />
      <main className="mainArea-pay-tian mainArea-tian">
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
          <div className="list">
            {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
            <div className="listHeader">
              <div className="shopName p1-tc-tian dark-text-tian">
                取貨店面：
                {isClient &&
                  shops.length > 0 &&
                  shops.find((shop, i) => shop.shop_id == shopValue)?.shop_name}
              </div>
            </div>
            <div className="listBody">
              <div className="cardHeader">
                <div className="image" />
                <div className="product p3-tc-tian sub-text-tian">商品</div>
                <div className="date p3-tc-tian sub-text-tian">租賃時段</div>
                <div className="day p3-tc-tian sub-text-tian">天數</div>
                <div className="count p3-tc-tian sub-text-tian">數量</div>
                <div className="amount p3-tc-tian sub-text-tian">價格</div>
              </div>
              {/*## ↓↓↓↓ 訂單商品卡片 ↓↓↓↓ */}
              {isClient &&
                orderList.map((item, i) => {
                  return <PayList_card key={item.price_id} item={item} />
                })}
            </div>
            <div className="listForm">
              <div className="pickup">
                <span className="pickupTitle p2-tc-tian dark-text-tian">
                  取件人
                </span>
                <div className="pickupBody">
                  <span className="name p2-tc-tian sub-text-tian">
                    {isClient && Object.keys(pickupInfo).length > 0
                      ? `姓名/ ` + pickupInfo.full_name
                      : ''}
                  </span>
                  <span className="phone p2-tc-tian sub-text-tian">
                    {isClient && Object.keys(pickupInfo).length > 0
                      ? `電話/ ` + pickupInfo.phone
                      : ''}
                  </span>
                  <span className="email p2-tc-tian sub-text-tian">
                    {isClient && Object.keys(pickupInfo).length > 0
                      ? `Email/ ` + pickupInfo.email
                      : ''}
                  </span>

                  {/* 先判斷有沒有預設取件人 再判斷有沒有已儲存的取件人 都沒有就請他新增 */}
                  {isClient &&
                  pickup.length > 0 &&
                  Object.keys(pickupInfo).length > 0 ? (
                    <span
                      onClick={openPickup}
                      className="change p2-tc-tian prompt-text-tian"
                    >
                      變更
                    </span>
                  ) : pickup.length > 0 ? (
                    <span
                      onClick={openPickup}
                      className="change p2-tc-tian prompt-text-tian"
                    >
                      選擇取件人
                    </span>
                  ) : (
                    <span
                      onClick={openAddpickup}
                      className="change p2-tc-tian prompt-text-tian"
                    >
                      新增取件人
                    </span>
                  )}
                </div>
              </div>
              <div className="note">
                <span className="noteTitle p2-tc-tian dark-text-tian">
                  備註
                </span>
                <input
                  className="p2-tc-tian sub-text-tian"
                  type="text"
                  placeholder="備註需要告知門市的事項等..."
                  value={notesValue}
                  onChange={(e) => {
                    handleChangeNotes(e)
                  }}
                />
              </div>
            </div>
            <div className="listFooter">
              <div className="total">
                <span className="dark-text-tian p2-tc-tian">訂單金額：</span>
                <div className="totalPrice p1-en-tian error-text-tian">
                  <span>$</span>
                  <span>{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*## ↓↓↓↓ 付款方式確認 ↓↓↓↓ */}
        <section className="payment">
          <div className="paymentHeader">
            <h1 className="paymentTitle h6-tc-tian light-text-tian m-0">
              付款方式
            </h1>
          </div>
          <div className="paymentBody">
            <FormControl sx={{ width: '100%' }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={paymentValue}
                name="payment"
                onChange={(e) => {
                  handleChangePayment(e)
                }}
              >
                <FormControlLabel
                  sx={{
                    height: '60px',
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 'medium',
                      fontSize: '14px', // 字體粗細
                      fontFamily: 'NotoSansTC, sans-serif;', // 字體族
                    },
                  }}
                  value="ecpay"
                  control={
                    <Radio
                      sx={{
                        color: '#2d2d2d',
                        '&.Mui-checked': {
                          color: '#e49366',
                        },
                      }}
                    />
                  }
                  label="綠界支付"
                />

                <FormControlLabel
                  sx={{
                    height: '60px',
                    borderTop: '0.5px solid #8f8e93',
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 'medium',
                      fontSize: '14px', // 字體粗細
                      fontFamily: 'Montserrat, sans-serif;', // 字體族
                    },
                  }}
                  value="linepay"
                  control={
                    <Radio
                      sx={{
                        color: '#2d2d2d',
                        '&.Mui-checked': {
                          color: '#e49366',
                        },
                      }}
                    />
                  }
                  label="LinePay"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </section>
        {/*## ↓↓↓↓ 購物車結帳確認 ↓↓↓↓ */}
        <section className="cartCheck">
          <div className="checkHeader">
            <h1 className="checkTitle h6-tc-tian light-text-tian m-0">
              結帳明細
            </h1>
            <button onClick={openCoupon} className="none-btn-tian addCoupon">
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
                  handlePay()
                }}
              >
                結帳
              </button>
            </div>
          </div>
        </section>
      </main>
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
      <PickupModal
        pickupValue={pickupValue}
        setPickupValue={setPickupValue}
        pickup={pickup}
        pickupToggle={pickupToggle}
        setPickupToggle={setPickupToggle}
        addpickupToggle={addpickupToggle}
        setAddpickupToggle={setAddpickupToggle}
        handleCheckPickup={handleCheckPickup}
        pickupInfo={pickupInfo}
      />
      <AddpickupModal
        pickup={pickup}
        pickupToggle={pickupToggle}
        setPickupToggle={setPickupToggle}
        addpickupToggle={addpickupToggle}
        setAddpickupToggle={setAddpickupToggle}
        getPickupInfo={getPickupInfo}
        errorMsg={errorMsg}
        successMsg={successMsg}
        MySwal={MySwal}
      />
    </>
  )
}

import { useState, useEffect } from 'react'
import { useSearch } from '@/hooks/use-search'
import { useRouter } from 'next/router'

import axiosInstance from '@/services/axios-instance'
import toast, { Toaster } from 'react-hot-toast'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

import CouponModal from './coupon/couponModal'

export default function OrderCard({
  data,
  setData,
  handleBack,
  handleNext,
  orderInfo,
}) {
  const router = useRouter()
  const { people } = useSearch()

  // 所有欄位共用的事件處理函式
  const handleFieldChange = (e) => {
    return setData({ ...data, [e.target.name]: e.target.value })
  }

  // 選擇付款方式
  const [value, setValue] = useState('ecpay')

  // 選定的coupon
  const [selectedCoupon, setSelectedCoupon] = useState({})
  const [finalAmount, setFinalAmount] = useState(orderInfo.pay_amount)

  // Fetch 使用者持有的 Coupon
  const [coupons, setCoupons] = useState([])
  const [error, setError] = useState(null)

  const fetchCoupons = async () => {
    try {
      let url = `http://localhost:3005/api/c-order/user_coupon?pay_amount=${orderInfo.pay_amount}`

      const response = await fetch(url, { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      const allCoupons = data.data.userCoupons
      setCoupons(allCoupons)

      const idRows = allCoupons.map((coupon) => coupon.id)
      setRadioOptions(idRows)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setError(error.message)
    }
  }

  // 新增訂單 function
  const createOrder = async (newData) => {
    try {
      const response = await fetch('http://localhost:3005/api/c-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('資料新增成功:', data)
    } catch (error) {
      console.error('Error creating data:', error)
    }
  }

  // 付款測試用---------------------------------------------------------------------------

  // 導向至ECPay付款頁面
  const goECPay = (id) => {
    if (window.confirm('確認要導向至ECPay進行付款?')) {
      // 先連到node伺服器後，導向至ECPay付款頁面
      window.location.href = `http://localhost:3005/api/camp-ecpay/payment?orderId=${id}`
    }
  }

  // // 導向至LINE Pay付款頁面
  const goLinePay = (id) => {
    if (window.confirm('確認要導向至LINE Pay進行付款?')) {
      // 先連到node伺服器後，導向至LINE Pay付款頁面
      window.location.href = `http://localhost:3005/api/camp-line-pay/reserve?orderId=${id}`
    }
  }

  // 建立訂單用，格式參考主控台由伺服器回傳
  const [order, setOrder] = useState({})
  // 載入狀態(控制是否顯示載入中的訊息，和伺服器回傳時間點未完成不同步的呈現問題)
  const [isLoading, setIsLoading] = useState(true)

  // confirm回來用的，在記錄確認之後，line-pay回傳訊息與代碼，例如
  // {returnCode: '1172', returnMessage: 'Existing same orderId.'}
  const [result, setResult] = useState({
    returnCode: '',
    returnMessage: '',
  })

  // 付款成功

  // 建立訂單，送至server建立訂單，packages與order id由server產生
  const createOrder2 = async () => {
    // 送至server建立訂單，packages與order id由server產生
    // products將會組合在packages屬性之下
    const res = await axiosInstance.post('/camp-line-pay/create-order', {
      amount: finalAmount,
      campground_id: orderInfo.campground_id,
      room_id: orderInfo.room_id,
      check_in_date: orderInfo.checkInDate,
      check_out_date: orderInfo.checkOutDate,
      people: orderInfo.people,
      coupon_id: selectedCoupon.id || null,
      last_name: data.lastName,
      first_name: data.firstName,
      phone: data.phone,
      email: data.email,
      note: data.note,
      products: [
        {
          id: orderInfo.room_id,
          name: '測試商品1',
          quantity: 1,
          price: finalAmount,
        },
      ],
    })

    console.log(res.data) //訂單物件格式(line-pay專用)

    if (res.data.status === 'success') {
      setOrder(res.data.data.order)
      toast.success('已成功建立訂單')
      localStorage.setItem(
        'order_number',
        res.data.fulldata.fullOrder.order_number
      )
      if (value === 'ecpay') {
        goECPay(res.data.data.order.orderId)
      } else if (value === 'linepay') {
        goLinePay(res.data.data.order.orderId)
      }
    }
  }

  // 確認交易，處理伺服器通知line pay已確認付款，為必要流程
  const handleConfirm = async (transactionId) => {
    const res = await axiosInstance.get(
      `/camp-line-pay/confirm?transactionId=${transactionId}`
    )

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('付款成功')
    } else {
      toast.error('付款失敗')
    }

    if (res.data.data) {
      setResult(res.data.data)
    }

    // 處理完畢，關閉載入狀態
    setIsLoading(false)
  }

  // confirm回來用的
  useEffect(() => {
    if (router.isReady) {
      // 這裡確保能得到router.query值
      console.log(router.query)
      // http://localhost:3000/order?transactionId=2022112800733496610&orderId=da3b7389-1525-40e0-a139-52ff02a350a8
      // 這裡要得到交易id，處理伺服器通知line pay已確認付款，為必要流程
      // TODO: 除非為不需登入的交易，為提高安全性應檢查是否為會員登入狀態
      const { transactionId, orderId } = router.query

      // 如果沒有帶transactionId或orderId時，導向至首頁(或其它頁)
      if (!transactionId || !orderId) {
        // 關閉載入狀態
        setIsLoading(false)
        // 不繼續處理
        return
      }
      if (router.query.RtnCode === 1) {
        console.log('你已經付款成功咯')
      }
      // 向server發送確認交易api
      handleConfirm(transactionId)
    }

    // eslint-disable-next-line
  }, [router.isReady])

  // 付款測試用---------------------------------------------------------------------------

  const handleSubmit = () => {
    const newOrder = {
      room_id: orderInfo.room_id,
      check_in_date: orderInfo.checkInDate,
      check_out_date: orderInfo.checkOutDate,
      people: orderInfo.people,
      pay_amount: finalAmount,
      // user_id: 1,
      coupon_id: selectedCoupon.id || null,
      // status: '待付款',
      last_name: data.lastName,
      first_name: data.firstName,
      phone: data.phone,
      email: data.email,
      note: data.note,
    }
    createOrder(newOrder)

    // 在串接綠界之前，先直接跳到下一頁
    handleNext()
  }

  // 使用者選擇的優惠券狀態
  const [radioOptions, setRadioOptions] = useState([])
  const [selectedValue, setSelectedValue] = useState(null)
  const [maxDiscount, setMaxDiscount] = useState(0)

  const handleChange = (e) => {
    // 設置選中的 Radio Button 的值
    setSelectedValue(e.target.value)
  }

  //控制優惠券彈出式顯示
  const [couponToggle, setCouponToggle] = useState(false)

  const openCoupon = () => {
    if (couponToggle === false) {
      setCouponToggle(true)
      return
    }
    setCouponToggle(false)
  }

  const handlePaymentChange = (event) => {
    setValue(event.target.value) // 更新狀態
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  // 選取的 coupon 有變動時，設置選取的 coupon
  useEffect(() => {
    const selected = coupons.find(
      (coupon) => coupon.id === Number(selectedValue)
    )
    if (selected) {
      setSelectedCoupon(selected)
      if (selected.category === '%數折扣') {
        if (
          Number(selected.max_discount_amount) >
          Math.floor(orderInfo.pay_amount * (1 - Number(selected.discount)))
        ) {
          setMaxDiscount(
            Math.floor(orderInfo.pay_amount * (1 - Number(selected.discount)))
          )
          setFinalAmount(
            orderInfo.pay_amount -
              Math.floor(orderInfo.pay_amount * (1 - Number(selected.discount)))
          )
        } else {
          setMaxDiscount(selected.max_discount_amount)
          setFinalAmount(orderInfo.pay_amount - selected.max_discount_amount)
        }
      } else {
        setMaxDiscount(selected.max_discount_amount)
        setFinalAmount(orderInfo.pay_amount - selected.max_discount_amount)
      }
    } else {
      setFinalAmount(orderInfo.pay_amount)
    }

    console.log(selected)
  }, [selectedValue])

  return (
    <>
      <div className="wrapper">
        <div className="cate-block">
          <span className="cate">營地/訂單商品</span>
        </div>
        <div className="hotel-wrapper">
          <div className="top-block">
            <img src={orderInfo.campground_img} alt="" className="hotel-icon" />
            <span className="hotel-name">{orderInfo.campground_name}</span>
          </div>
          <div className="title-wrapper">
            <span className="title-1 title">營位</span>
            <span className="title-2 title">租借時段</span>
            <span className="title-3 title">天數</span>
            <span className="title-4 title">人數</span>
            <span className="title-5 title">總價</span>
          </div>
          <div className="room-wrapper">
            <div className="block-1">
              <img src={orderInfo.room_img} alt="" className="room-icon" />
              {orderInfo.campground_name}
            </div>
            <div className="block-2">
              {orderInfo.checkInDate + ' ~ ' + orderInfo.checkOutDate}
            </div>
            <div className="block-3">{orderInfo.night}</div>
            <div className="block-4">{people}</div>
            <div className="block-5">$ {orderInfo.pay_amount}</div>
          </div>
          <div className="detail-wrapper">
            <div className="customer-detail">
              訂位人資訊
              <div className="info-wrapper">
                <span>姓名/{data.lastName}</span>
                <span>電話 / {data.phone}</span>
                <span>信箱 / {data.email}</span>
                <button className="changeBtn" onClick={handleBack}>
                  變更
                </button>
              </div>
            </div>
            {/* <div className="reciept-wrapper">
              電子發票
              <div className="info-wrapper">
                <span>手機載具</span>
                <span>/JIELI5H</span>
                <button className="changeBtn">變更</button>
              </div>
            </div> */}
            <div className="note-wrapper">
              <div className="note-title">備註</div>
              <input
                type="text"
                className="note"
                name="note"
                value={data.note}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        </div>
      </div>
      <section className="wrapper2">
        <div className="cate-block">
          <span className="cate">付款方式</span>
        </div>
        <div className="paymentBody">
          <FormControl sx={{ width: '100%' }}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="payment"
              value={value}
              onChange={handlePaymentChange}
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
      <section className="wrapper3">
        <div className="cate-block2">
          <h1 className="checkTitle h6-tc-tian light-text-tian m-0">
            結帳明細
          </h1>
          <button onClick={openCoupon} className="couponBtn">
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            <span className="p2-tc-tian">選擇優惠券</span>
          </button>
        </div>
        <div className="payment-wrapper">
          {selectedValue ? (
            <div className="clac-wrapper">
              <div className="originPrice dark-text-tian">
                <div className="originTitle p1-tc-tian">商品原價</div>
                <div className="originNum p1-en-tian">
                  {orderInfo.pay_amount}
                </div>
              </div>
              <div className="coupon">
                <div className="couponTitle dark-text-tian">
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                  {selectedCoupon.category === '%數折扣' ? (
                    <span className="p1-tc-tian">
                      {parseInt(100 - selectedCoupon.discount * 100)}% off
                    </span>
                  ) : (
                    '現金折抵'
                  )}
                </div>
                <div className="couponNum dark-text-tian p1-en-tian">
                  <span>- </span>
                  {selectedCoupon.category === '%數折扣' ? (
                    <span>{maxDiscount}</span>
                  ) : (
                    <span>{parseInt(Number(selectedCoupon.discount))}</span>
                  )}
                </div>
              </div>
              <div className="calcLine" />
              <div className="total dark-text-tian">
                <span className="h6-tc-tian">總金額:</span>
                <div className="error-text-tian h6-en-tian">
                  <span>$</span>
                  {finalAmount}
                  <span />
                </div>
              </div>
            </div>
          ) : (
            <div className="total dark-text-tian">
              <span className="h6-tc-tian">總金額:</span>
              <div className="error-text-tian h6-en-tian">
                <span>$</span>
                {finalAmount}
                <span />
              </div>
            </div>
          )}

          <button className="btn error2-btn-tian" onClick={createOrder2}>
            結帳
          </button>
        </div>
      </section>
      <CouponModal
        couponToggle={couponToggle}
        setCouponToggle={setCouponToggle}
        coupons={coupons}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        handleChange={handleChange}
      />
      <style jsx>
        {`
          .wrapper {
            width: 1280px;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            overflow: hidden;
            border: 1px solid var(--main-color-dark);
            margin-bottom: 50px;
          }

          .wrapper2 {
            width: 1280px;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            overflow: hidden;
            border: 1px solid var(--main-color-dark);
            margin-bottom: 50px;
          }

          .wrapper3 {
            width: 1280px;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            overflow: hidden;
            margin-bottom: 50px;
          }
          .cate-block {
            width: 100%;
            background: var(--main-color-dark);
            padding: 8px 35px;
          }
          .cate-block2 {
            display: flex;
            justify-content: space-between;
            width: 100%;
            background: var(--main-color-dark);
            padding: 8px 35px;
          }
          .cate {
            color: #f5f5f7;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
          }
          .hotel-wrapper {
            display: flex;
            flex-direction: column;
            border-radius: 20px;
            overflow: hidden;
            margin: auto;
            margin-block: 15px;
            border: 2px solid #e5e4cf;
          }
          .hotel-icon {
            width: 23px;
            height: 23px;
            border-radius: 50%;
            object-fit: cover;
          }
          .top-block {
            background: #e5e4cf;
            display: flex;
            gap: 5px;
            width: 1260px;
            height: 36px;
            padding: 13px 35px;
            align-items: center;
          }
          .hotel-name {
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-weight: 500;
          }
          .title-wrapper {
            height: 29px;
            align-items: center;
            display: flex;
            margin-inline: 35px;
            border-bottom: 1px solid #e5e4cf;
          }
          .title {
            font-family: 'Noto Sans TC';
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            color: #8f8e93;
          }
          .title-1 {
            flex-basis: 513px;
          }
          .title-2 {
            flex-basis: 377px;
          }
          .title-3 {
            flex-basis: 94px;
          }
          .title-4 {
            flex-basis: 95px;
          }
          .title-5 {
            flex-basis: 103px;
          }
          .room-wrapper {
            display: flex;
            margin-inline: 35px;
            align-items: center;
            height: 68px;
            border-bottom: 1px solid #e5e4cf;
          }
          .block-1 {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-basis: 513px;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
          }
          .room-icon {
            width: 47px;
            height: 47px;
            object-fit: cover;
          }
          .block-2 {
            flex-basis: 377px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .block-3 {
            flex-basis: 94px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .block-4 {
            flex-basis: 95px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .block-5 {
            flex-basis: 103px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            color: #de3e3e;
          }
          .customer-detail {
            margin-left: 45px;
            display: flex;
            gap: 45px;
            padding-block: 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .info-wrapper {
            display: flex;
            gap: 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            color: #8f8e93;
          }
          .changeBtn {
            color: #e49366;
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
          }
          .reciept-wrapper {
            margin-left: 60px;
            display: flex;
            gap: 45px;
            padding-block: 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .note-wrapper {
            margin-inline: 87px;
            display: flex;
            gap: 45px;
            padding-block: 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            align-items: center;
          }
          .note {
            width: 100%;
            border: 2px solid #e5e4cf;
            border-radius: 10px;
            outline: none;
            padding: 6px 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .note-title {
            white-space: nowrap;
          }
          input[type='text']:focus {
            border: 2px solid var(--hint-color);
          }
          .payment {
            width: 100%;
            border: 1px solid var(--main-color-dark);
            background-color: var(--main-color-bright);
          }
          .paymentHeader {
            background-color: $primary-color;
          }
          .paymentBody {
            padding-inline: 35px;
            width: 100%;
          }

          .payment-wrapper {
            display: flex;
            flex-direction: row;
            gap: 0;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: end;
            width: 100%;
            background-color: #e5e4cf;
            padding-block: 20px;
            padding-inline: 35px;
          }
          .clac-wrapper {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .checkTitle {
            display: flex;
          }
          .couponBtn {
            display: flex;
            gap: 11px;
            align-items: center;
            color: var(--hint-color);
          }
          .originPrice {
            width: 156px;
            display: flex;
            flex-direction: row;
            gap: 0;
            flex-wrap: nowrap;
            justify-content: space-between;
          }
          .coupon {
            width: 156px;
            display: flex;
            flex-direction: row;
            gap: 0;
            flex-wrap: nowrap;
            justify-content: space-between;
          }
          .couponTitle {
            display: flex;
            flex-direction: row;
            gap: 5px;
            flex-wrap: nowrap;
            align-items: center;
          }
          .calcLine {
            width: 100%;
            height: 1px;
            background-color: #2d2d2d;
          }
          .total {
            width: 156px;
            display: flex;
            flex-direction: row;
            gap: 0;
            flex-wrap: nowrap;
            justify-content: space-between;
          }

          .btn {
            padding-block: 6px;
            padding-inline: 47px;
            border-radius: 50px;
          }
        `}
      </style>
    </>
  )
}

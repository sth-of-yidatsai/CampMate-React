import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// 共同組件導入
import Top_btn from '@/components/tian/common/top_btn'

import CommentModal from '@/components/tian/orderHistory/commentModal'
import WriteCommentModal from '@/components/tian/orderHistory/writeCommentModal'

export default function OrderCompleteCard({ data, orderInfo }) {
  const router = useRouter()
  const order_number = localStorage.getItem('order_number')
  const [order, setOrder] = useState({})
  const goBackList = () => {
    window.location.href = `http://localhost:3000/campground/campground-list`
  }
  const goOrderHistory = () => {
    window.location.href = `http://localhost:3000/member-test/c-order-history`
  }

  const handleUpdate = async (couponId) => {
    // 需要更新的資料
    const userCoupon = {
      coupon_id: couponId,
      order_number: order_number,
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/c-order/user_coupon`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userCoupon),
          credentials: 'include',
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        console.log('更新成功')
      } else {
        console.log(`更新失敗: ${result.message}`)
      }
    } catch (error) {
      console.error('錯誤:', error)
    }
  }

  const handleOrderUpdate = async (order_number) => {
    // 需要更新的資料
    try {
      const response = await fetch(
        `http://localhost:3005/api/c-order/${order_number}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        console.log('更新成功')
      } else {
        console.log(`更新失敗: ${result.message}`)
      }
    } catch (error) {
      console.error('錯誤:', error)
    }
  }

  useEffect(() => {
    // 定義一個 async 函數來獲取數據
    const searchCouponUsed = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/c-order/${order_number}`
        )

        if (!response.ok) {
          throw new Error('網絡回應不正常')
        }

        const data = await response.json()
        setOrder(data.data.order)
        if (data.data.order.coupon_id) {
          handleUpdate(data.data.order.coupon_id)
        }
        handleOrderUpdate(order_number)
      } catch (error) {
        console.log(error.message)
      }
    }

    // 調用 fetchData 函數
    searchCouponUsed()
  }, [])

  return (
    <>
      <div className="hotel-wrapper">
        <div className="top-block-wrapper">
          <div className="top-block">
            <img src={orderInfo.campground_img} alt="" className="hotel-icon" />
            <span className="hotel-name">{orderInfo.campground_name}</span>
          </div>
          <span className="order-number">訂單編號 : {order_number}</span>
        </div>
        <div className="title-wrapper">
          <span className="title-1 title">營位</span>
          {/* <span className="title-2 title">租借時段</span> */}
          <span className="title-3 title">天數</span>
          <span className="title-4 title">人數</span>
          <span className="title-5 title">總價</span>
        </div>
        <div className="room-wrapper">
          <div className="block-1">
            <img src={orderInfo.room_img} alt="" className="room-icon" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{orderInfo.campground_name}</span>
              <span>
                {orderInfo.checkInDate + ' ~ ' + orderInfo.checkOutDate}
              </span>
            </div>
          </div>
          {/* <div className="block-2">
            {orderInfo.checkInDate + ' ~ ' + orderInfo.checkOutDate}
          </div> */}
          <div className="block-3">{orderInfo.night}</div>
          <div className="block-4">{1}</div>
          <div className="block-5">$ {order.amount}</div>
        </div>
        <div className="detail-wrapper">
          <div className="customer-detail">訂位人資訊</div>
          <div className="info-wrapper">
            <div>
              <div className="info">姓名 : {order.last_name}</div>
              <div className="info">電話 : {order.phone}</div>
              <div className="info">信箱 : {order.email}</div>
            </div>
            <div className="status-wrapper">
              {/* <div>訂單狀態</div> */}
              <div className="status">已付款完成</div>
            </div>
          </div>
        </div>
        <div className="btn-wrapper">
          <button className="record-btn" onClick={goOrderHistory}>
            查看訂單紀錄
          </button>
          <button className="return-btn" onClick={goBackList}>
            返回搜尋列表
          </button>
        </div>
      </div>

      <Top_btn />
      <style jsx>
        {`
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
            width: 952px;
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
            margin-right: 10px;
          }

          .top-block-wrapper {
            background: #e5e4cf;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 50px;
            padding: 13px 35px;
            align-items: center;
          }
          .top-block {
            display: flex;
            align-items: center;
          }
          .order-number {
            font-family: 'Noto Sans TC', sans-serif;
            font-weight: 500;
            font-size: 16px;
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
            flex-basis: 530px;
          }
          .title-2 {
            flex-basis: 377px;
          }
          .title-3 {
            flex-basis: 105px;
          }
          .title-4 {
            flex-basis: 105px;
          }
          .title-5 {
            flex-basis: 120px;
          }
          .room-wrapper {
            display: flex;
            margin-inline: 35px;
            align-items: center;
            padding-block: 20px;
            border-bottom: 1px solid #e5e4cf;
          }
          .block-1 {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-basis: 530px;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
          }
          .room-icon {
            width: 110px;
            height: 110px;
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
            flex-basis: 105px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .block-4 {
            flex-basis: 105px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .block-5 {
            flex-basis: 120px;
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            color: #de3e3e;
          }
          .detail-wrapper {
            border-bottom: 1px solid #e5e4cf;
            padding-block: 20px;
            margin-inline: 35px;
            margin-bottom: 35px;
          }
          .customer-detail {
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
            justify-content: space-between;
            align-items: end;
          }
          .info {
            display: flex;
            gap: 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            color: #8f8e93;
          }
          .status-wrapper {
            display: flex;
            gap: 15px;
            align-items: center;
          }
          .status {
            padding-inline: 30px;
            padding-block: 5px;
            border-radius: 20px;
            background: var(--hint-color);
            color: white;
          }

          .btn-wrapper {
            display: flex;
            justify-content: space-around;
            margin-bottom: 35px;
          }
          .record-btn {
            background: var(--sub-color);
            padding-inline: 30px;
            padding-block: 8px;
            color: var(--main-color-dark);
            border-radius: 30px;
            font-family: 'Montserrat';
            font-size: 20px;
            font-weight: 700;
          }
          .record-btn:hover {
            background: var(--main-color-dark);
            color: white;
          }
          .return-btn {
            background: var(--main-color-dark);
            padding-inline: 30px;
            padding-block: 8px;
            color: white;
            border-radius: 30px;
            font-family: 'Montserrat';
            font-size: 20px;
            font-weight: 700;
          }
          .return-btn:hover {
            background: var(--hint-color);
          }
        `}
      </style>
    </>
  )
}

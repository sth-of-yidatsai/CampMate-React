import React, { useState, useEffect } from 'react'
import axios from 'axios'

import OrderHistory_listCard from './orderHistory_listCard'

import toast, { Toaster } from 'react-hot-toast'

export default function OrderHistory_list({
  history,
  commentToggle,
  setCommentToggle,
  orderComment,
  setOrderComment,
  getOrderComment,
  writeCommentToggle,
}) {
  // 開啟評價商品彈出視窗
  const openComment = () => {
    if (history.order_status !== '訂單完成') {
      toast.error(`必須在完成訂單後才能評價！`)
      return
    }

    if (commentToggle === false) {
      setCommentToggle(true)
      console.log(history.order_id)
      getOrderComment(history.order_id)
      return
    }
  }

  //-----------------------------------------------------------------

  // 控制是否顯示詳細的訂單資訊
  const [showList, setShowList] = useState(false)

  const toggleList = () => {
    if (showList === false) {
      setShowList(true)
      return
    }
    setShowList(false)
  }

  //---------------------------------------------------------------

  // 控制訂單流程圖
  const orderProcess = [
    { processName: '已付款', date: '2023-12-30', time: '12:33' },
    { processName: '備貨中', date: '2023-12-31', time: '14:00' },
    { processName: '待取貨', date: '2023-12-31', time: '20:10' },
    { processName: '訂單完成', date: '2024-01-01', time: '13:04' },
  ]
  const [process, setProcess] = useState(orderProcess)

  //---------------------------------------------------------------

  const [orderItem, setOrderItem] = useState([])

  const getOrderItems = async (order_id) => {
    try {
      const url = `http://localhost:3005/api/rent_history/item/${order_id}`
      const res = await axios.get(url, { withCredentials: true })

      const status = res.data.status
      if (status === 'success') {
        setOrderItem(res.data.orderItems_rows)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //---------------------------------------------------------------

  //---------------------------------------------------------------

  const [shops, setShops] = useState([])

  const getShops = async () => {
    try {
      const url = `http://localhost:3005/api/rent_common/shop`
      const res = await axios.get(url)
      const status = res.data.status
      if (status === 'success') {
        const shops = res.data.shops
        setShops(shops)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //---------------------------------------------------------------

  //---------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    getShops()
  }, [])

  useEffect(() => {
    if (isClient) {
      getOrderItems(history.order_id)
    }
  }, [isClient])

  const [orderStatus, setOrderStatus] = useState(0)

  useEffect(() => {
    switch (history.order_status) {
      case '已付款':
        setOrderStatus(1)
        break
      case '備貨中':
        setOrderStatus(2)
        break
      case '待取貨':
        setOrderStatus(3)
        break
      case '訂單完成':
        setOrderStatus(4)
        break
    }
  }, [history])

  useEffect(() => {
    // console.log(orderItem)
  }, [orderItem, shops, orderStatus])

  return (
    <>
      <div className="orderHistory-list-tian">
        {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
        <div className="listHeader">
          <div>
            <div className="shopName p1-tc-tian dark-text-tian">
              {isClient &&
                shops.length > 0 &&
                shops.find((shop) => shop.shop_id == history.shop_id).shop_name}
            </div>
            <div className="status p3-tc-tian light-text-tian">
              {isClient && history.order_status}
            </div>
            <div className="p3-tc-tian dark-text-tian align-self-end">
              下單日期： {isClient && history.create_datetime.slice(0, 10)}
            </div>
          </div>
          <div className="orderNum">
            <span className="p1-tc-tian">訂單編號:</span>
            <span className="p1-en-tian">
              {isClient && history.order_id.slice(0, 8)}
            </span>
          </div>
        </div>
        <div className={`listBody ${showList === true ? 'show' : ''}`}>
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
            orderItem.map((item, i) => {
              return (
                <OrderHistory_listCard
                  key={item.id}
                  item={item}
                  history={history}
                />
              )
            })}
        </div>
        <div className={`orderProcess ${showList === true ? '' : 'd-none'}`}>
          <div>
            <div className="processItem">
              <div className="processCircle">
                <div className="insideCircle" />
              </div>
              <div className="processContent">
                <div className="processTitle p2-tc-tian">收到訂單</div>
                {/* <div className="processDatetime">
                  <span className="date p3-en-tian">2023-12-30</span>
                  <span className="time p3-en-tian">09:30</span>
                </div> */}
              </div>
            </div>
            {process.slice(0, Number(orderStatus)).map((v, i) => {
              return (
                <React.Fragment key={i}>
                  <div className="processLine" />
                  <div className="processItem">
                    <div className="processCircle">
                      <div className="insideCircle" />
                    </div>
                    <div className="processContent">
                      <div className="processTitle p2-tc-tian">
                        {v.processName}
                      </div>
                      {/* <div className="processDatetime">
                        <span className="date p3-en-tian">{v.date}</span>
                        <span className="time p3-en-tian">{v.time}</span>
                      </div> */}
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <div className="listFooter">
          <button onClick={toggleList} className="none-btn-tian openList">
            {showList === false ? (
              <span className="down material-symbols-outlined dark-text-tian">
                keyboard_arrow_down
              </span>
            ) : (
              <span className="up material-symbols-outlined dark-text-tian">
                keyboard_arrow_up
              </span>
            )}
          </button>
          <div>
            <div className="total">
              <span className="dark-text-tian p2-tc-tian">訂單金額：</span>
              <div className="totalPrice p1-en-tian error-text-tian">
                <span>$</span>
                <span>{history.amount}</span>
              </div>
            </div>
            {/* <button className="contact p1-tc-tian btn primary2-outline-btn-tian">
              聯絡我們
            </button> */}
            {history.order_status === '訂單完成' && (
              <button
                onClick={openComment}
                className={`comment p1-tc-tian btn ${
                  history.order_status !== '訂單完成'
                    ? 'error-btn-tian'
                    : 'primary2-btn-tian'
                }`}
              >
                評價商品
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

import React, { useState, useEffect } from 'react'

export default function OrderHistory_listCard({ item, history }) {
  //----------------------------------------------------------------------

  // 將字串轉換為 Date 對象
  const date1 = new Date(history.start_time)
  const date2 = new Date(history.end_time)

  // 計算兩個日期之間的毫秒差
  const timeDiff = Math.abs(date2 - date1) // 使用 Math.abs 以防日期順序錯誤

  // 將毫秒差轉換為天數
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <>
      <div className="listCard">
        <div className="image">
          <div className="imgBox">
            <img src={`/tian/image/${isClient && item.main_img}`} alt="" />
          </div>
        </div>
        <div className="product">
          <div className="productTitle">
            <p className="p2-tc-tian dark-text-tian m-0 productName">
              {isClient && item.product_name}
            </p>
            <p className="p2-en-tian dark-text-tian m-0">
              {isClient && history.start_time}~{isClient && history.end_time}
            </p>
          </div>
          <div className="productStyle">
            <span className="p2-tc-tian sub-text-tian">
              {isClient && item.style_name != '' && item.style_name}
              {isClient && item.size_name != '' && item.size_name}
            </span>
          </div>
        </div>
        <div className="date">
          <span className="p2-en-tian dark-text-tian">
            {isClient && history.start_time}~{isClient && history.end_time}
          </span>
        </div>
        <div className="day">
          <span className="p2-en-tian dark-text-tian">{diffDays}</span>
        </div>
        <div className="count">
          <div className="countNum p2-en-tian">{isClient && item.count}</div>
        </div>
        <div className="amount p2-en-tian error-text-tian">
          <span>$</span>
          <span>{isClient && item.product_price * item.count * diffDays}</span>
        </div>
      </div>
    </>
  )
}

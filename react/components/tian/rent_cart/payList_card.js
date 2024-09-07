import React, { useState, useEffect } from 'react'

export default function PayList_card({ item }) {
  // --------------------------------------------------------------

  // 將字串轉換為 Date 對象
  const date1 = new Date(item.start_time)
  const date2 = new Date(item.end_time)

  // 計算兩個日期之間的毫秒差
  const timeDiff = Math.abs(date2 - date1) // 使用 Math.abs 以防日期順序錯誤

  // 將毫秒差轉換為天數
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

  // --------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <>
      <div className="listCard-pay-tian">
        <div className="image">
          <div className="imgBox">
            <img src={`/tian/image/${item.main_img}`} alt="" />
          </div>
        </div>
        <div className="product">
          <div className="productTitle">
            <p className="p2-tc-tian dark-text-tian m-0">
              {isClient && item.product_name}
            </p>
          </div>
          <div className="productStyle">
            <span className="p2-en-tian sub-text-tian">
              {isClient && item.style !== '' && item.style}
              {isClient && item.size !== '' && item.size}
            </span>
          </div>
        </div>
        <div className="date">
          <span className="p2-en-tian dark-text-tian">
            {isClient && `${item.start_time}~${item.end_time}`}
          </span>
        </div>
        <div className="day">
          <span className="p2-en-tian dark-text-tian">
            {isClient && diffDays}
          </span>
        </div>
        <div className="count">
          <div className="countNum p2-en-tian">{isClient && item.qty}</div>
        </div>
        <div className="amount p2-en-tian error-text-tian">
          <span>$</span>
          <span> {isClient && item.qty * item.price * diffDays}</span>
        </div>
      </div>
    </>
  )
}

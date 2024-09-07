import React, { useState } from 'react'

export default function Order_status_tab({ statusName, setStatusName }) {
  const orderStatus = [
    { statusName: '全部' },
    { statusName: '已付款' },
    { statusName: '待取貨' },
    { statusName: '訂單完成' },
  ]

  const [status, setStatus] = useState(orderStatus)

  const [activeIndex, setActiveIndex] = useState(0) // 跟踪當前選中的索引

  const handleClick = (index, status) => {
    setActiveIndex(index) // 更新選中的索引
    setStatusName(status)
  }

  return (
    <>
      <div className="listTab-tian">
        <ul className="nav nav-tabs">
          {status.map((v, i) => {
            return (
              <li key={i} className="nav-item">
                <div className="left" />
                <div
                  className={`nav-link ${i === activeIndex ? 'active' : ''}`}
                  aria-current="page"
                  onClick={() => {
                    handleClick(i, v.statusName)
                  }}
                >
                  {v.statusName}
                </div>
                <div className="right" />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

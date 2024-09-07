import React, { useState } from 'react'

export default function Order_status_tab({ onStatusChange }) {
  const orderStatus = [
    { statusName: '全部' },
    { statusName: '未入住' },
    { statusName: '已完成' },
    { statusName: '已取消' },
  ]

  const [status, setStatus] = useState(orderStatus)

  const [activeIndex, setActiveIndex] = useState(0) // 跟踪當前選中的索引

  const handleClick = (index) => {
    setActiveIndex(index) // 更新選中的索引
    onStatusChange(orderStatus[index].statusName) // 通知父組件狀態變化
  }

  return (
    <>
      <div className="listTab-tian">
        <ul className="nav nav-tabs">
          {status.map((v, i) => {
            return (
              <li key={i} className="nav-item">
                <div className="left" />
                <a
                  className={`nav-link ${i === activeIndex ? 'active' : ''}`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleClick(i)}
                >
                  {v.statusName}
                </a>
                <div className="right" />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

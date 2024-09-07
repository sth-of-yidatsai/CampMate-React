import React, { useState } from 'react'

export default function Coupon_status_tab({ onFilterChange }) {
  const orderStatus = [
    { statusName: '已領取' },
    { statusName: '已使用' },
    { statusName: '未使用' },
    { statusName: '稍後可用' },
    { statusName: '已過期' },
  ]

  const [activeIndex, setActiveIndex] = useState(0) // 跟踪當前選中的索引

  const handleClick = (index) => {
    setActiveIndex(index) // 更新選中的索引
    onFilterChange(orderStatus[index].statusName) // 調用 onFilterChange 函數更新篩選器狀態
  }

  return (
    <>
      <div className="listTab-tian">
        <ul className="nav nav-tabs">
          {orderStatus.map((v, i) => (
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
          ))}
        </ul>
      </div>
    </>
  )
}

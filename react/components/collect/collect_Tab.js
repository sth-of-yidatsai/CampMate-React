import React, { useState, useEffect } from 'react'

export default function Collect_tab({ onTabChange, currentTab }) {
  const orderStatus = [
    { statusName: '營地', value: 'collect_campground' },
    { statusName: '商品', value: 'collect_product' },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const index = orderStatus.findIndex((v) => v.value === currentTab)
    setActiveIndex(index >= 0 ? index : 0)
  }, [currentTab])

  const handleClick = (index) => {
    setActiveIndex(index)
    onTabChange(orderStatus[index].value)
    if (typeof window !== 'undefined') {
      // 僅在客戶端環境中運行
      localStorage.setItem('collectTab', orderStatus[index].value)
    }
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

import React, { useEffect } from 'react'

export default function Info_tab({ activeSection }) {
  return (
    <>
      <div className="infoTab-tian">
        {/* !! bootstrap tab */}
        <ul className="nav nav-pills">
          <li className="nav-item">
            <a
              className={`nav-link ${activeSection === 'des' ? 'active' : ''}`}
              aria-current="page"
              href="#des"
            >
              詳細資訊
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeSection === 'spec' ? 'active' : ''}`}
              href="#spec"
            >
              尺寸規格
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeSection === 'comment' ? 'active' : ''
              }`}
              href="#comment"
            >
              商品評論
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}

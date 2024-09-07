import React, { useState, useEffect } from 'react'


export default function OrderHistoryCard({ commentToggle, setCommentToggle }) {
  // 開啟評價商品彈出視窗
  const openComment = () => {
    if (commentToggle === false) {
      setCommentToggle(true)
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
    { processName: '確認訂單', date: '2023-12-30', time: '12:33' },
    { processName: '揀貨中', date: '2023-12-31', time: '14:00' },
    { processName: '待取貨', date: '2023-12-31', time: '20:10' },
    { processName: '訂單完成', date: '2024-01-01', time: '13:04' },
  ]
  const [process, setProcess] = useState(orderProcess)

  return (
    <>
      <div className="orderHistory-list-tian">
        {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
        <div className="listHeader">
          <div>
            <div className="shopName p1-tc-tian dark-text-tian">台北忠孝店</div>
            <div className="status p3-tc-tian light-text-tian">收到訂單</div>
          </div>
          <div className="orderNum">
            <span className="p1-tc-tian">訂單編號:</span>
            <span className="p1-en-tian">123456789</span>
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
          
        </div>
        <div className={`orderProcess ${showList === true ? '' : 'd-none'}`}>
          <div>
            <div className="processItem">
              <div className="processCircle">
                <div className="insideCircle" />
              </div>
              <div className="processContent">
                <div className="processTitle p2-tc-tian">收到訂單</div>
                <div className="processDatetime">
                  <span className="date p3-en-tian">2023-12-30</span>
                  <span className="time p3-en-tian">09:30</span>
                </div>
              </div>
            </div>
            {process.map((v, i) => {
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
                      <div className="processDatetime">
                        <span className="date p3-en-tian">{v.date}</span>
                        <span className="time p3-en-tian">{v.time}</span>
                      </div>
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
                <span>$ 13000</span>
              </div>
            </div>
            <button className="contact p1-tc-tian btn primary2-outline-btn-tian">
              聯絡我們
            </button>
            <button
              onClick={openComment}
              className="comment p1-tc-tian btn primary2-btn-tian"
            >
              評價
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

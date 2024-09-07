import React from 'react'

export default function Cart_process({ process }) {
  return (
    <>
      <section className="cartProcess-tian">
        <div className={`processItem ${process === 1 ? 'active' : ''}`}>
          <div className="processIcon">
            <span>1</span>
            <span className="material-symbols-outlined">check</span>
          </div>
          <div className="processTitle">訂單明細確認</div>
        </div>
        <div className="processLine" />
        <div className={`processItem ${process === 2 ? 'active' : ''}`}>
          <div className="processIcon">
            <span>2</span>
            <span className="material-symbols-outlined">check</span>
          </div>
          <div className="processTitle">填寫付款資訊</div>
        </div>
        <div className="processLine" />
        <div className={`processItem ${process === 3 ? 'active' : ''}`}>
          <div className="processIcon">
            <span>3</span>
            <span className="material-symbols-outlined">check</span>
          </div>
          <div className="processTitle">預定完成</div>
        </div>
        <div className={`processItem d-none ${process === 4 ? 'active' : ''}`}>
          <div className="processIcon">
            <span>3</span>
            <span className="material-symbols-outlined">check</span>
          </div>
          <div className="processTitle">預定完成</div>
        </div>
      </section>
    </>
  )
}

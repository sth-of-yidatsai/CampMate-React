import React, { useState } from 'react'

import Rating from '@mui/material/Rating'

export default function WriteCommentModal({
  commentToggle,
  setCommentToggle,
  writeCommentToggle,
  setWriteCommentToggle,
}) {
  const [value, setValue] = useState(0)

  const closeWriteComment = () => {
    if (writeCommentToggle === true) {
      setWriteCommentToggle(false)
      setCommentToggle(true)
      return
    }
  }

  return (
    <>
      <section
        className={`writeCommentModal-tian ${
          writeCommentToggle === true ? '' : 'd-none'
        }`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">撰寫評價</div>
          <div onClick={closeWriteComment} className="close">
            <span className="material-symbols-outlined light-text-tian">
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="bodyHeader">
            <div className="bodyTitle h6-tc-tian dark-text-tian">
              評價此商品
            </div>
          </div>
          <div className="content">
            <div className="commentCard">
              <div className="productInfo">
                <div className="image">
                  <div className="imgBox">
                    <img src="/tian/tent_08-2.avif" alt="" />
                  </div>
                </div>
                <div className="product">
                  <div className="titleCount">
                    <div className="productTitle">
                      <div className="productName p2-tc-tian dark-text-tian m-0">
                        LOGOS-Tradcanvas抗光黑膠基地帳Decagon 500-BA
                      </div>
                      <span className="date p2-en-tian dark-text-tian">
                        2024/01/01 ~ 2024/01/05
                      </span>
                    </div>
                    <div className="count">
                      <span className="material-symbols-outlined">close</span>
                      <div className="countNum p1-en-tian">1</div>
                    </div>
                  </div>
                  <div className="productStyle">
                    <span className="p2-en-tian sub-text-tian">規格名稱</span>
                  </div>
                </div>
              </div>
              <div className="commentBlock">
                <Rating
                  onChange={(event, newValue) => {
                    setValue(newValue)
                  }}
                  name="rating"
                  value={value}
                  sx={{ color: '#e49366' }}
                />
                <textarea
                  className="commentText"
                  placeholder="請填寫您對此商品的真實評價"
                  name=""
                  id=""
                  defaultValue={''}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div>
            <button className="cancel btn primary2-outline-btn-tian p1-tc-tian">
              取消
            </button>
            <button className="confirm btn primary2-btn-tian p1-tc-tian">
              確認
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

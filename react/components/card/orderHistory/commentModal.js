import React from 'react'

export default function CommentModal({
  commentToggle,
  setCommentToggle,
  writeCommentToggle,
  setWriteCommentToggle,
}) {
  const closeComment = () => {
    if (commentToggle === true) {
      setCommentToggle(false)
      return
    }
  }

  const openWriteComment = () => {
    if (writeCommentToggle === false) {
      setWriteCommentToggle(true)
      setCommentToggle(false)
      return
    }
  }

  return (
    <>
      <section
        className={`commentModal-tian ${
          commentToggle === true ? '' : 'd-none'
        }`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">商品評價</div>
          <div onClick={closeComment} className="close">
            <span className="material-symbols-outlined light-text-tian">
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="bodyHeader">
            <div className="bodyTitle h6-tc-tian dark-text-tian">
              選擇要評價的商品
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
                  <div className="styleComment">
                    <div className="productStyle">
                      <span className="p2-en-tian sub-text-tian">規格名稱</span>
                    </div>
                    <div onClick={openWriteComment} className="commentBtn">
                      <button>
                        <div className="fix">修改評價</div>
                        <div className="comment">評價</div>
                        <span className="fix material-symbols-outlined">
                          border_color
                        </span>
                        <span className="comment material-symbols-outlined">
                          arrow_outward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="commentBlock">
                <div className="star" />
                <div className="commentText p2-tc-tian dark-text-tian">
                  帳篷的品質不錯，配件都相當實用，雖然價格偏高，但是整體來說是值得的。
                </div>
              </div>
              <div className="cardLine" />
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

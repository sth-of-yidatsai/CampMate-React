import React, { useState, useEffect } from 'react'

import Rating from '@mui/material/Rating'

import axios from 'axios'

export default function CommentModal({
  commentToggle,
  setCommentToggle,
  writeCommentToggle,
  setWriteCommentToggle,
  orderComment,
  writeComment,
  setWriteComment,
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

  const goToComment = (comment) => {
    console.log(`即將傳遞進新增評價視窗：`)
    console.log(comment)
    setWriteComment(comment)
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log(`modal裏面`)
    console.log(orderComment)
    console.log(orderComment.length)
  }, [orderComment])

  useEffect(() => {}, [writeComment])

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
            {isClient &&
              orderComment?.length > 0 &&
              orderComment.map((comment, i) => {
                return (
                  <div key={comment.id} className="commentCard">
                    <div className="productInfo">
                      <div className="image">
                        <div className="imgBox">
                          <img src={`/tian/image/${comment.main_img}`} alt="" />
                        </div>
                      </div>
                      <div className="product">
                        <div className="titleCount">
                          <div className="productTitle">
                            <div className="productName p2-tc-tian dark-text-tian m-0">
                              {comment.product_name}
                            </div>
                            <span className="date p2-en-tian dark-text-tian">
                              {comment.start_time + `~` + comment.end_time}
                            </span>
                          </div>
                          <div className="count">
                            <span className="material-symbols-outlined">
                              close
                            </span>
                            <div className="countNum p1-en-tian">
                              {comment.count}
                            </div>
                          </div>
                        </div>
                        <div className="styleComment">
                          <div className="productStyle">
                            <span className="p2-en-tian sub-text-tian">
                              {comment.style_name &&
                                `顏色：` + comment.style_name}
                              {comment.size_name &&
                                `尺寸：` + comment.size_name}
                            </span>
                          </div>
                          <div
                            onClick={() => {
                              openWriteComment()
                              goToComment(comment)
                            }}
                            className="commentBtn"
                          >
                            {comment.status < 1 && (
                              <button>
                                <div
                                  className={`fix p2-tc-tian ${
                                    !comment.content && 'd-none'
                                  }`}
                                >
                                  修改評價
                                </div>
                                <div
                                  className={`comment  p2-tc-tian ${
                                    comment.content && 'd-none'
                                  }`}
                                >
                                  評價
                                </div>
                                <span
                                  className={`fix material-symbols-outlined ${
                                    !comment.content && 'd-none'
                                  }`}
                                >
                                  border_color
                                </span>
                                <span
                                  className={`comment material-symbols-outlined ${
                                    comment.content && 'd-none'
                                  }`}
                                >
                                  arrow_outward
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`commentBlock ${!comment.content && 'd-none'}`}
                    >
                      <Rating
                        readOnly
                        name="rating"
                        value={comment?.rating}
                        sx={{ color: '#e49366' }}
                        size="small"
                      />
                      <div
                        className={`commentText p2-tc-tian dark-text-tian ${
                          !comment.content && 'd-none'
                        }`}
                      >
                        {comment.content}
                      </div>
                    </div>
                    <div className="cardLine" />
                  </div>
                )
              })}
          </div>
        </div>
        {/* <div className="footer">
          <div>
            <button className="cancel btn primary2-outline-btn-tian p1-tc-tian">
              返回
            </button>
            <button className="confirm btn primary2-btn-tian p1-tc-tian">
              確認
            </button>
          </div>
        </div> */}
      </section>
    </>
  )
}

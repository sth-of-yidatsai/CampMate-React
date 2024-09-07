import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Rating from '@mui/material/Rating'

export default function WriteCommentModal({
  userId,
  commentToggle,
  setCommentToggle,
  writeCommentToggle,
  setWriteCommentToggle,
  writeComment,
  setWriteComment,
  getOrderComment,
  MySwal,
}) {
  const [ratingValue, setRatingValue] = useState(0)
  const [contentValue, setContentValue] = useState('')

  const handleChangeContent = (e) => {
    setContentValue(e.target.value)
  }

  const closeWriteComment = () => {
    if (writeCommentToggle === true) {
      setWriteCommentToggle(false)
      setCommentToggle(true)
      return
    }
  }

  const cleanValue = () => {
    setRatingValue(0)
    setContentValue('')
  }

  // 刪除的彈出視窗
  const addCommentAlert = () => {
    MySwal.fire({
      title: '新增商品評價',
      text: '新增後將會有一次的修改機會，確定要送出此評價嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已新增!',
          text: '已經新增此商品評價！',
          icon: 'success',
        })

        addComment()

        closeWriteComment()
      } else {
      }
    })
  }

  // 刪除的彈出視窗
  const editCommentAlert = () => {
    MySwal.fire({
      title: '修改商品評價',
      text: '修改後將無法再變更評價內容，確定要送出此修改嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已修改!',
          text: '已經修改此商品評價！',
          icon: 'success',
        })

        editComment()

        closeWriteComment()
      } else {
      }
    })
  }

  const addComment = async () => {
    console.log(`新增評論`)
    const commentFormData = {
      order_id: writeComment.shop_order_id,
      product_id: writeComment.product_id,
      price_id: writeComment.price_id,
      user_id: userId,
      rating: ratingValue,
      content: contentValue,
    }
    console.log(`formdata內容:`)
    console.log(commentFormData)
    try {
      const url = `http://localhost:3005/api/rent_history/comment`
      const res = await axios.post(url, commentFormData)
      const status = res.data.status
      if (status === 'success') {
        console.log(`新增評價成功`)
      }

      getOrderComment(writeComment.shop_order_id)
      setRatingValue(0)
      setContentValue('')
    } catch (err) {
      console.log(`新增評價失敗，錯誤訊息：${err}`)
    }
  }

  const editComment = async () => {
    console.log(`更新評論`)
    const commentFormData = {
      comment_id: writeComment.comment_id,
      rating: ratingValue,
      content: contentValue,
    }
    console.log(`formdata內容:`)
    console.log(commentFormData)
    try {
      const params = new URLSearchParams(commentFormData).toString()
      const url = `http://localhost:3005/api/rent_history/comment?${params}`
      const res = await axios.put(url)
      const status = res.data.status
      if (status === 'success') {
        console.log(`更新評價成功`)
      }

      getOrderComment(writeComment.shop_order_id)
      setRatingValue(0)
      setContentValue('')
    } catch (err) {
      console.log(`更新評價失敗，錯誤訊息：${err}`)
    }
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (writeComment.content) {
        setContentValue(writeComment.content)
        setRatingValue(writeComment.rating)
      }
    }
  }, [isClient, writeCommentToggle])

  useEffect(() => {
    console.log(`新增修改頁面 writeComment:`)
    console.log(writeComment)
    // console.log(writeComment, ratingValue, userId, contentValue)
  }, [writeComment, ratingValue, userId, contentValue])

  return (
    <>
      <section
        className={`writeCommentModal-tian ${
          writeCommentToggle === true ? '' : 'd-none'
        }`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">撰寫評價</div>
          <div
            onClick={() => {
              cleanValue()
              closeWriteComment()
            }}
            className="close"
          >
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
                    <img
                      src={`/tian/image/${
                        isClient &&
                        Object.keys(writeComment)?.length > 0 &&
                        writeComment.main_img
                      }`}
                      alt=""
                    />
                  </div>
                </div>
                <div className="product">
                  <div className="titleCount">
                    <div className="productTitle">
                      <div className="productName p2-tc-tian dark-text-tian m-0">
                        {isClient &&
                          Object.keys(writeComment)?.length > 0 &&
                          writeComment.product_name}
                      </div>
                      <span className="date p2-en-tian dark-text-tian">
                        2024/01/01 ~ 2024/01/05
                      </span>
                    </div>
                    <div className="count">
                      <span className="material-symbols-outlined">close</span>
                      <div className="countNum p1-en-tian">
                        {isClient &&
                          Object.keys(writeComment)?.length > 0 &&
                          writeComment.count}
                      </div>
                    </div>
                  </div>
                  <div className="productStyle">
                    <span className="p2-en-tian sub-text-tian">
                      {isClient &&
                        Object.keys(writeComment)?.length > 0 &&
                        writeComment.style_name &&
                        `顏色：` + writeComment.style_name}
                      {isClient &&
                        Object.keys(writeComment)?.length > 0 &&
                        writeComment.size_name &&
                        `尺寸：` + writeComment.size_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="commentBlock">
                <Rating
                  onChange={(event, newValue) => {
                    setRatingValue(newValue)
                  }}
                  name="rating"
                  value={ratingValue}
                  sx={{ color: '#e49366' }}
                />
                <textarea
                  className="commentText"
                  placeholder="請填寫您對此商品的真實評價"
                  name=""
                  id=""
                  value={contentValue}
                  onChange={(e) => {
                    handleChangeContent(e)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div>
            <button
              className="cancel btn primary2-outline-btn-tian p1-tc-tian"
              onClick={() => {
                cleanValue()
                closeWriteComment()
              }}
            >
              取消
            </button>
            <button
              className="confirm btn primary2-btn-tian p1-tc-tian"
              onClick={() => {
                writeComment?.rating ? editCommentAlert() : addCommentAlert()
              }}
            >
              確認
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

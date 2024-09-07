import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import OrderHistory_listCard from './orderHistory_listCard'
import { LiaTimesSolid } from 'react-icons/lia'

// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// MUI
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Rating from '@mui/material/Rating'

import { RiEditFill } from 'react-icons/ri'

export default function OrderHistory_list({
  commentToggle,
  setCommentToggle,
  order,
  orders,
  currentStatus,
}) {
  const {
    status,
    campground_id,
    room_id,
    check_in_date,
    check_out_date,
    people,
    amount,
    order_number,
    coupon_id,
    note,
  } = order

  const [orderStatus, setOrderStatus] = useState('')

  const today = new Date()
  const formattedToday = today.toISOString().split('T')[0]
  const checkInDate = new Date(check_in_date)
  const checkOutDate = new Date(check_out_date)

  const [campground, setCampground] = useState({})
  const [room, setRoom] = useState({})
  const [review, setReview] = useState({
    id: 0,
    campground_id: 0,
    user_id: 0,
    c_order_id: '',
    rating: 0,
    review_content: '',
    created_at: '',
    updated_at: '',
  })
  const [couponName, setCouponName] = useState('')

  // 文字輸入框
  const [inputText, setInputText] = useState('')

  // 控制打開讓使用者修改評價
  const [fixOpen, setFixOpen] = useState(false)
  const handleFixOpen = () => {
    setFixOpen(true)
  }

  const getCampground = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/campground/${campground_id}`
      )
      const data = await response.json()
      setCampground(data.data.campground)
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const getRoom = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/room/${room_id}`)
      const data = await response.json()
      setRoom(data.data.room)
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const getReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/c-review/${order_number}`,
        {
          method: 'GET', // 確保使用正確的 HTTP 方法
          credentials: 'include', // 包含 cookies 和其他認證資訊
        }
      )
      const data = await response.json()
      if (data.status === 'success') {
        setReview(data.data.review)
        setInputText(data.data.review.review_content)
        setValue(data.data.review.rating)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const getCoupon = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/coupon/${coupon_id}`
      )
      const data = await response.json()
      if (data.status === 'success') {
        setCouponName(data.data.coupon_name)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const addReview = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/c-review/`, {
        method: 'POST', // 確保使用正確的 HTTP 方法
        credentials: 'include', // 包含 cookies 和其他認證資訊
        headers: {
          'Content-Type': 'application/json', // 設置內容類型為 JSON
        },
        body: JSON.stringify({
          // 將數據轉換為 JSON 字符串
          campground_id: campground_id,
          order_number: order_number,
          rating: value,
          review_content: inputText,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        // 成功新增 review，顯示返回的 review 資訊
        console.log('Review added successfully:', data.data.review)
        setReview(data.data.review)
      } else {
        // 處理錯誤
        console.error('Error adding review:', data.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const editReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/c-review/${order_number}`,
        {
          method: 'PUT', // 確保使用正確的 HTTP 方法
          credentials: 'include', // 包含 cookies 和其他認證資訊
          headers: {
            'Content-Type': 'application/json', // 設置內容類型為 JSON
          },
          body: JSON.stringify({
            // 將數據轉換為 JSON 字符串
            rating: value,
            review_content: inputText,
          }),
        }
      )
      // 檢查響應是否為成功狀態
      if (response.ok) {
        const data = await response.json()
        console.log(data.message)
        setReview(data.data.review)
      } else {
        const errorData = await response.json()
        console.error('Error updating review:', errorData.message)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  const handleSubmit = () => {
    if (review.review_content) {
      editReview()
    } else {
      addReview()
    }
    handleClose()
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

  useEffect(() => {
    getCampground()
    getRoom()
    getReview()
    getCoupon()

    if (status === 'paid' && today > checkOutDate) {
      setOrderStatus('已完成')
    } else if (status === 'paid' && today < checkInDate) {
      setOrderStatus('未入住')
    } else if (status !== 'paid') {
      setOrderStatus('已取消')
    } else {
      setOrderStatus('入住中')
    }
  }, [orders, currentStatus])

  // SweetAlert
  const MySwal = withReactContent(Swal)
  const notifyComment = () => {
    MySwal.fire({
      title: '需完成入住才能留下評價唷!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    })
  }

  // 開關 Modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => {
    if (orderStatus === '已完成') {
      setOpen(true)
    } else {
      notifyComment()
    }
  }
  const handleClose = () => {
    setOpen(false)
    setFixOpen(false)
  }

  // ---- Modal 樣式------
  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 620,
    // height: 580,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '18px',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  // 評價星星
  const [value, setValue] = useState(0)

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="times" onClick={handleClose}>
            <LiaTimesSolid />
          </button>
          <div className="top">營地評價</div>
          <div className="wrapper">
            <span className="rate-camp">評價此商品</span>
            <div className="top-wrapper">
              <div className="hotel-wrapper">
                <img
                  src={campground.title_img_path}
                  alt=""
                  className="title-img"
                />
                <div className="title-wrapper">
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span className="hotel-name">
                      {campground.campground_name}
                    </span>
                    <span>{order.people} 人</span>
                  </div>

                  <span className="stay">
                    {check_in_date} ~ {check_out_date}
                  </span>
                  <div
                    style={{
                      height: '21px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'end',
                    }}
                  >
                    <span className="room_name">{room.room_name}</span>
                    {review.review_content && !fixOpen ? (
                      <button className="commentBtn" onClick={handleFixOpen}>
                        <div className="fix">修改評價</div>
                        <RiEditFill />
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            {review.review_content ? (
              <>
                {fixOpen ? (
                  <>
                    <Rating
                      size="large"
                      sx={{
                        color: '#e49366',
                      }}
                      name="simple-controlled"
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue)
                      }}
                    />
                    <textarea
                      className="commentText"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value)
                      }}
                    ></textarea>
                  </>
                ) : (
                  <div className="review-wrapper">
                    <Rating
                      size="large"
                      value={Number(review.rating)}
                      precision={0.1}
                      readOnly
                      sx={{
                        color: '#e49366',
                      }}
                      name="simple-controlled"
                    />
                    <div>{review.review_content}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Rating
                  size="large"
                  sx={{
                    color: '#e49366',
                  }}
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue)
                  }}
                />
                <textarea
                  className="commentText"
                  placeholder="請填寫您對此商品的真實評價"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value)
                  }}
                ></textarea>
              </>
            )}
          </div>
          <div className="down">
            <div>
              <button
                className="cancel btn primary2-outline-btn-tian p1-tc-tian cancel-btn"
                onClick={handleClose}
              >
                取消
              </button>
              <button
                className="confirm btn primary2-btn-tian p1-tc-tian confirm-btn"
                onClick={handleSubmit}
              >
                確認
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <div className="orderHistory-list-tian">
        {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
        <div className="listHeader">
          <div>
            <div className="shopName p1-tc-tian dark-text-tian">
              {campground.campground_name}
            </div>
            <div
              className="status p3-tc-tian light-text-tian"
              style={{
                background:
                  orderStatus === '已取消'
                    ? 'gray'
                    : orderStatus === '未入住'
                    ? 'var(--main-color-dark)'
                    : '',
              }}
            >
              {orderStatus}
            </div>
          </div>
          <div className="orderNum">
            <span className="p1-tc-tian">訂單編號:</span>
            <span className="p1-en-tian">{order_number}</span>
          </div>
        </div>
        <div className={`listBody ${showList === true ? 'show' : ''}`}>
          <div className="cardHeader">
            <div className="image" />
            <div className="product p3-tc-tian sub-text-tian">商品</div>
            <div className="date p3-tc-tian sub-text-tian">入住時段</div>
            <div className="day p3-tc-tian sub-text-tian">天數</div>
            <div className="count p3-tc-tian sub-text-tian">人數</div>
            <div className="amount p3-tc-tian sub-text-tian">價格</div>
          </div>
          {/*## ↓↓↓↓ 訂單商品卡片 ↓↓↓↓ */}
          <OrderHistory_listCard
            campground={campground}
            room={room}
            check_in_date={check_in_date}
            check_out_date={check_out_date}
            amount={amount}
            people={people}
            couponName={couponName}
          />
        </div>
        <div className={`orderProcess ${showList === true ? '' : 'd-none'}`}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            <p>備註:</p>
            <p>{note}</p>
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
                <span>{amount}</span>
              </div>
            </div>
            <Link href={'/custer-server/custerServer'}>
              <button className="contact p1-tc-tian btn primary2-outline-btn-tian">
                聯絡我們
              </button>
            </Link>
            <button
              onClick={handleOpen}
              className="comment p1-tc-tian btn primary2-btn-tian"
            >
              評價
            </button>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .orderProcess {
            display: flex;
            flex-direction: row;
            gap: 0;
            flex-wrap: nowrap;
            align-items: flex-start;
            padding-block: 20px;
            padding-left: 35px;
            padding-right: 145px;
            margin-inline: 20px;
            height: 100px;
            background-color: #f5f5f7;
            border-top: 0.5px solid #8f8e93;
          }
          .times {
            position: absolute;
            z-index: 999;
            right: -20px;
            top: -20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--main-color-bright);
            display: grid;
            place-items: center;
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            outline: none;
            border: none;
          }
          .times:hover {
            background: var(--hint-color);
            cursor: pointer;
          }
          .top {
            padding-inline: 35px;
            padding-block: 7px;
            width: 100%;
            height: 42px;
            background: var(--main-color-dark);
            border-radius: 18px 18px 0 0;
            color: white;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
          }
          .commentBtn {
            display: flex;
            padding: 4px 20px;
            gap: 5px;
            border-radius: 40px;
            border: 2px solid #e49366;
            background: #e5e4cf;
            align-items: center;
            color: #e49366;
          }
          .commentBtn2 {
            display: flex;
            padding: 4px 20px;
            gap: 5px;
            border-radius: 40px;
            border: 2px solid #e49366;
            background: #e49366;
            align-items: center;
            color: #e49366;
          }
          .fix {
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            color: #e49366;
          }
          .wrapper {
            width: 529px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
            padding-block: 16px;
          }
          .review-wrapper {
            margin-top: 5px;
            border: 2px solid var(--hint-color);
            border-radius: 20px;
            background: var(--sub-color);
            width: 100%;
            padding-inline: 20px;
            padding-block: 13px;
            display: flex;
            flex-direction: column;
            gap: 11px;
          }
          .title-img {
            width: 88px;
            height: 88px;
            object-fit: cover;
          }
          .commentText {
            flex: 1 1 auto;
            resize: none;
            width: 100%;
            height: 246px;
            padding: 20px;
            border-radius: 20px;
            background-color: #f5f5f7;
          }
          .top-wrapper {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .rate-camp {
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
          }
          .hotel-wrapper {
            display: flex;
            gap: 20px;
          }
          .title-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .hotel-name {
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
          }
          .stay {
            font-family: Montserrat;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .room_name {
            color: #8f8e93;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .cancel-btn {
            border-radius: 30px;
            padding-inline: 48px;
            margin-right: 9px;
          }
          .confirm-btn {
            border-radius: 30px;
            padding-inline: 48px;
          }
          .down {
            padding-inline: 30px;
            height: 50px;
            width: 100%;
            background: #e5e4cf;
            display: flex;
            justify-content: end;
            align-items: center;
            border-radius: 0 0 18px 18px;
          }
        `}
      </style>
    </>
  )
}

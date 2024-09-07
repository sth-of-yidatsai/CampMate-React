import { useState, useEffect, useRef } from 'react'
import validator from 'validator'
import { useRouter } from 'next/router'

import { useSearch } from '@/hooks/use-search'
import { useAuthTest } from '@/hooks/use-auth-test'

// sweetAlert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6'

export default function ConfirmCard({ handleNext, data, setData, orderInfo }) {
  const { calenderValue, people } = useSearch()
  const { auth } = useAuthTest()

  const [startDateStr, endDateStr] = calenderValue.split('~')

  // 创建 Date 对象
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  // 计算时间差（毫秒）
  const timeDifference = (endDate - startDate) / (1000 * 60 * 60 * 24)

  const initErrorData = {
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
  }
  const [errors, setErrors] = useState({ ...initErrorData })
  const inputRefs = useRef([])

  // 所有欄位共用的事件處理函式
  const handleFieldChange = (e) => {
    return setData({ ...data, [e.target.name]: e.target.value })
  }

  // 判斷某欄位是否有發生驗証錯誤(有錯誤訊息)
  const hasError = (errors, fieldname) => {
    return !!errors[fieldname]
  }

  const validateFields = (data, errors, fieldname = '') => {
    // 先建立空白的錯誤訊息，代表每次檢查均需重置所有錯誤訊息開始檢查起
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    // 以下使用`||=`語法是同時間只有一個錯誤訊息，而且會寫在愈上面檢查的為主
    if (validator.isEmpty(data.lastName, { ignore_whitespace: true })) {
      newErrors.lastName ||= '請填入姓氏'
      return fieldname
        ? { ...errors, [fieldname]: newErrors[fieldname] }
        : newErrors
    }

    // if (validator.isEmpty(data.firstName, { ignore_whitespace: true })) {
    //   newErrors.firstName ||= '請填入名字'
    //   return fieldname
    //     ? { ...errors, [fieldname]: newErrors[fieldname] }
    //     : newErrors
    // }

    // if (data.firstName.length > 6) {
    //   newErrors.password ||= '名字至多6個字元'
    //   return fieldname
    //     ? { ...errors, [fieldname]: newErrors[fieldname] }
    //     : newErrors
    // }

    if (validator.isEmpty(data.phone, { ignore_whitespace: true })) {
      newErrors.phone ||= '連絡電話為必填欄位'
      return fieldname
        ? { ...errors, [fieldname]: newErrors[fieldname] }
        : newErrors
    }

    if (validator.isEmpty(data.email, { ignore_whitespace: true })) {
      newErrors.email ||= '電子郵件為必填欄位'
      return fieldname
        ? { ...errors, [fieldname]: newErrors[fieldname] }
        : newErrors
    }

    if (!validator.isEmail(data.email)) {
      newErrors.email ||= '電子郵件格式不正確'
      return fieldname
        ? { ...errors, [fieldname]: newErrors[fieldname] }
        : newErrors
    }

    // 回傳視是單欄位檢查(blur)->回傳只改變此欄位errors物件
    // 還是全體檢查(submit)->回傳整個改變過errors物件
    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  // 每欄位失焦時會進行該欄位的檢查，如果有錯誤會呈現，或是正確後消去錯誤訊息
  const handleBlur = (e) => {
    const newErrors = validateFields(data, errors, e.target.name)
    setErrors(newErrors)
  }

  const handleSubmit = () => {
    // e.preventDefault()
    // const formdata = new FormData(e.target)
    // const inputs = e.target.elements

    // 驗証錯誤後，呈現錯誤訊息
    const newErrors = validateFields(data, errors)
    setErrors(newErrors)

    // 對所有欄位進行迴圈，聚焦(focus)在第一個發生錯誤的欄位
    for (let i = 0; i < inputRefs.current.length; i++) {
      const inputElement = inputRefs.current[i]
      if (
        inputElement.nodeName === 'INPUT' &&
        hasError(newErrors, inputElement.getAttribute('name'))
      ) {
        inputElement.focus()
        return // 這裡不用break，因為有找到錯誤，直接用return跳出此函式
      }
    }

    // 如果完全驗証後無錯誤，才會執行到這裡的程式碼
    handleNext()
  }
  // SweetAlert
  const MySwal = withReactContent(Swal)
  const router = useRouter()
  const notifyAndBack = () => {
    MySwal.fire({
      title: '確定要中斷訂單流程返回營地頁嗎?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e49366',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        hanfleGoBack()
      }
    })
  }
  const hanfleGoBack = () => {
    router.push(`/campground/detail?id=${orderInfo.campground_id}`)
  }

  return (
    <>
      <div className="wrapper">
        <div className="cate-block">
          <span className="cate">訂房明細</span>
        </div>
        <div className="hotel-wrapper">
          <div className="left-wrapper">
            <img src={orderInfo.room_img} alt="" className="room-img" />
            <div className="name-wrapper">
              <div className="hotel-name">{orderInfo.campground_name}</div>
              <div className="room-name">{orderInfo.room_name}</div>
            </div>
          </div>
          <div className="right-wrapper ">
            <div className="col-wrapper">
              <div className="col-left">訂房日期</div>
              <div className="col-right">
                {orderInfo.checkInDate}~{orderInfo.checkOutDate}
              </div>
            </div>
            <div className="col-wrapper">
              <div className="col-left">入住天數</div>
              <div className="col-right">{orderInfo.night} 晚</div>
            </div>
            <div className="col-wrapper">
              <div className="col-left">價格/晚</div>
              <div className="col-right">$ {orderInfo.pay_amount}</div>
            </div>
            <div className="col-wrapper1">
              <div className="col-left">訂房說明</div>
              <div className="col-right">
                {orderInfo.refund ? (
                  <div className="cancel">
                    <FaCircleCheck style={{ marginBottom: '5px' }} />{' '}
                    {orderInfo.r_deadline} 前可免費取消
                  </div>
                ) : (
                  <div className="cancel">
                    <FaTriangleExclamation style={{ marginBottom: '5px' }} />{' '}
                    訂房後不能退款
                  </div>
                )}
                {orderInfo.room_name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper1">
        <div className="cate-block">
          <span className="cate">聯絡資訊</span>
        </div>
        <div className="first-line">
          <div className="note-wrapper1" style={{ display: 'none' }}>
            <div className="note-title">名字</div>
            <input
              type="text"
              name="firstName"
              className="note"
              value={data.firstName}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              ref={(el) => (inputRefs.current[1] = el)}
            />
            <div className="error">{errors.firstName}</div>
          </div>
        </div>
        <div className="second-line">
          <div className="note-wrapper1">
            <div className="note-title">姓名</div>
            <input
              type="text"
              name="lastName"
              className="note1"
              value={data.lastName}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              ref={(el) => (inputRefs.current[0] = el)}
            />
            <div className="error">{errors.lastName}</div>
          </div>
          <div className="note-wrapper1">
            <div className="note-title">手機號碼</div>
            <input
              type="text"
              name="phone"
              className="note1"
              value={data.phone}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              ref={(el) => (inputRefs.current[1] = el)}
            />
            <div className="error">{errors.phone}</div>
          </div>
          <div className="note-wrapper1">
            <div className="note-title">電子郵件</div>
            <input
              type="text"
              name="email"
              className="note1"
              value={data.email}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              ref={(el) => (inputRefs.current[2] = el)}
            />
            <div className="error">{errors.email}</div>
          </div>
          <div className="next-wrapper">
            <button
              className="backBtn"
              onClick={() => {
                notifyAndBack()
              }}
            >
              上一頁
            </button>
            <button
              className="nextBtn"
              onClick={() => {
                handleSubmit()
              }}
            >
              下一步
            </button>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .wrapper {
            width: 1280px;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            overflow: hidden;
            border: 1px solid var(--main-color-dark);
            margin-bottom: 95px;
          }
          .cate-block {
            width: 100%;
            background: var(--main-color-dark);

            padding: 8px 35px;
          }
          .cate {
            color: #f5f5f7;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
          }
          .hotel-wrapper {
            display: flex;
             {
              /* border-radius: 20px; */
            }
             {
              /* overflow: hidden; */
            }
             {
              /* margin: auto;
            margin-block: 15px; */
            }
             {
              /* border: 2px solid #e5e4cf; */
            }
          }
          .hotel-icon {
            width: 23px;
            height: 23px;
            border-radius: 50%;
            object-fit: cover;
          }
          .room-img {
            width: 350px;
            height: 350px;
            object-fit: cover;
            border-radius: 20px;
          }
          .left-wrapper {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .name-wrapper {
            display: flex;
            flex-direction: column;
            gap: 34px;
          }
          .hotel-name {
            width: 350px;
            font-family: 'Noto Sans TC';
            font-size: 24px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
          .room-name {
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            color: #8f8e93;
          }
          .right-wrapper {
            width: 875px;
            display: flex;
            flex-direction: column;
          }
          .col-wrapper {
            padding-block: 20px;
            font-family: 'Montserrat';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            display: flex;
            gap: 125px;
            border-bottom: 2px solid #e5e4cf;
          }
          .col-left {
            width: 250px;
            display: grid;
            place-items: center;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-weight: 500;
          }
          .col-right {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            width: 480px;
            text-align: start;
          }
          .col-wrapper1 {
            height: 290px;
            padding-block: 20px;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            display: flex;
            gap: 125px;
          }
          .note-wrapper {
            margin-inline: 87px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            align-items: start;
          }

          .note {
            width: 500px;
            border: 2px solid #e5e4cf;
            border-radius: 10px;
            outline: none;
            padding: 6px 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .note1 {
            width: 100%;
            border: 2px solid #e5e4cf;
            border-radius: 10px;
            outline: none;
            padding: 6px 20px;
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .note-title {
            white-space: nowrap;
          }
          input[type='text']:focus {
            border: 2px solid var(--hint-color);
          }

          .wrapper1 {
            width: 1280px;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            overflow: hidden;
            border: 1px solid var(--main-color-dark);
          }
          .first-line {
            display: flex;
            justify-content: space-between;
            width: 1120px;
            margin: auto;
            margin-top: 20px;
          }
          div.note-wrapper1 {
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            align-items: start;
          }
          .second-line {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 1120px;
            margin: auto;
            margin-block: 20px;
          }
          .next-wrapper {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
          }
          .backBtn {
            background: var(--sub-color);
            padding-inline: 30px;
            padding-block: 8px;
            color: var(--main-color-dark);
            border-radius: 30px;
            font-family: 'Montserrat';
            font-size: 20px;
            font-weight: 700;
          }
          .backBtn:hover {
            background: var(--main-color-dark);
            color: white;
          }
          .nextBtn {
            background: var(--main-color-dark);
            padding-inline: 30px;
            padding-block: 8px;
            color: white;
            border-radius: 30px;
            font-family: 'Montserrat';
            font-size: 20px;
            font-weight: 700;
          }
          .nextBtn:hover {
            background: var(--hint-color);
          }
          .error {
            color: red;
            font-weight: 400;
            padding-left: 10px;
            margin-top: -10px;
          }
          .cancel {
            color: var(--hint-color);
          }
        `}
      </style>
    </>
  )
}

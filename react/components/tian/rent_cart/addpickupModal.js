import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useAuthTest } from '@/hooks/use-auth-test'

export default function AddpickupModal({
  pickupToggle,
  setPickupToggle,
  addpickupToggle,
  setAddpickupToggle,
  getPickupInfo,
  pickup,
  errorMsg,
  successMsg,
  MySwal,
}) {
  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()

  const [userId, setUserId] = useState(null)

  const [fullNameValue, setFullNameValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [emailValue, setEmailValue] = useState('')

  const changeFullName = (e) => {
    setFullNameValue(e.target.value)
  }
  const changePhone = (e) => {
    setPhoneValue(e.target.value)
  }
  const changeEmail = (e) => {
    setEmailValue(e.target.value)
  }

  const addPickupCard = () => {
    MySwal.fire({
      title: '確定要新增此取件人嗎？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#413c1c',
      cancelButtonColor: '#e5e4cf',
      cancelButtonText: '取消',
      confirmButtonText: '確定',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: '成功新增取件人資訊',
          icon: 'success',
        })

        addPickup()
        getPickupInfo(userId)
        setFullNameValue('')
        setPhoneValue('')
        setEmailValue('')
        closeAddpickup()
      } else {
      }
    })
  }

  const addPickup = async () => {
    try {
      const url = `http://localhost:3005/api/rent_common/pickup/${userId}`
      const res = await axios.post(url, {
        fullName: fullNameValue,
        phone: phoneValue,
        email: emailValue,
        defaultNum: 0,
      })

      const status = res.data.status
      if (status === 'success') {
        successMsg(`寫入取件人資料成功`)
      }
    } catch (err) {
      console.log(`寫入取件人資料失敗，錯誤訊息：${err}`)
    }
  }

  const handleAddPickup = () => {
    if (fullNameValue === '') {
      errorMsg(`請填寫完整取件人資訊`)
      return
    }
    if (phoneValue === '') {
      errorMsg(`請填寫完整取件人資訊`)
      return
    }
    if (emailValue === '') {
      errorMsg(`請填寫完整取件人資訊`)
      return
    }
    addPickupCard()
  }

  const closeAddpickup = () => {
    if (addpickupToggle === true) {
      setAddpickupToggle(false)
      setPickupToggle(true)
      return
    }
  }

  useEffect(() => {
    if (auth.isAuth) {
      setUserId(auth.userData.id)
    }
  }, [])

  useEffect(() => {
    console.log(pickup)
  }, [fullNameValue, phoneValue, emailValue, pickup])

  return (
    <>
      <section
        className={`addPickupModal-tian ${
          addpickupToggle === false ? 'd-none' : ''
        }`}
      >
        <div className="header">
          <div className="title light-text-tian h6-tc-tian">新增取貨人</div>
          <div className="close">
            <span
              onClick={closeAddpickup}
              className="material-symbols-outlined light-text-tian"
            >
              {' '}
              close{' '}
            </span>
          </div>
        </div>
        <div className="body">
          <div className="name">
            <span className="p1-tc-tian dark-text-tian">姓名</span>
            <input
              className="p2-tc-tian sub-text-tian"
              type="text"
              placeholder="請填寫真實姓名"
              value={fullNameValue}
              onChange={(e) => {
                changeFullName(e)
              }}
            />
          </div>
          <div className="phone">
            <span className="p1-tc-tian dark-text-tian">電話</span>
            <input
              className="p2-tc-tian sub-text-tian"
              type="tel"
              placeholder="請輸入手機號碼"
              value={phoneValue}
              onChange={(e) => {
                changePhone(e)
              }}
            />
          </div>
          <div className="email">
            <span className="p1-tc-tian dark-text-tian">Email</span>
            <input
              className="p2-tc-tian sub-text-tian"
              type="email"
              placeholder="請輸入電子信箱"
              value={emailValue}
              onChange={(e) => {
                changeEmail(e)
              }}
            />
          </div>
          {/* <div className="addDefault">
            <div className="checkBox">
              <span className="material-symbols-outlined light-text-tian">
                check
              </span>
            </div>
            <div className="p2-tc-tian dark-text-tian">儲存此取貨人資訊</div>
          </div> */}
        </div>
        <div className="footer">
          <div>
            <button
              className="cancel btn primary2-outline-btn-tian p1-tc-tian"
              onClick={() => {
                closeAddpickup()
              }}
            >
              取消
            </button>
            <button
              className="confirm btn primary2-btn-tian p1-tc-tian"
              onClick={() => {
                handleAddPickup()
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

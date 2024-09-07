import React from 'react'
import { useState, useEffect } from 'react'
import RegisterForm from '@/components/member/register-form'
import Userregister from '@/styles/userregister.module.css'
import Link from 'next/link'

// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'

import dynamic from 'next/dynamic'
const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})

const Footer = dynamic(() => import('@/components/template/footer'), {
  ssr: false,
})

const FooterM = dynamic(() => import('@/components/template-m/footer-m'), {
  ssr: false,
})

// 開發期間使用，之後可以從useAuth中得到
const userId = 1

// <RegisterForm />
export default function Register() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    account: '',
    password: '',
    username: '',
    birthdate: '',
    phonenumber: '',
    idnumber: '',
    email: '',
    address: '',
  })

  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    account: '',
    password: '',
    username: '',
    birthdate: '',
    phonenumber: '',
    idnumber: '',
    email: '',
    address: '',
  })

  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    console.log(e.target.name, e.target.value, e.target.type)

    if (e.target.name === 'agree') {
      setUser({ ...user, [e.target.name]: e.target.checked })
    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }

    // ES6特性: 計算得來的屬性名稱(computed property names)
    // [e.target.name]: e.target.value
    // ^^^^^^^^^^^^^^^ 這樣可以動態的設定物件的屬性名稱
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E5%90%8D
  }

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單檢查 --- START
    // 建立一個新的錯誤物件
    const newErrors = {
      account: '',
      password: '',
      username: '',
      birthdate: '',
      phonenumber: '',
      idnumber: '',
      email: '',
      address: '',
    }

    if (!user.account) {
      newErrors.account = '帳號為必填資料'
    }
    if (!user.password) {
      newErrors.password = '密碼為必填資料'
    }
    if (!user.username) {
      newErrors.username = '姓名為必填資料'
    }

    if (!user.phonenumber) {
      newErrors.phonenumber = '手機號碼為必填資料'
    }

    if (!user.idnumber) {
      newErrors.idnumber = '身份證字號/護照號為必填資料'
    }

    // 呈現錯誤訊息
    setErrors(newErrors)

    // 物件屬性值中有非空白字串時，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 有錯誤，不送到伺服器，跳出submit函式
    if (hasErrors) {
      return
    }
    // 表單檢查 --- END

    // 最後檢查完全沒問題才送到伺服器(ajax/fetch)
    try {
      const url = 'http://localhost:3005/api/members'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      const resData = await res.json()
      console.log(resData)

      alert('已為您完成註冊！')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <div className={Userregister.nacontainer}>
        {isDesktopOrLaptop && <Header />}
        <div className={Userregister.nabackground}>
          <div className={Userregister.nacard}>
            <div>
              <p>
                General Member
                <br />
                Sign Up
              </p>
            </div>
            <div className={Userregister.nacn}>
              <p>會員註冊</p>
            </div>
            <div className={Userregister.nacard1}>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className={Userregister.naibox}>
                    <input
                      type="text"
                      className={Userregister.nainput1}
                      name="account"
                      value={user.account}
                      onChange={handleFieldChange}
                      placeholder="帳號"
                    />
                  </div>
                  <div className="error">{errors.account}</div>
                  <div className={Userregister.naibox}>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="姓名/護照名"
                    />
                  </div>
                  <div className="error">{errors.username}</div>
                  <div className={Userregister.naibox}>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="密碼"
                      minLength={6}
                    />
                  </div>
                  <div className="error">{errors.password}</div>
                  <div className={Userregister.naibox}>
                    <input
                      type="date"
                      name="birthdate"
                      value={user.birthdate}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="生日"
                      min={'1900-01-01'}
                    />
                  </div>
                  <div className={Userregister.naibox}>
                    <input
                      type="text"
                      className={Userregister.nainput1}
                      name="phonenumber"
                      value={user.phonenumber}
                      onChange={handleFieldChange}
                      placeholder="手機號碼"
                      maxLength={'10'}
                    />
                  </div>
                  <div className="error">{errors.phonenumber}</div>
                  <div className={Userregister.naibox}>
                    <input
                      type="text"
                      name="idnumber"
                      value={user.idnumber}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="身份證字號"
                    />
                  </div>
                  <div className="error">{errors.idnumber}</div>
                  <div className={Userregister.naibox}>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="電子郵件"
                    />
                  </div>
                  <div className={Userregister.naibox}>
                    <input
                      type="text"
                      name="address"
                      value={user.address}
                      onChange={handleFieldChange}
                      className={Userregister.nainput1}
                      placeholder="地址"
                    />
                  </div>
                  <button className={Userregister.nabtn} type="submit">
                    註冊
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className={Userregister.naregister}>
            <p>已經成為會員？</p>
            <Link href={'/member-test/login'}>
              <button type="text">登入</button>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .error {
            color: red;
            font-size: 10px;
          }
        `}
      </style>
    </>
  )
}

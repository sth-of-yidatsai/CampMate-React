import React from 'react'
import { useState, useEffect } from 'react'
import RegisterForm from '@/components/member/register-form'
import Userregister from '@/styles/userregister.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthTest } from '@/hooks/use-auth-test'

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
// const userId = 1

// <RegisterForm />
export default function Register() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { auth } = useAuthTest()

  const checkLogin = () => {
    if (auth.isAuth) {
      router.push('/member-test/profile-test')
    }
  }

  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    account: '',
    password: '',
    username: '',
    email: '',
    id_number: '',
    birth_date: '',
    phone: '',
    address: '',
  })

  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    account: '',
    password: '',
    username: '',
    email: '',
    id_number: '',
    birth_date: '',
    phone: '',
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

  const router = useRouter()

  const handleSubmit = async (e) => {
    // 表單檢查 --- START
    // 建立一個新的錯誤物件
    const newErrors = {
      account: '',
      password: '',
      username: '',
      email: '',
      id_number: '',
      birth_date: '',
      phone: '',
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
    if (!user.id_number) {
      newErrors.id_number = '身份證字號/護照號為必填資料'
    }
    if (!user.phone) {
      newErrors.phone = '手機號碼為必填資料'
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
      const url = 'http://localhost:3005/api/users-test/'
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

      if (res.ok) {
        toast.success('已為您完成註冊！')
        setTimeout(() => {
          router.push('/member-test/login')
        }, 1500)
      } else {
        toast.error('註冊失敗：' + (resData.message || '未知錯誤'))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [auth])

  return (
    <>
      <Toaster
        containerStyle={{
          top: '20vh',
        }}
      />
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
                    minLength={5}
                  />
                </div>
                <div className="error">{errors.password}</div>
                <div className={Userregister.naibox}>
                  <input
                    type="date"
                    name="birth_date"
                    value={user.birth_date}
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
                    name="phone"
                    value={user.phone}
                    onChange={handleFieldChange}
                    placeholder="手機號碼"
                    maxLength={'10'}
                  />
                </div>
                <div className="error">{errors.phone}</div>
                <div className={Userregister.naibox}>
                  <input
                    type="text"
                    name="id_number"
                    value={user.id_number}
                    onChange={handleFieldChange}
                    className={Userregister.nainput1}
                    placeholder="身份證字號"
                  />
                </div>
                <div className="error">{errors.id_number}</div>
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
                <button className={Userregister.nabtn} onClick={handleSubmit}>
                  註冊
                </button>
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

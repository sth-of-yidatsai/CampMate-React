import { useState, useEffect } from 'react'
import { useAuthTest, initUserData } from '@/hooks/use-auth-test'
import {
  googleLogin,
  checkAuth,
  login,
  logout,
  getUserById,
} from '@/services/user-test'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

// Google 登入用
import useFirebase from '@/hooks/use-firebase'
import GoogleButton from 'react-google-signin-button'
import 'react-google-signin-button/dist/button.css'

import LoginForm from '@/components/member/login-form'
import UserLogin from '@/styles/userlogin.module.css'

import { useRouter } from 'next/router'

// RWD使用
import { useMediaQuery } from 'react-responsive'

// import header-m icon
import myIcon from '@/assets/images.jpeg'
import { FaRegUser } from 'react-icons/fa'
import { FaCampground } from 'react-icons/fa'
import { MdOutlineChair } from 'react-icons/md'
import { FaGoogle } from 'react-icons/fa'

import dynamic from 'next/dynamic'
import { TbBorderBottom } from 'react-icons/tb'

const Header = dynamic(() => import('@/components/template/header'), {
  ssr: false,
})

const HeaderM = dynamic(() => import('@/components/template-m/header-m'), {
  ssr: false,
})

// 解析accessToken用的函式
const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}

export default function Login() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  // 狀態使用物件類型，物件中的屬性名稱對應到欄位的名稱(name屬性)
  const [user, setUser] = useState({
    account: '',
    password: '',
  })

  // 登入後設定全域的會員資料用
  const { auth, setAuth } = useAuthTest()

  // 記錄錯誤訊息用
  const [errors, setErrors] = useState({
    account: '',
    password: '',
  })

  // 多個欄位共用的事件處理函式
  const handleFieldChange = (e) => {
    // 可以用e.target來觀察或是判斷是哪個欄位觸發事件
    console.log(e.target.type, e.target.name, e.target.value)

    // es6中的特性: computed property names(計算得出來的屬性名稱)
    // [e.target.name]: e.target.value
    // ^^^^^^^^^^^^^^^ 這裡可以代入值或表達式，計算出物件的屬性名稱(字串值)
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // 處理登入
  const handleLogin = async () => {
    // ↓↓↓ 表單各欄位檢查 ---START---
    // 建立一個新的錯誤訊息物件
    const newErrors = { account: '', password: '' }
    // 開始檢查
    // if (user.username === '') {
    // if(user.username) 檢查如果有填寫
    // if(!user.username) 檢查如果沒填的話…
    if (!user.account) {
      newErrors.account = '帳號為必填'
    }

    if (!user.password) {
      newErrors.password = '密碼為必填'
    }

    if (user.password.length < 3) {
      newErrors.password ||= '密碼最少 3 字元'
    }
    // 檢查完成設定到錯誤訊息呈現狀態中
    setErrors(newErrors)

    // newErrors物件中如果有屬性值不是空白字串時，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 如果有錯誤發生，停止接下來的送到伺服器程式碼
    if (hasErrors) {
      toast.error('有檢查到錯誤')
      return // 在函式內作流程控制用，執行到這會跳出函式執行
    }
    // 表單檢查--- END ---

    const res = await login(user)

    console.log(res.data)

    if (res.data.status === 'success') {
      // 從JWT存取令牌中解析出會員資料
      // 注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
      const jwtUser = parseJwt(res.data.data.accessToken)
      console.log(jwtUser)

      const res1 = await getUserById(jwtUser.id)
      console.log(res1.data)

      if (res1.data.status === 'success') {
        // 只需要initUserData中的定義屬性值，詳見use-auth勾子
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key]
          }
        }

        // 設定到全域狀態中
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入')
      } else {
        toast.error('登入後無法得到會員資料')
        // 這裡可以讓會員登出，因為這也算登入失敗，有可能會造成資料不統一
      }
    } else {
      toast.error(`登入失敗`)
    }
  }

  // -------------------------- Google ---------------------------------------------

  const { loginGoogle, logoutFirebase } = useFirebase()

  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log(providerData)

    // 如果目前react(next)已經登入中，不需要再作登入動作
    if (auth.isAuth) return

    // 向伺服器進行登入動作
    const res = await googleLogin(providerData)

    // console.log(res.data)

    if (res.data.status === 'success') {
      // 從JWT存取令牌中解析出會員資料
      // 注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
      const jwtUser = parseJwt(res.data.data.accessToken)
      // console.log(jwtUser)

      const res1 = await getUserById(jwtUser.id)
      //console.log(res1.data)

      if (res1.data.status === 'success') {
        // 只需要initUserData中的定義屬性值，詳見use-auth勾子
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 設定到全域狀態中
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入')
      } else {
        toast.error('登入後無法得到會員資料')
        // 這裡可以讓會員登出，因為這也算登入失敗，有可能會造成資料不統一
      }
    } else {
      toast.error(`登入失敗`)
    }
  }

  // 處理檢查登入狀態
  const handleCheckAuth = async () => {
    const res = await checkAuth()

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('已登入會員')
    } else {
      toast.error(`非會員身份`)
    }
  }

  // 處理登出
  const handleLogout = async () => {
    // firebase logout(注意，這並不會登出google帳號，是登出firebase的帳號)
    logoutFirebase()

    const res = await logout()

    // 成功登出後，回復初始會員狀態
    if (res.data.status === 'success') {
      toast.success('已成功登出')

      setAuth({
        isAuth: false,
        userData: initUserData,
      })
    } else {
      toast.error(`登出失敗`)
    }
  }

  // -------------------------- Google ---------------------------------------------
  const router = useRouter()
  useEffect(() => {
    if (auth.isAuth) {
      router.push('/member-test/profile-test')
    }
  }, [auth.isAuth])

  //定義路由

  return (
    <>
      <Toaster
        containerStyle={{
          top: '20vh',
        }}
      />
      <div className={UserLogin.nacontainer}>
        {isDesktopOrLaptop && <Header />}
        <div className={UserLogin.nabackground}>
          <div>
            <div className={UserLogin.nacard}>
              <p className={UserLogin.nacard1}>
                General Member
                <br />
                Login
              </p>
              <div className={UserLogin.nacard2}>
                <div>
                  <div className={UserLogin.naibox}>
                    <input
                      className={UserLogin.nainput1}
                      name="account"
                      value={user.account}
                      onChange={handleFieldChange}
                      type="text"
                      placeholder="帳號"
                    />
                  </div>
                  <div className="error">{errors.account}</div>
                  <div className={UserLogin.naibox}>
                    <input
                      className={UserLogin.nainput1}
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleFieldChange}
                      placeholder="密碼"
                    />
                  </div>
                  <div className="error">{errors.password}</div>
                  <button className={UserLogin.nabtn} onClick={handleLogin}>
                    登入
                  </button>
                  {/* <p>目前登入狀況: {auth.isAuth ? '已登入' : '未登入'}</p> */}
                  {/* <button className={UserLogin.naresetpsd} type="text">
                    忘記密碼
                  </button> */}
                  <GoogleButton
                    label={'Google'}
                    shape={'pill'}
                    theme={'dark'}
                    style={{ marginTop: '10px', width: '100px' }}
                    onClick={() => loginGoogle(callbackGoogleLoginPopup)}
                  />
                </div>
              </div>
            </div>
            <div className={UserLogin.nacn}>
              <p>會員登入</p>
            </div>

            <div className={UserLogin.naregister}>
              <p>尚未成為會員？</p>
              <Link href={'/member-test/register'}>
                <button type="text">註冊</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .error {
            color: red;
            font-size: 12px;
            height: 16px;
          }
        `}
      </style>
    </>
  )
}

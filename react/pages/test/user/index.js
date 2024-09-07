import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { checkAuth, login, logout, getUserById } from '@/services/user'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

// 解析accessToken用的函式
const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}

export default function UserTest() {
  const [user, setUser] = useState({ username: '', password: '' })

  // 登入後設定全域的會員資料用
  const { setAuth } = useAuth()

  // 輸入帳號 密碼用
  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  // 處理登入
  const handleLogin = async () => {
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

  // 處理登出
  const handleLogout = async () => {
    const res = await logout()

    console.log(res.data)

    // 成功登出個回復初始會員狀態
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

  return (
    <>
      <h1>會員登入認証&授權測試(JWT)</h1>
      <hr />

      <label>
        帳號:
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleFieldChange}
        />
      </label>
      <label>
        密碼:
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={handleFieldChange}
        />
      </label>
      <br />
      <button
        onClick={() => {
          // 測試帳號 herry/11111
          setUser({ username: 'herry', password: '11111' })
        }}
      >
        一鍵輸入範例
      </button>
      <button onClick={handleLogin}>登入(login)</button>
      <hr />
      <button onClick={handleLogout}>登出(logout)</button>
      <button onClick={handleCheckAuth}>檢查登入狀況(check login)</button>
      <hr />
      <p>以下連結為測試會員註冊與更新個人資料</p>
      <p>
        <Link href="/test/user/register">註冊(不需登入)</Link>
      </p>
      <p>
        <Link href="/test/user/profile">修改個人資料(一般)(需登入)</Link>
      </p>
      <p>
        <Link href="/test/user/profile-password">
          修改個人資料(密碼)(需登入)
        </Link>
      </p>
      <p>
        以下連結為測試會員隱私資料頁，如果未登入完成會跳轉回登入頁(本頁)，實作程式碼詳見useAuth勾子
      </p>
      <p>
        <Link href="/test/user/status">存取會員隱私資料</Link>
      </p>
      <p>以下連結為第三方整合，在測試或整合前，務必先看說明文件先準備好資料</p>
      <p>
        <Link href="/test/user/google-login">
          Google第三方登入(firebase, 重定向, JWT)
        </Link>
      </p>
      <p>
        <Link href="/test/user/line-login">Line第三方登入(重定向, JWT)</Link>
      </p>
      <p>
        以下連結為忘記密碼與OTP整合，在測試或整合前，務必先看說明文件先準備好資料
      </p>
      <p>
        <Link href="/test/user/forget-password">忘記密碼(OTP, 一次性密碼)</Link>
      </p>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}

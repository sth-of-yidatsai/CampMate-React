import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { checkAuth } from '@/services/user-test'
const AuthTestContext = createContext(null)

export const initUserData = {
  id: 0,
  account: '',
  name: '',
  username: '',
  email: '',
  birth_date: '',
  id_number: '',
  phone: '',
  address: '',
  photo_url: '',
}

/**
 * 檢查會員狀態使用 -----------------------------------------
 */

export function AuthTestProvider({ children }) {
  // 會員的狀態
  const [auth, setAuth] = useState({
    isAuth: false, // 代表會員是否有登入的信號值
    // 會員的資料
    userData: initUserData,
  })

  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 登入頁路由
  const loginRoute = '/member-test/login'
  // 隱私頁面路由，未登入時會，檢查後跳轉至登入頁
  const protectedRoutes = [
    '/campground/order',
    // 會員中心 SideBar 網址
    '/member-test/profile-test', // '帳戶資訊'
    '/member-test/collect', // '收藏清單'
    '/member-test/p-order-history', // '訂單紀錄' '露營用具'
    '/member-test/c-order-history', // '訂單紀錄' '營地'
    '/member-test/my-event', // '團露紀錄'
    '/member-test/my-coupon', // '優惠卷'
    '/member-test/custerServer', // '客服中心'
    '/rent_cart', // 購物車
    '/rent_cart/cart_pay', // 購物車支付
    '/rent_cart/finish', // 付款成功頁面
  ]

  // 檢查會員認証用
  // 每次重新到網站中，或重新整理，都會執行這個函式，用於向伺服器查詢取回原本登入會員的資料
  const handleCheckAuth = async () => {
    const res = await checkAuth()

    // 伺服器api成功的回應為 { status:'success', data:{ user } }
    if (res.data.status === 'success') {
      // 只需要initUserData的定義屬性值
      const dbUser = res.data.data.user
      const userData = { ...initUserData }

      for (const key in userData) {
        if (Object.hasOwn(dbUser, key)) {
          userData[key] = dbUser[key] || ''
        }
      }
      // 設到全域狀態中
      setAuth({ isAuth: true, userData })
    } else {
      console.warn(res.data)

      // 在這裡實作隱私頁面路由的跳轉
      if (protectedRoutes.includes(router.pathname)) {
        router.push(loginRoute)
      }
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // didMount(初次渲染)後，向伺服器要求檢查會員是否登入中
  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      handleCheckAuth()
    }
    // 下面加入router.pathname，是為了要在向伺服器檢查後，
    // 如果有比對到是隱私路由，就執行跳轉到登入頁面工作
    // 注意有可能會造成向伺服器要求多次，此為簡單的實作範例
    // eslint-disable-next-line
    }, [router.isReady, router.pathname,auth])

  return (
    <AuthTestContext.Provider
      value={{ auth, setAuth, isLoading, setIsLoading }}
    >
      {children}
    </AuthTestContext.Provider>
  )
}

// 3. 建立一個包裝useContext的useAuth
export const useAuthTest = () => useContext(AuthTestContext)

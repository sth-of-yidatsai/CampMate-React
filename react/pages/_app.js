import { useEffect, useState } from 'react'
import '@/styles/globals.scss'
// reset CSS
import '@/styles/reset.css'
// 導入bootstrap 可在這個檔案內改bootstrap變數
import '@/styles/_bootstrapVar.scss'

// template 樣式
import '@/styles/sidebar.scss'
// 日曆樣式
import '@/styles/calender.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'
// 阿田個人樣式
import '@/styles/tianAllCss.scss'

// 載入購物車context
import { CartProvider } from '@/hooks/use-cart-state'
// 載入認証用context
import { AuthProvider } from '@/hooks/use-auth'
// 載入動畫context
import { LoaderProvider } from '@/hooks/use-loader'
// 載入搜尋共用 context
import SearchProvider from '@/hooks/use-search'

import QueryProvider from '@/hooks/use-query'

import { RentcartProvider } from '@/hooks/use-rentcart'
// Jian 登入測試用 cotext
import { AuthTestProvider } from '@/hooks/use-auth-test'

import DefaultLayout from '@/components/layout/default-layout'
// 自訂用載入動畫元件
import { CatLoader, NoLoader } from '@/hooks/use-loader/components'

// 第三部auth上層元件
import { AuthContext } from '@/context/auth'

import { Toaster } from 'react-hot-toast'
// auth上層元件
// import { AuthContext } from '@/context/auth'

export default function MyApp({ Component, pageProps }) {
  // 導入bootstrap的JS函式庫
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  // const [auth, setAuth] = useState({
  //   isAuth: false, // 代表會員是否有登入的信號值
  //   // 會員的資料
  //   userData: {
  //     id: '',
  //     account: '',
  //     email: '',
  //     username: '',
  //   },
  // })

  // const login = () => {
  //   setAuth({
  //     isAuth: true,
  //     userData: {
  //       id: '',
  //       account: '',
  //       email: '',
  //       username: '',
  //     },
  //   })

  //   alert('登入成功!')
  // }

  // const logout = () => {
  //   setAuth({
  //     isAuth: false,
  //     userData: {
  //       id: 0,
  //       account: '',
  //       email: '',
  //       username: '',
  //     },
  //   })

  //   alert('你已成功登出!')
  // }

  // 不知道為什麼打開會都是預設畫面，先comment
  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  // 或`components/layout/default-layout.js`
  // const getLayout =
  //   Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  const getLayout = Component.getLayout || ((page) => page)

  return (
    // 沒有開後端打開會報錯，也先comment起來
    // <AuthContext.Provider value={{ auth, login, logout }}>
    <AuthTestProvider>
      <RentcartProvider>
      <LoaderProvider close={2} CustomLoader={CatLoader}>
        <CartProvider>
          <SearchProvider>
            <QueryProvider>
              {getLayout(<Component {...pageProps} />)}
            </QueryProvider>
          </SearchProvider>
        </CartProvider>
      </LoaderProvider>
      </RentcartProvider>
    </AuthTestProvider>
    //  </AuthProvider>
  )
}

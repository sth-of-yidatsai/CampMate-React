import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import LineLogo from '@/components/icons/line-logo'
import {
  lineLoginRequest,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

export default function LineLogin() {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 處理登出
  const handleLineLogout = async () => {
    if (!auth.isAuth) return

    const res = await lineLogout(auth.userData.line_uid)

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

  // 處理line登入後，要向伺服器進行登入動作
  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)

    console.log(res.data)

    if (res.data.status === 'success') {
      // 從JWT存取令牌中解析出會員資料
      // 注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
      const jwtUser = parseJwt(res.data.data.accessToken)
      // console.log(jwtUser)

      const res1 = await getUserById(jwtUser.id)

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
      toast.error(`已是登入狀態或登入失敗`)
    }
  }

  // 處理登入
  const goLineLogin = () => {
    // 判斷是否已經登入，已登入不會再作登入
    if (auth.isAuth) return

    // 從後端伺服器取得line登入網址
    lineLoginRequest()
  }

  // 從line登入畫面後回調到本頁面用
  useEffect(() => {
    // 水合作用(hydration)保護，以免得不到window全域物件
    if (router.isReady) {
      // 判斷是否有query.code(網址上沒有code是進登入頁的時候)
      if (!router.query.code) return

      // 發送至後端伺服器得到line會員資料
      callbackLineLogin(router.query)
    }
    // eslint-disable-next-line
  }, [router.isReady, router.query])

  return (
    <>
      <h1>Line登入頁面+回調頁</h1>

      <p>會員狀態:{auth.isAuth ? '已登入' : '未登入'}</p>
      <p>會員資料:{JSON.stringify(auth.userData)}</p>
      <hr />
      <button onClick={goLineLogin}>
        <LineLogo /> 登入
      </button>
      <br />
      <button onClick={handleLineLogout}>LINE 登出(logout)</button>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}

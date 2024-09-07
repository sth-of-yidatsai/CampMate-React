import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function Status() {
  const { auth } = useAuth()

  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>

  return (
    <>
      <h1>會員隱私資料(未登入會跳轉回來)</h1>
      <p>會員姓名:{auth.userData.name}</p>
      <p>
        <Link href="/test/user">會員登入認証&授權測試(JWT)</Link>
      </p>
    </>
  )
}

import { useState } from 'react'
import { register } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  })

  // 輸入帳號 密碼用
  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    const res = await register(user)

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('資訊 - 會員註冊成功')
    } else {
      toast.error(`錯誤 - 會員註冊失敗`)
    }
  }

  return (
    <>
      <h1>會員註冊</h1>
      <hr />
      <p>規則: 註冊時，username與email不能與目前資料庫有相同的值</p>
      <p>注意: 進行註冊時，應該要在會員登出狀態(這裡並未實作檢查部份)</p>
      <hr />
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            帳號:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          <label>
            密碼:
            <input
              type="text"
              name="password"
              value={user.password}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <p>
          <label>
            姓名:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleFieldChange}
            />
          </label>
        </p>

        <p>
          <label>
            電子郵件信箱:
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={handleFieldChange}
            />
          </label>
        </p>
        <br />
        <button type="submit">註冊</button>
        <br />
        <button
          type="button"
          onClick={() => {
            // 測試帳號 herry/11111
            setUser({
              name: '榮恩',
              email: 'ron@test.com',
              username: 'ron',
              password: '99999',
            })
          }}
        >
          一鍵輸入範例
        </button>
      </form>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}

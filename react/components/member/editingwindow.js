import { useState, useEffect } from 'react'
import styles from '@/components/member/modal.module.css'
import { useAuthTest } from '@/hooks/use-auth-test'

// const fetcher = (url, postId) => fetch(url + postId).then((r) => r.json())

export default function Editingwindow({ onClose }) {
  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    phone: '',
    address: '',
  })

  const { auth } = useAuthTest()

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updatedMember = {
        phone: user.phone,
        address: user.address,
      }

      const url = `http://localhost:3005/api/auth-test/${auth.userData.id}/profile`
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMember),
      })

      const userData = await res.json()
      console.log(userData)
      if (res.ok) {
        alert('修改成功')
        window.location.reload()
        onClose()
      } else {
        alert('修改失敗')
      }
    } catch (e) {
      console.error(e)
      alert('發生錯誤，請稍後再試')
    }
  }

  const getMember = async () => {
    try {
      const url = `http://localhost:3005/api/members/${auth.userData.id}`
      const user = await fetch(url)
      const userData = await user.json()
      console.log(userData)
      if (userData.status === 'success') {
        const user = userData.data.member
        setUser({
          ...user,
          phone: user.phone,
          address: user.address,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getMember()
  }, [auth.userData.id])

  return (
    <>
      {/* onSubmit={handleSubmit} */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formTitle}>
          {auth.userData.account} 的修改資料
        </div>
        <div className={styles.formGroup}>
          <div className={styles.formQus}>
            <label htmlFor="phone">電話</label>
            <input
              className={styles.formInput}
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleFieldChange}
            />
          </div>
       
      </div>
      <div className={styles.formGroup}>
        <div className={styles.formQus}>
          <label htmlFor="text">地址</label>
          <input
            className={styles.formInput}
            type="text"
            name="address"
            value={user.address}
            onChange={handleFieldChange}
          />
        </div>
      </div>
      <div className={styles.submitGroup}>
        <div className={styles.submitDiv}>
          <button type="submit" className={styles.submitButton}>
            完成
          </button>
        </div>
      </div>
    </form>
    </>
  )
}

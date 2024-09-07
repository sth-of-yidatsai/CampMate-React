import React, { useState, useEffect, useCallback } from 'react'
import styles from '@/styles/tickets.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { register } from '@/services/ticket'
import { MdOutlineFactCheck, MdOutlineLowPriority } from 'react-icons/md'
import { FaCalendarCheck } from 'react-icons/fa'
import OrderTab from './order_Tab' // 確保路徑正確

export default function AddTicket({ onClose, user_id }) {
  const [showNestedModal, setShowNestedModal] = useState(false)
  const [orders, setOrders] = useState([]) // 訂單數據狀態
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [order_id, setOrderId] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false) // 加載狀態
  const [error, setError] = useState(null) // 錯誤狀態
  const [key, setKey] = useState('collect_campground') // 默認選項卡鍵值

  // console.log('Received user_id:', user_id)

  // 從 API 獲取訂單數據
  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const url =
      key === 'collect_campground'
        ? `http://localhost:3005/api/order-c/${user_id}`
        : `http://localhost:3005/api/order-p/${user_id}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 404) {
        // 如果狀態碼是 404，顯示"沒有訂單"
        setOrders([])
        toast.error('沒有可用的訂單')
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // console.log('Fetched orders:', data)

      if (
        data.status === 'success' &&
        Array.isArray(data.data.p_orders || data.data.c_orders)
      ) {
        setOrders(data.data.p_orders || data.data.c_orders)
      } else {
        setOrders([])
        toast.error('沒有可用的訂單')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('沒有可用的訂單')
      toast.error('沒有可用的訂單')
    } finally {
      setIsLoading(false)
    }
  }, [user_id, key])

  // 當組件掛載時或 user_id 改變時獲取訂單
  useEffect(() => {
    if (showNestedModal) {
      fetchOrders()
    }
  }, [showNestedModal, fetchOrders])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !phone || !category || !description) {
      toast.error('請填寫所有必填欄位')
      return
    }

    const ticket = {
      user_id,
      email,
      phone,
      order_id,
      category,
      description,
      status: '尚未回覆',
    }

    try {
      // console.log('提交的客服單:', ticket)
      const response = await register(ticket)

      if (response.success) {
        toast.success('客服單已成功新增')
        // 清空表單
        // setEmail('')
        // setPhone('')
        // setOrderId('')
        // setCategory('')
        // setDescription('')
        onClose() // 關閉彈跳視窗
        // console.log('提交的客服單數據:', ticket)
      } else {
        toast.error('建立客服單失敗')
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error(
        `建立客服單時發生錯誤: ${error.message || JSON.stringify(error)}`
      )
    }
  }

  const handleNestedModalClick = () => {
    setShowNestedModal(true)
  }

  const handleNestedModalClose = () => {
    setShowNestedModal(false)
  }

  const handleOrderSelect = (orderNumber) => {
    setOrderId(orderNumber)
    setShowNestedModal(false) // 關閉模態視窗
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const handleTabChange = useCallback((newKey) => {
    setKey(newKey)
  }, [])

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formTitle}>聯絡我們</div>

        <div className={styles.formGroup}>
          <div className={styles.formQus}>
            <label htmlFor="email">電子郵件*</label>
            <input
              className={styles.formInput}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的Email"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formQus}>
            <label htmlFor="phone">連絡電話*</label>
            <input
              className={styles.formInput}
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength="10"
              pattern="09\d{8}"
              placeholder="請輸入您的電話"
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formQus}>
            <label htmlFor="ticketOrderNum">
              訂單編號&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <div className={styles.formGroupExplain}>
              <input
                className={styles.formInput}
                type="text"
                name="order_id"
                value={order_id}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="請輸入或選擇您的訂單編號"
              />
              <button
                type="button"
                className={styles.checkBg}
                onClick={handleNestedModalClick}
              >
                <MdOutlineFactCheck className={styles.checkIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.formQus}>
            <label htmlFor="category">問題分類*</label>
            <select
              className={styles.formInput}
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                請選擇問題分類
              </option>
              <option value="營地相關">營地相關</option>
              <option value="用品租借相關">用品租借相關</option>
              <option value="費用相關">費用相關</option>
              <option value="網站操作相關">網站操作相關</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroupExplain}>
          <div className={styles.formQusExplain}>
            <label htmlFor="description">問題說明*</label>
            <textarea
              className={styles.formInputExplain}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請詳細敘述問題"
              required
            ></textarea>
          </div>
        </div>

        <div className={styles.submitGroup}>
          <div className={styles.submitDiv}>
            <button type="submit" className={styles.submitButton}>
              提交
            </button>
          </div>
        </div>
      </form>

      {/* 選擇訂單編號模態視窗 */}
      {showNestedModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.ticketOrderNum}>
              <div className={styles.modalHeader}>
                <h2 className={styles.formTitle}>選擇訂單</h2>
              </div>

              {/* 可以在這裡加入 OrderTab 組件，如果需要的話 */}
              <OrderTab onTabChange={handleTabChange} currentTab={key} />

              {isLoading ? (
                <div className={styles.loading}>加載中...</div>
              ) : error ? (
                <div className={styles.error}>{error}</div>
              ) : orders.length > 0 ? (
                <table className={styles.orderNumTable}>
                  <thead className={styles.orderThead}>
                    <tr>
                      <th>訂單編號</th>
                      <th>訂單成立時間</th>
                      <th>交易金額</th>
                      <th>選擇訂單</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.order_number || order.order_id}
                        className={styles.orderTr}
                      >
                        <td className={styles.orderTd}>
                          <div className={styles.orderDiv}>
                            {key === 'collect_campground'
                              ? order.order_number
                              : order.order_id}
                          </div>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.amount}</td>
                        <td>
                          <button
                            className={styles.checkBg}
                            onClick={() =>
                              handleOrderSelect(
                                key === 'collect_campground'
                                  ? order.order_number
                                  : order.order_id
                              )
                            }
                          >
                            <FaCalendarCheck className={styles.checkOrder} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.noOrders}>沒有可用的訂單</div>
              )}

              <div className={styles.submitGroup}>
                <div className={styles.submitDiv}>
                  <button
                    className={styles.backButton}
                    onClick={handleNestedModalClose}
                  >
                    <MdOutlineLowPriority className={styles.backIcon} />
                    返回
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  )
}

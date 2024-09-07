import React, { useState, useRef, useEffect } from 'react'
import styles from '@/styles/chatbox/chatbox.module.css'
import { useChatByUserId, register } from '@/services/chatbox'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

export default function UserChat({ onClose, user_id }) {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const contentBoxRef = useRef(null)

  // 使用 useChatByUserId hook 來獲取聊天記錄
  const { data: messages = [], isLoading, isError } = useChatByUserId(user_id)

  useEffect(() => {
    if (isError) {
      console.error('Error fetching messages:', isError)
    } else {
      // console.log('Fetched messages:', messages) // 新增日志檢查 messages
      if (Array.isArray(messages)) {
        // console.log('Number of messages:', messages.length)
      } else {
        console.warn('Messages is not an array:', messages)
      }
    }
  }, [isError, messages])

  const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFormattedDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
    })
  }

  const getMessagesWithDates = () => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages)
      return [] // 如果 messages 不是數組，返回空數組
    }

    const messagesWithDates = []
    let lastDate = ''

    messages.forEach((msg) => {
      const currentDate = getFormattedDate(msg.created_at)

      if (currentDate !== lastDate) {
        messagesWithDates.push({
          type: 'date',
          date: currentDate,
        })
        lastDate = currentDate
      }

      messagesWithDates.push({
        ...msg,
        time: getFormattedTime(msg.created_at), // 格式化時間
        date: currentDate, // 格式化日期
      })
    })

    return messagesWithDates
  }

  // 滾動到最新消息
  useEffect(() => {
    if (contentBoxRef.current) {
      contentBoxRef.current.scrollTop = contentBoxRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) {
      return toast.error('請輸入訊息')
    }

    const message = {
      user_id: user_id,
      sender_id: user_id,
      text,
    }

    setIsSending(true)

    try {
      console.log('Submitting message:', message)
      const response = await register(message)

      console.log('Response from register:', response) // 檢查 response 的實際內容

      if (response.status === 'success') {
        // 清空文本框
        setText('')
        // 刷新聊天記錄
        mutate(`http://localhost:3005/api/chat_box/${user_id}`)
        console.log('送出訊息:', message)
      } else {
        toast.error('送出訊息失敗')
      }
    } catch (error) {
      console.error('Error creating message:', error)
      toast.error(
        `送出訊息時發生錯誤: ${error.message || JSON.stringify(error)}`
      )
    } finally {
      setIsSending(false)
    }
  }

  const getUserLabel = (senderId) => {
    // 當 senderId 為 0 時，顯示 '客服'
    if (senderId === 9999) {
      return '客服'
    }

    // 根據 senderId 查找對應的用戶信息
    const user = messages.find((msg) => msg.sender_id === senderId)?.User
    return user ? user.name : `用戶 ${senderId}`
  }

  return (
    <div className={styles.box}>
      <div className={styles.contentBox} ref={contentBoxRef}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          getMessagesWithDates().map((msg, index) =>
            msg.type === 'date' ? (
              <div key={index} className={styles.dateMessage}>
                {msg.date}
              </div>
            ) : (
              <div
                key={index}
                className={
                  msg.sender_id === msg.user_id
                    ? styles.userMessage
                    : styles.supportMessage
                }
              >
                <span className={styles.chatUser}>
                  {getUserLabel(msg.sender_id)} :
                </span>
                <div className={styles.chatContent}>{msg.text}</div>
                <span className={styles.chatTime}>{msg.time}</span>
              </div>
            )
          )
        )}
      </div>
      <form className={styles.sendForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.sendInput}
          placeholder="輸入訊息"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn} disabled={isSending}>
          發送
        </button>
      </form>
    </div>
  )
}

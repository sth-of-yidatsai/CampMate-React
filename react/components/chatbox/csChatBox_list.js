import React, { useState, useEffect } from 'react'
import styles from '@/styles/csChatBox.module.css'
import Pagination from '../pagination/pagination'
import { useChatByUserId } from '@/services/chatbox'
import CSChat from './CSChat'

// icons
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'

export default function CsChatBoxList() {
  const [newMessageCount, setNewMessageCount] = useState(0)
  const { data: messages = [], isLoading, isError } = useChatByUserId()

  // 頁碼
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8

  const [chats, setChats] = useState([])
  const [filteredChats, setFilteredChats] = useState([])
  const [showChatModal, setShowChatModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)

  // 排序方式，默認按檢視狀態排序
  const [sortBy, setSortBy] = useState('status')

  // 記錄每個 user_id 的最後已讀訊息的 ID
  const [lastReadMessageIds, setLastReadMessageIds] = useState({})

  useEffect(() => {
    // 在客戶端渲染時訪問 localStorage
    if (typeof window !== 'undefined') {
      const storedLastReadMessageIds = JSON.parse(
        localStorage.getItem('lastReadMessageIds') || '{}'
      )
      setLastReadMessageIds(storedLastReadMessageIds)
    }
  }, [])

  useEffect(() => {
    fetch('http://localhost:3005/api/chat_box')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const allChats = data.data.chats
        const sortedChats = sortChats(allChats)
        setChats(sortedChats)
        setFilteredChats(sortedChats)
        const total = Math.ceil(sortedChats.length / itemsPerPage)
        setTotalPages(total > 0 ? total : 1)
      })
      .catch((error) => {
        console.error('Error fetching chats:', error)
      })
  }, [sortBy])

  useEffect(() => {
    const pageTitleElement = document.querySelector(`.${styles.pageTitle}`)
    if (pageTitleElement) {
      window.scrollTo({
        top: pageTitleElement.offsetTop - 20,
        left: 0,
        behavior: 'smooth',
      })
    }
  }, [currentPage])

  const startIndex = (currentPage - 1) * itemsPerPage

  const getLatestChats = (chats) => {
    const latestChats = chats.reduce((acc, chat) => {
      if (
        !acc[chat.user_id] ||
        new Date(chat.created_at) > new Date(acc[chat.user_id].created_at)
      ) {
        acc[chat.user_id] = chat
      }
      return acc
    }, {})

    return Object.values(latestChats)
  }

  const sortChats = (chats) => {
    return chats.sort((a, b) => {
      const isANewMessage = a.id > (lastReadMessageIds[a.user_id] || 0)
      const isBNewMessage = b.id > (lastReadMessageIds[b.user_id] || 0)

      // 根據排序方式進行排序
      if (sortBy === 'status') {
        // 按檢視狀態排序
        if (isANewMessage && !isBNewMessage) {
          return -1
        } else if (!isANewMessage && isBNewMessage) {
          return 1
        } else {
          // 按創建時間排序，已回覆的時間較晚的在上面
          return isANewMessage === isBNewMessage
            ? new Date(b.created_at) - new Date(a.created_at)
            : isANewMessage
            ? -1
            : 1
        }
      } else {
        // 按創建時間排序
        return new Date(b.created_at) - new Date(a.created_at)
      }
    })
  }

  const currentChats = sortChats(getLatestChats(filteredChats)).slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handleChatModalOpen = (userId, chatId) => {
    setSelectedUserId(userId)
    setShowChatModal(true)
    setNewMessageCount(0)

    // 更新 user_id 對應的最後已讀訊息 ID
    const updatedLastReadMessageIds = {
      ...lastReadMessageIds,
      [userId]: chatId,
    }
    setLastReadMessageIds(updatedLastReadMessageIds)

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'lastReadMessageIds',
        JSON.stringify(updatedLastReadMessageIds)
      )
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  useEffect(() => {
    const totalChats = getLatestChats(filteredChats)
    const total = Math.ceil(sortChats(totalChats).length / itemsPerPage)
    setTotalPages(total > 0 ? total : 1)
  }, [filteredChats, sortBy])

  return (
    <>
      <div className={styles.containerStyle}>
        <div>
          <div>
            <table className={styles.tableStyle}>
              <thead className={styles.theadStyle}>
                <tr className={styles.thStyle}>
                  <th>使用者ID</th>
                  <th>使用者名稱</th>
                  <th
                    onClick={() =>
                      setSortBy(
                        sortBy === 'created_at' ? 'status' : 'created_at'
                      )
                    }
                  >
                    訊息時間
                    <span className={styles.sortIndicator}>
                      {sortBy === 'created_at' ? '▲' : '▼'}
                    </span>
                  </th>
                  <th
                    onClick={() => setSortBy('status')}
                    style={{ cursor: 'pointer' }}
                  >
                    檢視狀態
                    <span className={styles.sortIndicator}>
                      {sortBy === 'status' ? '▲' : '▼'}
                    </span>
                  </th>
                  <th>回覆問題</th>
                </tr>
              </thead>
              <tbody>
                {currentChats.map((chat) => (
                  <tr key={chat.id} className={styles.tdStyle}>
                    <td>{chat.user_id}</td>
                    <td>{chat.User ? chat.User.name : '未知使用者'}</td>
                    <td>{formatDateTime(chat.created_at)}</td>
                    <td className={styles.CsState}>
                      <div
                        className={
                          chat.id > (lastReadMessageIds[chat.user_id] || 0)
                            ? styles.CsState2
                            : styles.CsState1
                        }
                      >
                        {chat.id > (lastReadMessageIds[chat.user_id] || 0)
                          ? '新訊息'
                          : '已回覆'}
                      </div>
                    </td>
                    <td className={styles.checkBtnTd}>
                      <button
                        href=""
                        className={styles.checkBg}
                        onClick={() =>
                          handleChatModalOpen(chat.user_id, chat.id)
                        }
                      >
                        <IoChatboxEllipsesOutline
                          className={styles.checkIcon}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages >= 1 && (
          <div className={styles.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 即時客服 */}
      {showChatModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalChatContent}>
            <div className={styles.modalClose}>
              <button
                className={styles.closeButton}
                onClick={() => setShowChatModal(false)}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <div className={styles.modalChat}>
              <CSChat user_id={selectedUserId} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

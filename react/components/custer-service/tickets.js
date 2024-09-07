import React, { useState, useEffect } from 'react'
import styles from '@/styles/tickets.module.css'
import UserChat from '@/components/chatbox/user-chat'
import Pagination from '../pagination/pagination'
import AddTicket from './addTicket'

// icons
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlinePostAdd } from 'react-icons/md'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { MdOutlineLowPriority } from 'react-icons/md'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'

export default function TicketsTest() {
  const [newMessageCount, setNewMessageCount] = useState(0) // 新訊息數量
  const handleAddTicketClose = () => {
    setShowModal(false)
  }

  // 頁碼
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8

  // 彈出視窗
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [sortState, setSortState] = useState(0)
  const [sortTime, setSortTime] = useState('asc')

  useEffect(() => {
    fetch('http://localhost:3005/api/tickets') // 根據實際情況調整 API 地址
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        const allTickets = data.data.tickets

        setTickets(allTickets)
        setFilteredTickets(allTickets)
        setTotalPages(Math.ceil(allTickets.length / itemsPerPage))
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error)
      })
  }, [])

  useEffect(() => {
    // 當 currentPage 改變時進行滾動
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
  const currentTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const handleChatModalOpen = () => {
    setShowChatModal(true)
    setNewMessageCount(0) // 打開聊天視窗後重置新訊息計數
  }

  // 顯示客服單詳細資料
  const handleDetailClick = (ticket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 調整時間的顯示
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei', // 選擇台北時區
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const handleStatusSort = () => {
    if (sortState === 0) {
      // 排序 "尚未回覆" 在最上面
      const sortedTickets = [...filteredTickets].sort((a, b) => {
        const order = { 尚未回覆: 1, 處理中: 2 }
        return (order[a.status] || 3) - (order[b.status] || 3)
      })
      setFilteredTickets(sortedTickets)
    } else if (sortState === 1) {
      // 排序 "處理中" 在最上面
      const sortedTickets = [...filteredTickets].sort((a, b) => {
        const order = { 處理中: 1, 尚未回覆: 2 }
        return (order[a.status] || 3) - (order[b.status] || 3)
      })
      setFilteredTickets(sortedTickets)
    } else {
      // 恢復原本排序
      setFilteredTickets(tickets)
    }
    setSortState((prevState) => (prevState + 1) % 3) // 在 0, 1, 2 之間切換
  }

  const handleDateSort = () => {
    const sortedTickets = [...filteredTickets].sort((a, b) => {
      return sortTime === 'asc'
        ? new Date(a.createtime) - new Date(b.createtime)
        : new Date(b.createtime) - new Date(a.createtime)
    })
    setFilteredTickets(sortedTickets)
    setSortTime(sortTime === 'asc' ? 'desc' : 'asc')
  }

  return (
    <>
      <div className={styles.containerStyle}>
        <div className={styles.titleStyle}>
          <button
            href="#"
            className={styles.addTicket}
            onClick={(e) => {
              e.preventDefault()
              setShowModal(true)
            }}
          >
            <MdOutlinePostAdd className={styles.addTicketIcon} />
          </button>
          <button
            className={styles.chatBtn}
            onClick={() => handleChatModalOpen()}
          >
            <IoChatboxEllipsesOutline className={styles.chatIcon} />
            {newMessageCount > 0 && (
              <span className={styles.badge}>{newMessageCount}</span>
            )}
          </button>
        </div>

        <div>
          <div>
            <table className={styles.tableStyle}>
              <thead className={styles.theadStyle}>
                <tr className={styles.thStyle}>
                  <th>客服單編號</th>
                  <th>訂單編號</th>
                  <th>問題分類</th>
                  <th>問題說明</th>
                  <th onClick={handleDateSort} className={styles.sortable}>
                    建立時間
                  </th>
                  <th className={styles.sortable} onClick={handleStatusSort}>
                    檢視狀態
                  </th>
                  <th>查看詳細</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <tr key={ticket.id} className={styles.tdStyle}>
                    <td>{ticket.id}</td>
                    <td>{ticket.order_id}</td>
                    <td>{ticket.category}</td>
                    <td className={styles.CsDescription}>
                      {ticket.description}
                    </td>
                    <td>{formatDateTime(ticket.createtime)}</td>
                    <td className={styles.CsState}>
                      <div
                        className={
                          ticket.status === '尚未回覆'
                            ? styles.CsState1
                            : ticket.status === '處理中'
                            ? styles.CsState2
                            : styles.CsState3
                        }
                      >
                        {ticket.status}
                      </div>
                    </td>
                    <td>
                      <button
                        href=""
                        className={styles.checkBg}
                        onClick={() => handleDetailClick(ticket)}
                      >
                        <IoEyeOutline className={styles.checkIcon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.pagination}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* 新增客服單 */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalClose}>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <AddTicket onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* 客服單詳細 */}
      {showDetailModal && selectedTicket && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalClose}>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailModal(false)}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
            <form className={styles.form}>
              <div className={styles.formTitle}>客服單詳細資料</div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="ticketId">客服單編號</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.id}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="orderId">訂單編號</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.order_id}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="category">問題分類</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.category}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="description">問題說明</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.description}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="createTime">建立時間</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.createtime}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="status">客服單狀態</label>
                  <div className={styles.DetailContent}>
                    {selectedTicket.status}
                  </div>
                </div>
              </div>
              {/* 顯示客服回覆及回覆時間 */}
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="reply">客服回覆</label>
                  <div className={styles.DetailContent}>
                    {/* 可以顯示或是獲取客服回覆內容 */}
                    {selectedTicket.reply || '待回覆'}
                  </div>
                </div>
              </div>
              <div className={styles.formDetail}>
                <div className={styles.formDetailContent}>
                  <label htmlFor="replyTime">回覆時間</label>
                  <div className={styles.DetailContent}>
                    {/* 可以顯示回覆時間 */}
                    {formatDateTime(selectedTicket.closetime) || '待回覆'}
                  </div>
                </div>
              </div>
              <div className={styles.submitGroup}>
                <div className={styles.submitDiv}>
                  <button
                    className={styles.backButton}
                    onClick={() => setShowDetailModal(false)}
                  >
                    <MdOutlineLowPriority className={styles.backIcon} />
                    返回客服單列表
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <UserChat />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

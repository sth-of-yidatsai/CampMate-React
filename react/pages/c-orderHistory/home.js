import React, { useState, useEffect } from 'react'
import MemberSidebar from '@/components/template/member-sidebar'

import Header from '@/components/template/header'
import Aside from '@/components/template/sidebar'
import Footer from '@/components/template/footer'

// 共同組件導入
import Bread_crumb from '@/components/tian/common/bread_crumb'
import Page_title from '@/components/tian/common/page_title'
import Top_btn from '@/components/tian/common/top_btn'

import Order_status_tab from '@/components/card/orderHistory/order_status_tab'
import OrderHistory_list from '@/components/card/orderHistory/orderHistory_list'

import CommentModal from '@/components/card/orderHistory/commentModal'
import WriteCommentModal from '@/components/card/orderHistory/writeCommentModal'

export default function COrderHistory() {
  // 設定頁面標題
  const [pageTitle, setPageTitle] = useState({
    title: '訂單記錄。',
    subTitle: '營地。',
  })

  const [commentToggle, setCommentToggle] = useState(false)
  const [writeCommentToggle, setWriteCommentToggle] = useState(false)

  const [currentStatus, setCurrentStatus] = useState('全部') // 初始化狀態

  // 更新當前狀態
  const handleStatusChange = (status) => {
    setCurrentStatus(status)
  }

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const getOrders = async (params) => {
    try {
      // 構建查詢字符串
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(
        `http://localhost:3005/api/c-order?${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      const data = await response.json()
      return data // 返回數據
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error // 重新拋出錯誤以便在調用處處理
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let params
        if (currentStatus === '全部') {
          params = {}
        } else if (currentStatus === '未入住') {
          params = { status: 'paid', check_in_date: 'before' }
        } else if (currentStatus === '已完成') {
          params = { status: 'paid', check_out_date: 'after' }
        } else if (currentStatus === '已取消') {
          params = { status: 'pending' }
        }
        // const params = { status: currentStatus, check_in_date: 'before' }
        const result = await getOrders(params)
        if (!result.data) {
          setOrders([])
        } else {
          setOrders(result.data.orders)
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentStatus])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <Header />
      <section className="mainArea-orderHistory-tian mainArea-tian">
        {/*## ↓↓↓↓ 側邊欄 ↓↓↓↓ */}
        <MemberSidebar />
        <main className="main-tian">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Bread_crumb />
          {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
          <Page_title pageTitle={pageTitle} />
          {/*## ↓↓↓↓ 購物車訂單列表 ↓↓↓↓ */}
          <section className="orderList">
            <Order_status_tab onStatusChange={handleStatusChange} />
            {/*## ↓↓↓↓ 訂單(店為單位) ↓↓↓↓ */}
            <div
              style={{
                width: '100%',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {orders.map((order, i) => {
                return (
                  <OrderHistory_list
                    key={i}
                    commentToggle={commentToggle}
                    setCommentToggle={setCommentToggle}
                    orders={orders}
                    order={order}
                    currentStatus={currentStatus}
                  />
                )
              })}
            </div>
          </section>
          {/* ↓↓↓↓ 分頁標籤（用易達做的組件） ↓↓↓↓ */}
          {/* ↑↑↑↑ 分頁標籤 ↑↑↑↑ */}
        </main>
      </section>
      <Footer />
      <Top_btn />

      <CommentModal
        commentToggle={commentToggle}
        setCommentToggle={setCommentToggle}
        writeCommentToggle={writeCommentToggle}
        setWriteCommentToggle={setWriteCommentToggle}
      />
      <WriteCommentModal
        commentToggle={commentToggle}
        setCommentToggle={setCommentToggle}
        writeCommentToggle={writeCommentToggle}
        setWriteCommentToggle={setWriteCommentToggle}
      />
    </>
  )
}

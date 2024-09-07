import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useAuthTest } from '@/hooks/use-auth-test'

import Header from '@/components/template/header'
import Aside from '@/components/template/sidebar'
import MemberSidebar from '@/components/template/member-sidebar'
import Footer from '@/components/template/footer'

// 共同組件導入
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Page_title from '@/components/tian/common/page_title'
import Page_tab from '@/components/tian/common/page_tab'
import Top_btn from '@/components/tian/common/top_btn'

import Order_status_tab from '@/components/tian/orderHistory/order_status_tab'
import OrderHistory_list from '@/components/tian/orderHistory/orderHistory_list'

import CommentModal from '@/components/tian/orderHistory/commentModal'
import WriteCommentModal from '@/components/tian/orderHistory/writeCommentModal'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import toast, { Toaster } from 'react-hot-toast'

export default function OrderHistory() {
  // 改用MySwal取代Swal
  const MySwal = withReactContent(Swal)

  const breadcrumbItems = [
    { name: 'HOME', href: '/home' },
    { name: 'MEMBER', href: '/member-test/profile-test' },
    { name: '訂單記錄 - 露營用品', href: '/member-test/my-coupon' },
  ]

  // 使用 useAuthTest hook 獲取使用者資訊
  const { auth } = useAuthTest()
  const [userId, setUserId] = useState(null)

  // 設定頁面標題
  const [pageTitle, setPageTitle] = useState({
    title: '訂單記錄。',
    subTitle: '租賃露營用品。',
  })

  const [commentToggle, setCommentToggle] = useState(false)

  const [writeCommentToggle, setWriteCommentToggle] = useState(false)

  const [statusName, setStatusName] = useState(`全部`)

  // 儲存單一訂單的所有商品以及對應的評價資訊
  const [orderComment, setOrderComment] = useState([])

  const [writeComment, setWriteComment] = useState({})

  //----------------------------------------------------------------------

  const [orderHistorys, setOrderHistorys] = useState([])

  const getUserOrder = async (user_id) => {
    // console.log(user_id)
    // console.log('有在這裡嗎')
    try {
      const url = `http://localhost:3005/api/rent_history/${user_id}`
      const res = await axios.get(url, { withCredentials: true })

      const status = res.data.status
      if (status === 'success') {
        setOrderHistorys(res.data.history_rows)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 在list點選評價的同時 會送出這個搜尋 去抓取所選訂單內含的商品 以及對應的評價 然後將這個值傳遞進入modal裡面去顯示
  const getOrderComment = async (order_id) => {
    try {
      const url = `http://localhost:3005/api/rent_history/comment/${order_id}`
      const res = await axios.get(url)
      const status = res.data.status
      if (status === 'success') {
        const { commentItems } = res.data
        console.log(`一開始從後端抓的資料：`)
        console.log(commentItems)
        setOrderComment(commentItems)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
      getUserOrder(auth.userData.id)
    } else {
      console.log(`請登入`)
    }
  }, [auth])

  useEffect(() => {
    // console.log(orderHistorys)
  }, [orderHistorys, orderComment, statusName])

  return (
    <>
      <Header />
      <section className="mainArea-orderHistory-tian mainArea-tian">
        {/*## ↓↓↓↓ 側邊欄 ↓↓↓↓ */}
        <MemberSidebar />
        <main className="main-tian">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Breadcrumb items={breadcrumbItems} />
          {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
          <Page_title pageTitle={pageTitle} />
          {/*## ↓↓↓↓ 購物車訂單列表 ↓↓↓↓ */}
          <section className="orderList">
            <Order_status_tab
              statusName={statusName}
              setStatusName={setStatusName}
            />
            {/*## ↓↓↓↓ 訂單(店為單位) ↓↓↓↓ */}
            {isClient && orderHistorys ? (
              orderHistorys
                .filter((history, i) =>
                  statusName === '全部'
                    ? true
                    : history.order_status === statusName
                )
                .map((history, i) => {
                  return (
                    <OrderHistory_list
                      key={history.order_id}
                      history={history}
                      commentToggle={commentToggle}
                      setCommentToggle={setCommentToggle}
                      setOrderComment={setOrderComment}
                      getOrderComment={getOrderComment}
                      writeCommentToggle={writeCommentToggle}
                    />
                  )
                })
            ) : (
              <>
                <div className="sub-text-tian p1-tc-tian">目前無訂單記錄。</div>
              </>
            )}
          </section>
          {/* ↓↓↓↓ 分頁標籤（用易達做的組件） ↓↓↓↓ */}
          {/* <Page_tab /> */}
          {/* ↑↑↑↑ 分頁標籤 ↑↑↑↑ */}
        </main>
      </section>
      <Footer />
      <Top_btn />

      <Toaster />

      <CommentModal
        commentToggle={commentToggle}
        setCommentToggle={setCommentToggle}
        writeCommentToggle={writeCommentToggle}
        setWriteCommentToggle={setWriteCommentToggle}
        orderComment={orderComment}
        writeComment={writeComment}
        setWriteComment={setWriteComment}
      />
      <WriteCommentModal
        userId={userId}
        commentToggle={commentToggle}
        setCommentToggle={setCommentToggle}
        writeCommentToggle={writeCommentToggle}
        setWriteCommentToggle={setWriteCommentToggle}
        writeComment={writeComment}
        setWriteComment={setWriteComment}
        getOrderComment={getOrderComment}
        MySwal={MySwal}
      />
    </>
  )
}

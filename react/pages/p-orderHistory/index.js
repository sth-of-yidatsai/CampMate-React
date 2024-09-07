import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { useAuthTest } from '@/hooks/use-auth-test'

import Header from '@/components/template/header'
import Aside from '@/components/template/sidebar'
import Footer from '@/components/template/footer'

// 共同組件導入
import Bread_crumb from '@/components/tian/common/bread_crumb'
import Page_title from '@/components/tian/common/page_title'
import Page_tab from '@/components/tian/common/page_tab'
import Top_btn from '@/components/tian/common/top_btn'

import Order_status_tab from '@/components/tian/orderHistory/order_status_tab'
import OrderHistory_list from '@/components/tian/orderHistory/orderHistory_list'

import CommentModal from '@/components/tian/orderHistory/commentModal'
import WriteCommentModal from '@/components/tian/orderHistory/writeCommentModal'

export default function OrderHistory() {
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

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (auth.isAuth && auth.userData && auth.userData.id) {
      setUserId(auth.userData.id)
      getUserOrder(auth.userData.id)
    } else {
      console.log(`請登入`)
      setUserId(null) // 設置 userId 為 null
    }
  }, [auth])

  useEffect(() => {
    // console.log(orderHistorys)
  }, [orderHistorys])

  return (
    <>
      <Header />
      <section className="mainArea-orderHistory-tian mainArea-tian">
        {/*## ↓↓↓↓ 側邊欄 ↓↓↓↓ */}
        <Aside
          className="sidebar-tian"
          mainLabels={[
            {
              title: '大分類',
              icon: (
                <>
                  <span className="material-symbols-outlined">camping</span>
                </>
              ),
              subLabel: ['小分類'],
            },
            {
              title: '大分類',
              icon: (
                <>
                  <span className="material-symbols-outlined">camping</span>
                </>
              ),
              subLabel: ['小分類'],
            },
          ]}
        />
        <main className="main-tian">
          {/*## ↓↓↓↓ 麵包屑導覽 ↓↓↓↓ */}
          <Bread_crumb />
          {/*## ↓↓↓↓ 頁面標題 ↓↓↓↓ */}
          <Page_title pageTitle={pageTitle} />
          {/*## ↓↓↓↓ 購物車訂單列表 ↓↓↓↓ */}
          <section className="orderList">
            <Order_status_tab />
            {/*## ↓↓↓↓ 訂單(店為單位) ↓↓↓↓ */}
            {isClient && orderHistorys ? (
              orderHistorys.map((history, i) => {
                return (
                  <OrderHistory_list
                    key={history.order_id}
                    history={history}
                    commentToggle={commentToggle}
                    setCommentToggle={setCommentToggle}
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

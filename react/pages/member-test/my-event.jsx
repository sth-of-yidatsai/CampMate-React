import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/group-camping/my-event.module.scss'
// general components
import Header from '@/components/template/header'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'
import Aside from '@/components/template/sidebar'
import Footer from '@/components/template/footer'
import Pagination from '@/components/pagination/pagination'
import ModalCreateEvent from '@/components/group-camping/modal/modal-create-event'
import EventCard from '@/components/group-camping/my-event/event-card'

export default function MyEvent() {
  // breadcrumb items
  const items = [
    {
      name: 'HOME',
      href: '#',
    },
    {
      name: '會員中心',
      href: '#',
    },
    {
      name: '我的團露',
      href: '#',
    },
  ]
  // aside標籤
  const asideLabels = [
    {
      title: '帳戶資訊',
      icon: (
        <>
          <span class="material-symbols-outlined">person</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '收藏清單',
      icon: (
        <>
          <span class="material-symbols-outlined">favorite</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '訂單紀錄',
      icon: (
        <>
          <span class="material-symbols-outlined">shopping_basket</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '團露紀錄',
      icon: (
        <>
          <span class="material-symbols-outlined">groups</span>
        </>
      ),
      subLabel: ['我的團露'],
    },
    {
      title: '優惠券',
      icon: (
        <>
          <span class="material-symbols-outlined">confirmation_number</span>
        </>
      ),
      subLabel: ['小分類'],
    },
    {
      title: '客服中心',
      icon: (
        <>
          <span class="material-symbols-outlined">chat</span>
        </>
      ),
      subLabel: ['小分類'],
    },
  ]
  // ------------------------------------------------------
  // vvvvv  modal create event  vvvvv
  // 使用 useState 來管理 modal 的顯示狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 當按鈕被點擊時觸發的事件處理函式
  const handleModalOpen = () => {
    console.log('btnCreate clicked! open modal.')
    setIsModalOpen(true) // 設置 modal 為顯示狀態
  }
  // 關閉 modal 的函式
  const handleModalClose = () => {
    setIsModalOpen(false) // 設置 modal 為隱藏狀態
  }
  // ^^^^^  modal create event  ^^^^^
  // ------------------------------------------------------
  return (
    <>
      <Header />
      <section className={`${styles.main} ${styles.globe}`}>
        <Aside className="sidebarTian" mainLabels={asideLabels} />

        <main className={`${styles.pageContent}`}>
          <div className={`${styles.title}`}>
            <Breadcrumb items={items} />
            <p className={`${styles.h5Tc}`}>我的團露。</p>
          </div>
          <div className={`${styles.eventList}`}>
            <div className={`${styles.head} ${styles.p1Tc}`}>
              <div className={`${styles.tags}`}>
                <div
                  className={`${styles.tag} ${styles.tagAllEvent} ${styles.active}`}
                >
                  所有團露
                </div>
                <div className={`${styles.tag} ${styles.tagInProgress}`}>
                  進行中
                </div>
                <div className={`${styles.tag} ${styles.tagEnded}`}>已結束</div>
              </div>
              <button
                className={`${styles.btnCreate}`}
                onClick={handleModalOpen}
                ariaExpanded="false"
              >
                <span className="material-symbols-outlined">order_approve</span>
                建立團露
              </button>
            </div>
            <EventCard />
            <div className={styles.pagination}>
              <Pagination />
            </div>
          </div>
        </main>
      </section>

      {isModalOpen && <ModalCreateEvent onClose={handleModalClose} />}

      <Footer />
    </>
  )
}
